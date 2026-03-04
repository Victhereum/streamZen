/* content.js */

// Settings loaded from storage
let settings = {
  alwaysUnmute: false,
  autoSkip: false,
  instantSkip: false,
  skipIntroTime: 85,
  nextEpTime: 15
};

const SHOW_NEXT_BTN_LAST_SECONDS = 150; // Show the Next Episode button in the final 2.5 mins
const HIDE_SKIP_BTN_AFTER_SECONDS = 300; // Hide Skip Intro after 5 minutes

// Initialize settings
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.local.get({
    alwaysUnmute: false,
    autoSkip: false,
    instantSkip: false,
    skipIntroTime: 85,
    nextEpTime: 15
  }, (items) => {
    Object.assign(settings, items);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      for (let [key, { newValue }] of Object.entries(changes)) {
        if (settings[key] !== undefined) {
          settings[key] = newValue;
        }
      }
    }
  });
}

// State
let videoElement = null;
let currentVideoSrc = null;
let videoWrapper = null;
let nextEpisodeElement = null;
let skipButton = null;
let nextEpisodeButton = null;
let countdownOverlay = null;
let hasAutoPlayedNext = false;
let findingNextEpInterval = null;
let isSeries = false;
let hasAutoUnmuted = false;

// Auto-Skip States
let autoSkipIntroTimer = null;
let autoSkipIntroSeconds = 3;
let autoSkipIntroCancelled = false;

let autoSkipNextTimer = null;
let autoSkipNextSeconds = 3;
let autoSkipNextCancelled = false;

// The Intro DB State
let tidbDataFetched = false;
let tidbIntro = null;
let tidbCredits = null;

// Robust SPA Supervisor Loop
setInterval(() => {
  const video = document.querySelector('video');
  if (video && (video !== videoElement || video.src !== currentVideoSrc)) {
    console.log('[Moviebox Extension] New video state detected');
    
    // Cleanup old UI
    if (skipButton) skipButton.remove();
    if (nextEpisodeButton) nextEpisodeButton.remove();
    if (countdownOverlay) countdownOverlay.remove();
    if (findingNextEpInterval) {
        clearInterval(findingNextEpInterval);
        findingNextEpInterval = null;
    }

    // Update State
    videoElement = video;
    currentVideoSrc = video.src;
    videoWrapper = video.parentElement || video.parentNode;
    nextEpisodeElement = null;
    hasAutoPlayedNext = false;
    skipButton = null;
    nextEpisodeButton = null;
    countdownOverlay = null;
    isSeries = false;
    hasAutoUnmuted = false;

    if (autoSkipIntroTimer) clearInterval(autoSkipIntroTimer);
    autoSkipIntroTimer = null;
    autoSkipIntroCancelled = false;

    if (autoSkipNextTimer) clearInterval(autoSkipNextTimer);
    autoSkipNextTimer = null;
    autoSkipNextCancelled = false;

    // Reset TIDB state for new episode
    tidbDataFetched = false;
    tidbIntro = null;
    tidbCredits = null;

    if (!videoWrapper.dataset.mbxHover) {
       videoWrapper.addEventListener('mouseenter', () => videoWrapper.classList.add('mbx-video-wrapper-hover'));
       videoWrapper.addEventListener('mouseleave', () => videoWrapper.classList.remove('mbx-video-wrapper-hover'));
       videoWrapper.dataset.mbxHover = 'true';
    }

    if (getComputedStyle(videoWrapper).position === 'static') {
      videoWrapper.style.position = 'relative';
    }

    if (sessionStorage.getItem('mbx-resume-fullscreen') === 'true') {
        sessionStorage.removeItem('mbx-resume-fullscreen');
        
        let hasAttemptedFS = false;
        
        const attemptFullscreen = () => {
            if (hasAttemptedFS) return;
            
            // Check if we are already in fullscreen natively to avoid toggling it off
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
                console.log('[Moviebox Extension] Already in fullscreen mode. Skipping programmatic clip.');
                hasAttemptedFS = true;
                return;
            }

            console.log('[Moviebox Extension] Programmatically resuming fullscreen...');
            hasAttemptedFS = true;
            try {
                // Try hooking into the player's native fullscreen button to inherit its logic
                let fsBtn = document.querySelector('.art-control-fullscreen') || 
                            document.querySelector('.art-icon-fullscreen') ||
                            document.querySelector('[data-balloon="Web Fullscreen"]');
                
                if (fsBtn && typeof fsBtn.click === 'function') {
                    fsBtn.click();
                } else if (videoWrapper) {
                    if (videoWrapper.requestFullscreen) videoWrapper.requestFullscreen();
                    else if (videoWrapper.webkitRequestFullscreen) videoWrapper.webkitRequestFullscreen();
                }
            } catch(e) {
                console.log('[Moviebox Extension] Fullscreen resume blocked by browser gesture lock.', e);
            }
        };

        const fsMonitor = () => {
             if (hasAttemptedFS) {
                 videoElement.removeEventListener('timeupdate', fsMonitor);
                 return;
             }
             if (!videoElement.paused && videoElement.currentTime > 0.1) {
                 videoElement.removeEventListener('timeupdate', fsMonitor);
                 attemptFullscreen();
             }
        };
        
        videoElement.addEventListener('timeupdate', fsMonitor);
    }

    injectUI();
    attachVideoListeners();
    
    // Delay metadata extraction to allow the SPA DOM and localStorage to finish updating their state
    setTimeout(fetchIntroMetadata, 3000);
    
    findingNextEpInterval = setInterval(findNextEpisodeElement, 2000);
    findNextEpisodeElement();
  }
}, 1000);

