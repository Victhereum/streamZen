<p align="center">
  <img src="extension/icons/logo128.png" alt="StreamZen Logo" width="100" />
</p>

<h1 align="center">StreamZen</h1>

<p align="center">
  <b>The Netflix experience for Moviebox and beyond.</b><br />
  Auto-skip intros · Smart autoplay · Fullscreen persistence · Ad cleanup
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/streamzen-cinematic-compa/ffkoailjikbieofjmojdpnhfcighomli">
    <img src="https://img.shields.io/chrome-web-store/v/ffkoailjikbieofjmojdpnhfcighomli?style=for-the-badge&logo=googlechrome&logoColor=white&label=Chrome%20Web%20Store&color=bdde00" alt="Chrome Web Store" />
  </a>
  <a href="https://github.com/victhereum/streamZen/stargazers">
    <img src="https://img.shields.io/github/stars/victhereum/streamZen?style=for-the-badge&logo=github&color=bdde00" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/victhereum/streamZen/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/victhereum/streamZen?style=for-the-badge&color=27272a" alt="License" />
  </a>
  <a href="https://streamzen.victhereum.com">
    <img src="https://img.shields.io/badge/Website-streamzen.victhereum.com-bdde00?style=for-the-badge&logo=safari&logoColor=white" alt="Website" />
  </a>
</p>

---

## 🎬 What is StreamZen?

StreamZen is a **free, open-source Chrome extension** that turns your Moviebox (and similar) streaming experience into something that feels like Netflix. No more:

- ❌ Manually clicking "Skip Intro" every episode
- ❌ Fumbling for the next episode button during the credits
- ❌ Getting kicked out of fullscreen between episodes
- ❌ Accidentally clicking invisible ad overlays

StreamZen handles all of it automatically — **install it and forget it**.

---

## ✨ Features

