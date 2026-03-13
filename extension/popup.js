document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    alwaysUnmute: document.getElementById('alwaysUnmute'),
    autoSkip: document.getElementById('autoSkip'),
    instantSkip: document.getElementById('instantSkip'),
    instantSkipContainer: document.getElementById('instantSkipContainer'),
    skipIntroTime: document.getElementById('skipIntroTime'),
    skipIntroTimeVal: document.getElementById('skipIntroTimeVal'),
    nextEpTime: document.getElementById('nextEpTime'),
    nextEpTimeVal: document.getElementById('nextEpTimeVal')
  };

  // Load settings
  chrome.storage.local.get({
    alwaysUnmute: false,
    autoSkip: false,
    instantSkip: false,
    skipIntroTime: 85,
    nextEpTime: 15
  }, (items) => {
    elements.alwaysUnmute.checked = items.alwaysUnmute;
    elements.autoSkip.checked = items.autoSkip;
    elements.instantSkip.checked = items.instantSkip;
    elements.skipIntroTime.value = items.skipIntroTime;
    elements.nextEpTime.value = items.nextEpTime;
    
    elements.instantSkipContainer.style.opacity = items.autoSkip ? '1' : '0.5';
    elements.instantSkip.disabled = !items.autoSkip;
    
    updateSlider(elements.skipIntroTime, elements.skipIntroTimeVal);
    updateSlider(elements.nextEpTime, elements.nextEpTimeVal);
  });

  // Save changes
  elements.alwaysUnmute.addEventListener('change', (e) => save('alwaysUnmute', e.target.checked));
  
  elements.autoSkip.addEventListener('change', (e) => {
    save('autoSkip', e.target.checked);
    elements.instantSkipContainer.style.opacity = e.target.checked ? '1' : '0.5';
    elements.instantSkip.disabled = !e.target.checked;
  });
  
  elements.instantSkip.addEventListener('change', (e) => save('instantSkip', e.target.checked));
  
  elements.skipIntroTime.addEventListener('input', (e) => {
    updateSlider(e.target, elements.skipIntroTimeVal);
  });
  elements.skipIntroTime.addEventListener('change', (e) => {
    save('skipIntroTime', parseInt(e.target.value, 10));
  });

  elements.nextEpTime.addEventListener('input', (e) => {
    updateSlider(e.target, elements.nextEpTimeVal);
  });
  elements.nextEpTime.addEventListener('change', (e) => {
    save('nextEpTime', parseInt(e.target.value, 10));
  });

  function save(key, value) {
    chrome.storage.local.set({ [key]: value });
  }

  function updateSlider(slider, valEl) {
    valEl.textContent = slider.value + 's';
    const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.backgroundSize = percent + '% 100%';
    slider.style.setProperty('--value', percent + '%');
  }

  // Set Version Number dynamically
  const versionDisplay = document.getElementById('versionDisplay');
  if (versionDisplay && chrome.runtime && chrome.runtime.getManifest) {
    versionDisplay.textContent = 'Version ' + chrome.runtime.getManifest().version;
  }
});