if (!window.mbxCleanClickJacksStarted) {
  cleanClickJacks();
  window.mbxCleanClickJacksStarted = true;
}

async function fetchIntroMetadata() {
    if (tidbDataFetched) return;
    tidbDataFetched = true;
    console.log('[Moviebox Extension] Attempting to extract metadata for TIDB...');

    let imdbId = null;
    let season = null;
    let episode = null;

    // Extract IMDB ID & Season/Episode from the DOM
    const rawImdb = document.querySelector('[data-id*="tt"], a[href*="imdb.com/title/tt"]');
    if (rawImdb) {
        let match = (rawImdb.dataset.id || rawImdb.href).match(/tt\d{7,8}/);
        if (match) imdbId = match[0];
    }

    if (!imdbId) {
        // Fallback: Page source might contain it
        let htmlMatch = document.documentElement.innerHTML.match(/tt\d{7,8}/);
        if (htmlMatch) imdbId = htmlMatch[0];
    }
    
    // Fallback URL pattern for IMDB ids if present
    if (!imdbId) {
        let urlMatch = window.location.href.match(/tt\d{7,8}/);
        if (urlMatch) imdbId = urlMatch[0];
    }

    // Try finding active season/episode
    const activeEp = document.querySelector('[class*="active" i] > span, [class*="playing" i], [class*="current" i]');
    if (activeEp) {
        let text = activeEp.parentElement ? activeEp.parentElement.innerText + activeEp.innerText : activeEp.innerText;
        let epMatch = text.match(/Ep\s*(\d+)|Episode\s*(\d+)|^(\d+)$/i);
        if (epMatch) episode = parseInt(epMatch[1] || epMatch[2] || epMatch[3]);
    }
    
    const seasonBtn = document.querySelector('.season-btn, [class*="season" i][class*="active" i]');
    if (seasonBtn) {
        let snMatch = seasonBtn.innerText.match(/Season\s*(\d+)|^(\d+)$/i);
        if (snMatch) season = parseInt(snMatch[1] || snMatch[2]);
    }

    if (!season && /season[-_]?(\d+)/i.test(window.location.href)) season = parseInt(window.location.href.match(/season[-_]?(\d+)/i)[1]);
    if (!episode && /episode[-_]?(\d+)/i.test(window.location.href)) episode = parseInt(window.location.href.match(/episode[-_]?(\d+)/i)[1]);

    if (season !== null || episode !== null) {
        isSeries = true;
    } else if (activeEp || seasonBtn || /season|episode/i.test(window.location.href)) {
        isSeries = true;
    }

    // Fallback: Local Storage playHistory
    if (!season || !episode) {
        try {
            let histRaw = localStorage.getItem('playHistory');
            if (histRaw) {
                let histData = JSON.parse(histRaw);
                // Handle if it's an array of histories or a single object
                if (Array.isArray(histData) && histData.length > 0) {
                    if (!season && histData[0].curSe !== undefined) season = parseInt(histData[0].curSe);
                    if (!episode && histData[0].curEp !== undefined) episode = parseInt(histData[0].curEp);
                } else if (typeof histData === 'object' && !Array.isArray(histData)) {
                    // Handle dictionary/object format
                    // Check if the values are directly on the object or if it's a map
                    if (histData.curSe !== undefined || histData.curEp !== undefined) {
                        if (!season && histData.curSe !== undefined) season = parseInt(histData.curSe);
                        if (!episode && histData.curEp !== undefined) episode = parseInt(histData.curEp);
                    } else {
                        // If it's a map keyed by something else, grab the first value we find with curSe/curEp
                        let keys = Object.keys(histData);
                        for (let k of keys) {
                            if (histData[k] && typeof histData[k] === 'object' && histData[k].curSe !== undefined) {
                                if (!season) season = parseInt(histData[k].curSe);
                                if (!episode) episode = parseInt(histData[k].curEp);
                                break;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log('[Moviebox Extension] Failed to parse playHistory from localStorage:', e);
        }
    }

    // Fallback: Title Lookup via imdbot wrapper
    if (!imdbId) {
        console.log('[Moviebox Extension] Could not find explicit IMDB ID. Attempting title fallback lookup...');
        
        let titleRaw = "";
        let titleEl = document.querySelector('h2.pc-title') || document.querySelector('h1.pc-nav-title') || document.querySelector('title');
        if (titleEl) {
            titleRaw = titleEl.innerText || titleEl.textContent;
            console.log(`[Moviebox Extension] Using title for IMDB lookup: "${titleRaw}"`);
        }
        
        // Clean title (e.g. "Prison Break S1-S5" -> "Prison Break", "Movie Name (2024)" -> "Movie Name")
        let cleanTitle = titleRaw.replace(/S\d+(?:-S\d+)?(?:.*?)$/i, '') // Remove S1-S5 and anything after it
                                 .replace(/Season\s+\d+.*$/i, '') // Remove Season X
                                 .replace(/Ep(?:isode)?\s*\d+.*$/i, '') // Remove Episode X
                                 .replace(/\(\d{4}\)/, '') // Remove (2024)
                                 .replace(/(?:Watch|Online|Free|HD).*?$/ig, '') // Strip generic streaming site words usually in <title>
                                 .split('-')[0] // Sometimes title is "Movie Name - Watch Free"
                                 .trim();
        
        if (cleanTitle) {
            console.log(`[Moviebox Extension] Using cleaned title for IMDB lookup: "${cleanTitle}"`);
            
            let cacheKey = 'mbx-imdb-' + cleanTitle.toLowerCase();
            let cachedImdb = localStorage.getItem(cacheKey);
            
            if (cachedImdb) {
                console.log(`[Moviebox Extension] Found IMDB ID in cache for "${cleanTitle}": ${cachedImdb}`);
                imdbId = cachedImdb;
            } else {
                try {
                    let searchUrl = `https://search.imdbot.workers.dev/?q=${encodeURIComponent(cleanTitle)}`;
                    let res = await fetch(searchUrl);
                    if (res.ok) {
                        let searchData = await res.json();
                        if (searchData.description && searchData.description.length > 0) {
                            imdbId = searchData.description[0]['#IMDB_ID'];
                            if (imdbId) {
                                console.log(`[Moviebox Extension] Resolved IMDB ID from API: ${imdbId}. Caching it.`);
                                localStorage.setItem(cacheKey, imdbId);
                            }
                        }
                    }
                } catch (e) {
                    console.log(`[Moviebox Extension] Imdbot search failed.`, e);
                }
            }
        }
    }

    if (!imdbId) {
        console.log('[Moviebox Extension] Could not resolve IMDB ID. Operating with generic fallback logic.');
        return;
    }

    console.log(`[Moviebox Extension] Discovered Metadata -> IMDB: ${imdbId} | Season: ${season} | Episode: ${episode}`);
    
    // Fetch from TIDB
    try {
        let url = `https://api.theintrodb.org/v2/media?imdb_id=${imdbId}`;
        if (season && episode) {
            url += `&season=${season}&episode=${episode}`;
        }
        
        console.log(`[Moviebox Extension] Querying TIDB: ${url}`);
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.intro && data.intro.length > 0) {
                tidbIntro = data.intro[0];
                console.log(`[Moviebox Extension] TIDB INTRO MATCH: ${tidbIntro.start_ms || 0}ms to ${tidbIntro.end_ms}ms`);
            }
            if (data.credits && data.credits.length > 0) {
                tidbCredits = data.credits[0];
                console.log(`[Moviebox Extension] TIDB CREDITS MATCH: Starting at ${tidbCredits.start_ms}ms`);
            }
        } else {
            console.log('[Moviebox Extension] TIDB returned no matching exact timestamps (404/Error). Operating with fallback logic.');
        }
    } catch (e) {
        console.error('[Moviebox Extension] Failed to reach TIDB API. Continuing with fallback heuristics.', e);
    }
}

function findNextEpisodeElement() {
  if (nextEpisodeElement) {
    clearInterval(findingNextEpInterval);
    return;
  }

  // 1. Generic heuristic based on explicit "Next" text matching
  const allElements = document.querySelectorAll('button, a, div, span, li, p');
  for (let el of allElements) {
    if (el.children.length > 2 || !el.innerText) continue;
    const text = el.innerText.toLowerCase().trim();
    if (['next', 'next episode', 'next-ep', 'next >', '>'].includes(text) || text === 'next ep') {
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          nextEpisodeElement = el;
          isSeries = true;
          console.log('[Moviebox Extension] Next episode found by text heuristic:', nextEpisodeElement, 'Text:', text);
          updateUIToShowNextButton();
          return;
        }
    }
  }

  // 2. Look for active elements in the episode list via classes
  const activeSelectors = [
    '[class*="active" i]', '[class*="playing" i]', '[class*="current" i]', '[class*="selected" i]'
  ];
  for (let selector of activeSelectors) {
    const activeNodes = document.querySelectorAll(selector);
    for (let activeEp of activeNodes) {
      let next = activeEp.nextElementSibling;
      // Navigate up to find a sibling if needed (sometimes the class is on an inner span)
      if (!next && activeEp.parentElement) {
        next = activeEp.parentElement.nextElementSibling;
      }
      
      if (next && next !== activeEp) {
        const text = next.innerText ? next.innerText.trim() : '';
        // If next sibling is a short number or contains "ep", it's very likely the next episode
        if (/^\d{1,3}$/.test(text) || /ep\s*\d+/i.test(text) || /episode\s*\d+/i.test(text)) {
            nextEpisodeElement = next;
            isSeries = true;
            console.log('[Moviebox Extension] Found next episode element from class ('+selector+'):', nextEpisodeElement, 'Text:', text);
            updateUIToShowNextButton();
            return;
        }
      }
    }
  }

  // 3. Smart Grid Detector (Visual layout based on screenshot)
  const numberElements = [];
  document.querySelectorAll('div, a, span, button, li').forEach(el => {
    if (el.children.length <= 1) {
       const text = el.innerText ? el.innerText.trim() : '';
       if (/^\d{1,3}$/.test(text)) {
          numberElements.push(el);
       }
    }
  });

  for (let el of numberElements) {
    const prev = el.previousElementSibling;
    if (prev) {
      const hasSvg = prev.querySelector('svg') !== null || prev.tagName.toLowerCase() === 'svg';
      const hasImg = prev.querySelector('img') !== null;
      
      let looksActive = false;
      if (hasSvg || hasImg) {
         looksActive = true;
      } else {
         const prevClass = prev.className || '';
         if (typeof prevClass === 'string' && (prevClass.includes('play') || prevClass.includes('active') || prevClass.includes('on'))) {
           looksActive = true;
         }
      }

      if (looksActive) {
         let target = el;
         if (target.parentElement && target.parentElement.children.length === 1 && target.parentElement.tagName !== 'DIV') {
            target = target.parentElement;
         }

         nextEpisodeElement = target;
         isSeries = true;
         console.log('[Moviebox Extension] Found next episode element via Grid Detector:', nextEpisodeElement, 'Text:', el.innerText);
         updateUIToShowNextButton();
         return;
      }
    }
  }
}

function updateUIToShowNextButton() {
  if (nextEpisodeButton && !nextEpisodeButton.parentNode && videoWrapper) {
    videoWrapper.appendChild(nextEpisodeButton);
  }
}

function playNextEpisode() {
  if (nextEpisodeElement) {
    console.log('[Moviebox Extension] Firing click on Next Episode Element:', nextEpisodeElement);
    hasAutoPlayedNext = true;

    // Track if fullscreen was active right before navigating away
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        sessionStorage.setItem('mbx-resume-fullscreen', 'true');
        console.log('[Moviebox Extension] Locked fullscreen state for the next episode.');
    }
    
    if (nextEpisodeElement.href && nextEpisodeElement.href !== window.location.href && !nextEpisodeElement.href.includes('javascript:')) {
      window.location.href = nextEpisodeElement.href;
    } else {
      nextEpisodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      const evInit = { bubbles: true, cancelable: true, view: window };
      nextEpisodeElement.dispatchEvent(new MouseEvent('pointerdown', evInit));
      nextEpisodeElement.dispatchEvent(new MouseEvent('mousedown', evInit));
      nextEpisodeElement.dispatchEvent(new MouseEvent('pointerup', evInit));
      nextEpisodeElement.dispatchEvent(new MouseEvent('mouseup', evInit));
      nextEpisodeElement.dispatchEvent(new MouseEvent('click', evInit));
      
      if (typeof nextEpisodeElement.click === 'function') {
        nextEpisodeElement.click();
      }
    }
  } else {
    console.log('[Moviebox Extension] playNextEpisode called but no element found!');
  }
}

function injectUI() {
  if (!videoWrapper) return;

  // 1. Skip Intro Button
  skipButton = document.createElement('button');
  skipButton.className = 'mbx-skip-intro-btn';
  skipButton.innerText = 'Skip Intro';
  skipButton.style.display = 'block';
  skipButton.onclick = (e) => {
    e.stopPropagation();
    
    // If we're clicking it while it's auto-skipping, CANCEL the auto-skip instead of skipping
    if (autoSkipIntroTimer) {
        clearInterval(autoSkipIntroTimer);
        autoSkipIntroTimer = null;
        autoSkipIntroCancelled = true;
        skipButton.innerText = 'Skip Intro';
        return;
    }
    
    if (videoElement) {
      if (tidbIntro && tidbIntro.end_ms) {
         videoElement.currentTime = tidbIntro.end_ms / 1000;
         console.log(`[Moviebox Extension] Skipped exactly to Intro End: ${tidbIntro.end_ms}ms`);
      } else {
         videoElement.currentTime += settings.skipIntroTime;
         console.log(`[Moviebox Extension] Skipped generic ${settings.skipIntroTime}s`);
      }
      skipButton.dataset.clicked = "true";
      skipButton.style.display = 'none';
    }
  };
  videoWrapper.appendChild(skipButton);

  // 2. Next Episode Button
  nextEpisodeButton = document.createElement('button');
  nextEpisodeButton.className = 'mbx-next-episode-btn';
  nextEpisodeButton.innerText = 'Next Episode';
  nextEpisodeButton.style.display = 'none'; // hidden until end of movie
  nextEpisodeButton.onclick = (e) => {
    e.stopPropagation();
    playNextEpisode();
  };
  
  // 3. Countdown Overlay
  countdownOverlay = document.createElement('div');
  countdownOverlay.className = 'mbx-countdown-overlay';
  countdownOverlay.innerHTML = `
    <div class="mbx-countdown-title">Next Episode playing in</div>
    <div class="mbx-countdown-number" id="mbx-countdown-val">-</div>
    <div class="mbx-countdown-actions">
      <button class="mbx-action-btn mbx-btn-play" id="mbx-btn-play-now">Play Now</button>
      <button class="mbx-action-btn mbx-btn-cancel" id="mbx-btn-cancel-next">Cancel</button>
    </div>
  `;
  videoWrapper.appendChild(countdownOverlay);

  // Bind Countdown Actions
  document.getElementById('mbx-btn-play-now').onclick = (e) => {
    e.stopPropagation();
    playNextEpisode();
  };

  document.getElementById('mbx-btn-cancel-next').onclick = (e) => {
    e.stopPropagation();
    hideCountdown();
    if (autoSkipNextTimer) {
        clearInterval(autoSkipNextTimer);
        autoSkipNextTimer = null;
    }
    autoSkipNextCancelled = true; 
    hasAutoPlayedNext = true; 
  };
}

function attachVideoListeners() {
  if (!videoElement || videoElement.dataset.mbxAttached === 'true') return;
  videoElement.dataset.mbxAttached = 'true';

  videoElement.addEventListener('playing', () => {
    if (settings.alwaysUnmute && !hasAutoUnmuted) {
        hasAutoUnmuted = true;
        if (videoElement.muted) {
            videoElement.muted = false;
        }
        if (videoElement.volume === 0) {
            videoElement.volume = 1;
        }
        console.log('[Moviebox Extension] Auto-unmuted player');
    }
  });

  videoElement.addEventListener('timeupdate', () => {
    if (isNaN(videoElement.duration)) return;

    const timeLeft = videoElement.duration - videoElement.currentTime;

    // Visibility configuration for Next Episode Button
    if (nextEpisodeButton && nextEpisodeElement) {
        let isCreditsTime = false;
        let validCreditsStartMs = (tidbCredits && tidbCredits.start_ms && tidbCredits.start_ms / 1000 < videoElement.duration - 5) 
                                    ? tidbCredits.start_ms 
                                    : null;

        if (validCreditsStartMs) {
            isCreditsTime = (videoElement.currentTime * 1000) >= validCreditsStartMs;
        } else {
            isCreditsTime = timeLeft <= SHOW_NEXT_BTN_LAST_SECONDS && timeLeft > 0;
        }

        if (isSeries && isCreditsTime) {
            if (nextEpisodeButton.style.display === 'none') {
                nextEpisodeButton.style.display = 'block';
            }
        } else {
            if (nextEpisodeButton.style.display === 'block') {
                nextEpisodeButton.style.display = 'none';
            }
        }
    }

    // Visibility configuration for Skip Intro
    if (skipButton && skipButton.dataset.clicked !== "true") {
        let isIntroTime = false;
        let exactIntro = false;
        
        if (tidbIntro && tidbIntro.end_ms) {
            let start = tidbIntro.start_ms || 0;
            let currentMs = videoElement.currentTime * 1000;
            isIntroTime = currentMs >= start && currentMs <= tidbIntro.end_ms;
            exactIntro = true;
            
            // Auto-hide the button safely if they manually scrubbed past the precise intro
            if (currentMs > tidbIntro.end_ms + 2000) skipButton.dataset.clicked = "true";
        } else {
             isIntroTime = videoElement.currentTime <= HIDE_SKIP_BTN_AFTER_SECONDS;
        }

        if (isSeries && isIntroTime) {
            if (settings.autoSkip && exactIntro && !autoSkipIntroCancelled) {
                if (settings.instantSkip) {
                    if (skipButton.dataset.clicked !== "true") {
                        console.log(`[Moviebox Extension] Auto-skipping using exact TIDB intro trigger.`);
                        skipButton.click();
                    }
                } else {
                    if (!autoSkipIntroTimer && skipButton.dataset.clicked !== "true") {
                        autoSkipIntroSeconds = 3;
                        skipButton.innerText = `Auto-skipping in ${autoSkipIntroSeconds}s (Cancel)`;
                        if (skipButton.style.display === 'none') skipButton.style.display = 'block';
                        
                        autoSkipIntroTimer = setInterval(() => {
                            autoSkipIntroSeconds -= 1;
                            if (autoSkipIntroSeconds <= 0) {
                                clearInterval(autoSkipIntroTimer);
                                autoSkipIntroTimer = null;
                                if (skipButton.dataset.clicked !== "true" && !autoSkipIntroCancelled) {
                                    skipButton.click();
                                }
                            } else {
                                skipButton.innerText = `Auto-skipping in ${autoSkipIntroSeconds}s (Cancel)`;
                            }
                        }, 1000);
                    }
                }
            } else if (!settings.autoSkip || !exactIntro || autoSkipIntroCancelled) {
                if (skipButton.style.display === 'none') skipButton.style.display = 'block';
                if (skipButton.innerText !== 'Skip Intro' && !autoSkipIntroTimer) {
                    skipButton.innerText = 'Skip Intro';
                }
            }
        } else {
            if (skipButton.style.display === 'block') {
                skipButton.style.display = 'none';
                if (autoSkipIntroTimer) {
                    clearInterval(autoSkipIntroTimer);
                    autoSkipIntroTimer = null;
                }
            }
        }
    }
    
    if (hasAutoPlayedNext || !nextEpisodeElement) return;
    
    // Start countdown if we are within the last N seconds (or exact Credits offset)
    let autoPlayCountdownSecondsLeft = 0;
    let validCreditsStartMs = (tidbCredits && tidbCredits.start_ms && tidbCredits.start_ms / 1000 < videoElement.duration - 5) 
                                ? tidbCredits.start_ms 
                                : null;
    
    if (validCreditsStartMs) {
        // Offset countdown relative to exactly when Credits begin
        let secondsPastCredits = videoElement.currentTime - (validCreditsStartMs / 1000);
        if (secondsPastCredits >= 0) {
           autoPlayCountdownSecondsLeft = settings.nextEpTime - secondsPastCredits;
        }
    } else {
        // Fallback: End of video generic threshold
        if (timeLeft > 0 && Math.ceil(timeLeft) <= settings.nextEpTime) {
           autoPlayCountdownSecondsLeft = timeLeft;
        }
    }

    if (isSeries && autoPlayCountdownSecondsLeft > 0 && autoPlayCountdownSecondsLeft <= settings.nextEpTime) {
      if (settings.autoSkip && !hasAutoPlayedNext && !autoSkipNextCancelled) {
          if (settings.instantSkip) {
              playNextEpisode();
          } else {
              if (!autoSkipNextTimer) {
                  autoSkipNextSeconds = 3;
                  showCountdown(autoSkipNextSeconds);
                  
                  const titleEl = document.querySelector('.mbx-countdown-title');
                  if (titleEl) titleEl.innerText = "Auto-skipping to Next Episode in";
                  
                  autoSkipNextTimer = setInterval(() => {
                      autoSkipNextSeconds -= 1;
                      if (autoSkipNextSeconds <= 0) {
                          clearInterval(autoSkipNextTimer);
                          autoSkipNextTimer = null;
                          if (!hasAutoPlayedNext && !autoSkipNextCancelled) {
                              playNextEpisode();
                          }
                      } else {
                          showCountdown(autoSkipNextSeconds);
                      }
                  }, 1000);
              }
          }
      } else if (!settings.autoSkip && !hasAutoPlayedNext) {
          // Standard countdown
          const titleEl = document.querySelector('.mbx-countdown-title');
          if (titleEl) titleEl.innerText = "Next Episode playing in";
          showCountdown(Math.ceil(autoPlayCountdownSecondsLeft));
      } else if (autoSkipNextCancelled && !hasAutoPlayedNext) {
          hideCountdown();
      }
    } else {
      hideCountdown();
      if (autoSkipNextTimer) {
          clearInterval(autoSkipNextTimer);
          autoSkipNextTimer = null;
      }
    }
    
    // Auto-play trigger if the standard countdown expires
    if (autoPlayCountdownSecondsLeft !== 0 && autoPlayCountdownSecondsLeft <= 0.5 && !hasAutoPlayedNext) {
        playNextEpisode();
    }
  });

  videoElement.addEventListener('ended', () => {
    if (!hasAutoPlayedNext && nextEpisodeElement) {
      playNextEpisode();
    }
  });

  // Autoplay attempt
  setTimeout(() => {
    try {
      if (videoElement.paused) {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('[Moviebox Extension] Autoplay blocked by browser. User interaction required.', err);
          });
        }
      }
    } catch (e) { }
  }, 1000);
}

