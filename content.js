/* content.js */

// Constants
const SKIP_INTRO_SECONDS = 85;
const NEXT_EPISODE_COUNTDOWN_SECONDS = 15;
const SHOW_NEXT_BTN_LAST_SECONDS = 150; // Show the Next Episode button in the final 2.5 mins
const HIDE_SKIP_BTN_AFTER_SECONDS = 300; // Hide Skip Intro after 5 minutes

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

    if (!videoWrapper.dataset.mbxHover) {
       videoWrapper.addEventListener('mouseenter', () => videoWrapper.classList.add('mbx-video-wrapper-hover'));
       videoWrapper.addEventListener('mouseleave', () => videoWrapper.classList.remove('mbx-video-wrapper-hover'));
       videoWrapper.dataset.mbxHover = 'true';
    }

    if (getComputedStyle(videoWrapper).position === 'static') {
      videoWrapper.style.position = 'relative';
    }

    injectUI();
    attachVideoListeners();
    
    findingNextEpInterval = setInterval(findNextEpisodeElement, 2000);
    findNextEpisodeElement();
  }
}, 1000);

if (!window.mbxCleanClickJacksStarted) {
  cleanClickJacks();
  window.mbxCleanClickJacksStarted = true;
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
    if (videoElement) {
      videoElement.currentTime += SKIP_INTRO_SECONDS;
      console.log(`[Moviebox Extension] Skipped ${SKIP_INTRO_SECONDS}s`);
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
    <div class="mbx-countdown-number" id="mbx-countdown-val">${NEXT_EPISODE_COUNTDOWN_SECONDS}</div>
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
    hasAutoPlayedNext = true; 
  };
}

function attachVideoListeners() {
  if (!videoElement || videoElement.dataset.mbxAttached === 'true') return;
  videoElement.dataset.mbxAttached = 'true';

  videoElement.addEventListener('timeupdate', () => {
    if (isNaN(videoElement.duration)) return;

    const timeLeft = videoElement.duration - videoElement.currentTime;

    // Visibility configuration for Next Episode Button
    if (nextEpisodeButton && nextEpisodeElement) {
        if (timeLeft <= SHOW_NEXT_BTN_LAST_SECONDS && timeLeft > 0) {
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
        if (videoElement.currentTime <= HIDE_SKIP_BTN_AFTER_SECONDS) {
            if (skipButton.style.display === 'none') skipButton.style.display = 'block';
        } else {
            if (skipButton.style.display === 'block') skipButton.style.display = 'none';
        }
    }
    
    if (hasAutoPlayedNext || !nextEpisodeElement) return;
    
    // Start countdown if we are within the last N seconds
    if (timeLeft > 0 && timeLeft <= NEXT_EPISODE_COUNTDOWN_SECONDS) {
      showCountdown(Math.ceil(timeLeft));
    } else {
      hideCountdown();
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
    const divs = document.querySelectorAll('div');
    divs.forEach(div => {
      const style = window.getComputedStyle(div);
      if ((style.position === 'absolute' || style.position === 'fixed') && 
          style.zIndex > 1000 && 
          parseFloat(style.opacity) < 0.1 && 
          div.clientWidth > window.innerWidth * 0.5 && 
          div.clientHeight > window.innerHeight * 0.5 &&
          !div.className.includes('mbx')) {
        console.log('[Moviebox Extension] Removed clickjack overlay:', div);
        div.remove();
      }
    });

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        const style = window.getComputedStyle(iframe);
        if (style.position === 'absolute' && parseFloat(style.opacity) < 0.1 && iframe.clientWidth > 300) {
            console.log('[Moviebox Extension] Removed clickjack iframe:', iframe);
            iframe.remove();
        }
    });
  }, 2000);
}