| Feature                       | Description                                                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⏭️ **Auto Skip Intro**        | Precisely identifies and skips intros using [The Intro DB (TIDB)](https://www.theintrodb.org/) timestamps. Falls back to a configurable generic skip when data isn't available.       |
| 📺 **Smart Next Episode**     | Detects the next episode in the player's UI and triggers a Netflix-style countdown overlay when credits begin.                                                                        |
| 🖥️ **Fullscreen Persistence** | Remembers your fullscreen state and re-enters it automatically when the next episode loads — no more toggling.                                                                        |
| 🛡️ **Ad & Clickjack Removal** | Aggressively removes invisible click-hijacking overlays and hidden ad iframes so your clicks land where they should.                                                                  |
| ▶️ **Autoplay on Load**       | Automatically starts playback when you land on a video page. No more clicking "play" after every navigation.                                                                          |
| 🔍 **Metadata Resolution**    | Automatically resolves movie/show titles to IMDB IDs via [Imdbot](https://search.imdbot.workers.dev/), then fetches precise intro/credits data from TIDB. Results are cached locally. |

---

## 🌐 Supported Sites

StreamZen works on all major Moviebox platforms and affiliates:

| Site                  | Domain               |
| --------------------- | -------------------- |
| 🎬 Moviebox           | `moviebox.ph`        |
| 🎬 123movienow        | `123movienow.cc`     |
| 🎬 NetNaija           | `netnaija.film`      |
| 🎬 SFlix              | `sflix.film`         |
| 🎬 Moviebox Online    | `movieboxonline.net` |
| 🎬 Moviebox India     | `moviebox.in`        |
| 🎬 Moviebox Pakistan  | `moviebox.pk`        |
| 🎬 Moviebox Indonesia | `moviebox.id`        |

> **Want to add a new site?** See the [Contributing](#-contributing) section below.

---

## 🚀 Installation

### From the Chrome Web Store (Recommended)

1. Visit the [StreamZen Chrome Web Store listing](https://chromewebstore.google.com/detail/streamzen-cinematic-compa/ffkoailjikbieofjmojdpnhfcighomli)
2. Click **"Add to Chrome"**
3. Done! Navigate to any supported site and start watching.

### From Source (Developer Mode)

1. Clone the repository:
   ```bash
   git clone https://github.com/victhereum/streamZen.git
   cd streamZen
   ```
2. Open your Chromium browser and go to `chrome://extensions`
3. Enable **Developer Mode** (toggle in the top-right)
4. Click **"Load unpacked"**
5. Select the `extension/` folder
6. You're live! 🎉

> **Works on:** Chrome, Edge, Brave, Arc, Opera, and any Chromium-based browser.

---

## 🧠 How It Works

StreamZen is a single content script (`content.js`) that runs on supported streaming sites. Here's the flow:

```
┌─────────────────────────────────────────────────────────┐
│                    Page Loads                            │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  SPA Supervisor Loop (1s interval)                      │
│  Detects new <video> elements or source changes         │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  1. Inject UI (Skip Intro btn, Next Episode btn,        │
│     Countdown Overlay)                                  │
│  2. Attach video event listeners (timeupdate, ended)    │
│  3. Start metadata fetch (delayed 3s for SPA state)     │
│  4. Begin searching for the "Next Episode" element      │
│  5. Resume fullscreen if previously active               │
│  6. Clean click-jacking overlays                         │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  Metadata Resolution                                    │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────┐  │
│  │ DOM Scrape   │───▶│ Imdbot API   │───▶│ TIDB API   │  │
│  │ (IMDB ID,    │    │ (Title →     │    │ (Intro &   │  │
│  │  Season, Ep) │    │  IMDB ID)    │    │  Credits)  │  │
│  └─────────────┘    └──────────────┘    └────────────┘  │
└─────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  Live Playback Logic                                    │
│  • Show/hide Skip Intro during precise TIDB window      │
│  • Show Next Episode button when credits begin          │
│  • Netflix-style countdown → auto-advance               │
│  • Fullscreen state preserved across transitions         │
└─────────────────────────────────────────────────────────┘
```

### Metadata Resolution Cascade

StreamZen tries multiple strategies to identify the current show:

1. **DOM Scraping** — Looks for `data-id="tt..."` attributes or IMDB links in the page
2. **HTML Source Scan** — Regex scan of the full page source for IMDB IDs
3. **URL Pattern Matching** — Checks if the URL contains an IMDB ID
4. **localStorage `playHistory`** — Reads the streaming site's own playback history for season/episode data
5. **Imdbot Title Search** — Cleans the show title and resolves it to an IMDB ID via the Imdbot API
6. **Local Caching** — Caches resolved IMDB IDs in `localStorage` so lookups are instant on repeat visits

---

## 🤝 Contributing

We welcome contributions from everyone! Here's how to get involved:

### 🐛 Reporting Bugs

1. Open an [Issue](https://github.com/victhereum/streamZen/issues/new) with a clear title
2. Include the streaming site URL (or domain)
3. Describe what you expected vs. what happened
4. Include your browser name and version

### 🔧 Making a Pull Request

1. **Fork** the repository
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
3. **Make your changes** in the `extension/` directory
4. **Test locally** by loading the unpacked extension
5. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add support for newsite.com"
   ```
6. **Push** and open a Pull Request:
   ```bash
   git push origin feature/my-awesome-feature
   ```

### 🌍 Adding a New Streaming Site

Want StreamZen to work on a new site? Here's how:

1. Open `extension/manifest.json`
2. Add a new match pattern to the `content_scripts.matches` array:
   ```json
   "*://*.newsite.com/*"
   ```
3. Test the extension on the new site — the content script should inject automatically
4. If the site's player structure requires adjustments, modify `content.js` accordingly
5. Submit a PR!

---

## 📡 Supporting TIDB (The Intro DB)

StreamZen's precision skip feature is powered by **[The Intro DB](https://www.theintrodb.org/)** — a community-driven database of intro and credits timestamps for TV episodes.

### Why Contribute to TIDB?

The more timestamps in the database, the better StreamZen works for everyone. Without TIDB data, StreamZen falls back to generic heuristics (skip 85 seconds, trigger at last 2.5 minutes). With TIDB data, it's **frame-perfect**.

### How to Add Timestamps

1. Visit **[theintrodb.org](https://www.theintrodb.org/)**
2. Search for a show by its IMDB ID (e.g., `tt0944947` for Game of Thrones)
3. Add the **intro start** and **intro end** timestamps (in milliseconds)
4. Add the **credits start** timestamp
5. Submit!

### TIDB API Format

StreamZen queries TIDB like this:

```
GET https://api.theintrodb.org/v2/media?imdb_id=tt0944947&season=1&episode=1
```

Response:

```json
{
  "intro": [
    {
      "start_ms": 436186,
      "end_ms": 535161,
      "confidence": 0.2
    }
  ],
  "credits": [
    {
      "start_ms": 3633000,
      "confidence": 0.2
    }
  ]
}
```

> **Every timestamp you add helps thousands of StreamZen users worldwide skip intros perfectly.** 🙏

---

## 📁 Project Structure

```
streamZen/
├── extension/               # Chrome extension source
│   ├── manifest.json        # Extension manifest (v3)
│   ├── content.js           # Core content script (all logic)
│   ├── content.css          # UI styles for injected elements
│   └── icons/               # Extension icons (16, 48, 128)
│
├── landing-page/            # Marketing website (Vite + React + Tailwind)
│   ├── src/
│   │   ├── App.tsx          # Main landing page component
│   │   ├── index.css        # Global styles + Tailwind theme
│   │   ├── components/ui/   # shadcn UI components
│   │   └── lib/utils.ts     # Utility functions
│   ├── public/
│   │   ├── privacy.html     # Privacy policy (required for Chrome Web Store)
│   │   ├── robots.txt       # SEO crawler config
│   │   ├── sitemap.xml      # Search engine sitemap
│   │   └── manifest.webmanifest
│   └── index.html           # Entry HTML with SEO meta tags
│
└── README.md                # You are here!
```

---

## 🔒 Privacy

StreamZen is designed with privacy as a core principle:

- ✅ **No personal data collected** — ever
- ✅ **No analytics or tracking**
- ✅ **No cookies or fingerprinting**
- ✅ **Fully open source** — inspect every line of code
- ✅ Only communicates with two public APIs (TIDB and Imdbot) using non-personal data

Read the full [Privacy Policy](https://streamzen.victhereum.com/privacy.html).

---

## 🛠️ Tech Stack

| Component    | Technology                                                                                |
| ------------ | ----------------------------------------------------------------------------------------- |
| Extension    | Vanilla JavaScript, Chrome Manifest V3                                                    |
| APIs         | [The Intro DB](https://www.theintrodb.org/), [Imdbot](https://search.imdbot.workers.dev/) |
| Landing Page | React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion                        |
| Hosting      | Victhereum Infrastructure                                                                 |

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <sub>
    Built with ❤️ by <a href="https://victhereum.com"><b>Victhereum Technologies</b></a><br/>
    <a href="https://streamzen.victhereum.com">Website</a> · <a href="mailto:hi@victhereum.com">Contact</a> · <a href="https://chromewebstore.google.com/detail/streamzen-cinematic-compa/ffkoailjikbieofjmojdpnhfcighomli">Chrome Web Store</a>
  </sub>
</p>
