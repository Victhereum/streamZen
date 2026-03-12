# PR Description: StreamZen Feature Updates & Improvements

## Overview
This PR introduces several key updates to the StreamZen extension and its landing page, focused on cross-platform availability, user synchronization, and UI maintenance.

## Changes

### 1. Microsoft Edge Store Integration
- **Landing Page Update**: Modified the [detectBrowser](file:///c:/Users/Victhereum/Documents/GitHub/Flourish/moviebox-extension/landing-page/src/App.tsx#115-142) and `detectStore` logic in [App.tsx](file:///c:/Users/Victhereum/Documents/GitHub/Flourish/moviebox-extension/landing-page/src/App.tsx) to conditionally provide the Microsoft Edge Add-ons link when the user visits from an Edge browser.
- **Improved UX**: Users on Edge are now directed to the browser-native store instead of the Chrome Web Store.

### 2. Synchronized Skip Intro Logic
- **Precision Timing**: Removed the legacy 5-minute hardcoded limit for the "Skip Intro" button.
- **Dashboard Integration**: The "Skip Intro" button visibility now synchronizes directly with the user's "Skip Intro Time" setting from the dashboard dashboard.
- **TIDB Fallback**: Maintained existing TIDB (The Intro DB) timestamp logic for precision skipping while ensuring the fallback timer is user-controlled.

### 3. Dynamic Versioning System
- **Automated Version Display**: Updated the settings popup to retrieve the version number directly from [manifest.json](file:///c:/Users/Victhereum/Documents/GitHub/Flourish/moviebox-extension/extension/manifest.json) using `chrome.runtime.getManifest()`.
- **Maintenance Reduction**: Eliminates the need to manually update HTML version tags during releases.

## Technical Details
- **Files Modified**: 
  - [landing-page/src/App.tsx](file:///c:/Users/Victhereum/Documents/GitHub/Flourish/moviebox-extension/landing-page/src/App.tsx): Added store link constants and conditional rendering.
  - [extension/content.js](file:///c:/Users/Victhereum/Documents/GitHub/Flourish/moviebox-extension/extension/content.js): Updated visibility thresholds to use `settings.skipIntroTime`.
  - [extension/popup.html](file:///c:/Users/Victhereum/Documents/GitHub/Flourish/moviebox-extension/extension/popup.html): Added ID for dynamic version injection.
  - [extension/popup.js](file:///c:/Users/Victhereum/Documents/GitHub/Flourish/moviebox-extension/extension/popup.js): Implementation of dynamic version retrieval.

## Verification Results
- [x] Landing page correctly identifies Edge and shows the Microsoft store link.
- [x] Skip Intro button disappears after the duration specified in settings.
- [x] Dashboard version matches [manifest.json](file:///c:/Users/Victhereum/Documents/GitHub/Flourish/moviebox-extension/extension/manifest.json) version string.