function showCountdown(secondsLeft) {
  if (!countdownOverlay) return;
  
  countdownOverlay.classList.add('show');
  const numberEl = document.getElementById('mbx-countdown-val');
  if (numberEl) {
    numberEl.innerText = secondsLeft;
  }
}

function hideCountdown() {
  if (!countdownOverlay) return;
  countdownOverlay.classList.remove('show');
}

// Aggressive Ad/Clickjack removal
function cleanClickJacks() {
  setInterval(() => {
    // 1. Explicitly remove known visible popup ads
    const explicitAds = document.querySelectorAll('.pauseNativePC, .adIcon, [class*="pauseNative"]');
    explicitAds.forEach(ad => {
        console.log('[Moviebox Extension] Removed known popup ad:', ad);
        ad.remove();
    });

    // 2. Scan for transparent clickjacks
    const divs = document.querySelectorAll('div, a');
    const safeClasses = ['mbx', 'art-', 'vjs-', 'jw-', 'plyr-', 'dplayer-', 'fp-', 'html5-'];
    
    divs.forEach(div => {
      // Don't remove extension UI or video player logic wrappers
      let classes = (div.className && typeof div.className === 'string') ? div.className.toLowerCase() : '';
      if (safeClasses.some(c => classes.includes(c))) return;
      if (div.querySelector('video')) return; 

      const style = window.getComputedStyle(div);
      if (style.position !== 'absolute' && style.position !== 'fixed') return;
      
      let zIndex = parseInt(style.zIndex, 10);
      if (isNaN(zIndex) || zIndex < 50) return;

      let opacity = parseFloat(style.opacity);
      // Transparent click zones
      let isInvisible = opacity < 0.1 || style.backgroundColor === 'rgba(0, 0, 0, 0)' || style.backgroundColor === 'transparent';
      
      let w = div.clientWidth || div.offsetWidth;
      let h = div.clientHeight || div.offsetHeight;
      
      let coversScreen = w > window.innerWidth * 0.5 && h > window.innerHeight * 0.5;
      let coversPlayer = videoWrapper && w >= videoWrapper.clientWidth * 0.8 && h >= videoWrapper.clientHeight * 0.8;

      if (isInvisible && (coversScreen || coversPlayer)) {
         if (div.innerText.trim() === '' && !div.querySelector('img') && !div.querySelector('svg')) {
             console.log('[Moviebox Extension] Removed empty clickjack overlay:', div);
             div.remove();
         }
      }
    });

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        const style = window.getComputedStyle(iframe);
        if (style.position !== 'absolute') return;
        
        let w = iframe.clientWidth || iframe.offsetWidth;
        let opacity = parseFloat(style.opacity);
        
        let coversPlayer = videoWrapper && w >= videoWrapper.clientWidth * 0.8;
        
        if ((opacity < 0.1 || style.visibility === 'hidden') && (w > 300 || coversPlayer)) {
            console.log('[Moviebox Extension] Removed clickjack iframe:', iframe);
            iframe.remove();
        }
    });
  }, 1000); // Polling every 1s to aggressively intercept ad insertions
}
