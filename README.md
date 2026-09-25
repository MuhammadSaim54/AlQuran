<div align="center">

  <img src="public/favicon.svg" alt="Al Quran Logo" width="88" height="88" />

  <h1 align="center" style="font-weight: 800; letter-spacing: -0.03em;">AL QURAN</h1>

  <p align="center" style="font-size: 1.15rem; color: #6E624E;">
    <strong>High-Fidelity Dual-Mode Mushaf, Dynamic Color Tajweed & Studio Audio Engine</strong>
  </p>

  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-v8.3_(Rolldown)-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite v8" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" /></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deployment-Vercel_Edge-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" /></a>
  </p>

</div>

---

## ✦ Overview

**Al Quran** is a modern, luxury Islamic web application built with precision typography, responsive ergonomics, and zero-latency media streaming. 

The application bridges the gap between traditional printed sacred texts and modern web experiences:
1. **Authentic 16-Line Indo-Pak Mushaf**: High-definition digital scans preserving physical folio typography without layout shifts or text degradation.
2. **Dynamic Live Tajweed Engine**: A client-side parsing system converting raw Tajweed notation into semantic color-coded calligraphy (Madd, Ghunnah, Qalqalah, Ikhfa, Idgham, Iqlab) paired with authentic ayah end medallions.
3. **Master Reciter Audio Suite**: Seamless full-surah audio streaming with instant reciter switching and persistent playback controls.

---

## ✦ Key Architectural Pillars

### 1. Dual-View Mushaf Engine
* **Original 16-Line Indo-Pak Folio**: Pure scanned folios replicating traditional physical printed Qurans used across South Asia.
* **Semantic Live Tajweed Parser**: Real-time regex engine transforming nested markup brackets into color-coded typographic rules with zero layout disruption.
* **Balanced Arabic Typography**: Web font integration featuring **Amiri Quran** and **Scheherazade New** to deliver authentic diacritic placement and harmonious line-height across devices.
* **Paper Tone Atmospheres**: Reader-focused viewing themes including Classic White, Vintage Warm Sepia, and Midnight Dark.

### 2. Studio Audio & Reciter Switcher
* **5 Iconic Reciter Profiles**:
  * **Sheikh Noreen Muhammad Siddiq** *(Traditional Sudanese Maqam)*
  * **Abdul Rahman Al-Sudais** *(Chief Imam of Masjid Al-Haram, Makkah)*
  * **Maher Al-Muaiqly** *(Esteemed Imam of Masjid Al-Haram)*
  * **Mishary Rashid Alafasy** *(World-Renowned Melodic Murattal)*
  * **Abdul Basit Abdul Samad** *(Golden Era Legendary Egyptian Murattal)*
* **Persistent Docked Player**: Instant reciter switching, scrubbable progress bar, volume controls, and background playback persistence across views.

### 3. Ergonomics & Responsive Engineering
* **Bespoke Gold Scrollbar System**: An ultra-thin 4px gilded glassmorphic scroll track engineered to prevent reading area blockage.
* **Fluid Dynamic Typography**: Adaptive CSS sizing logic scaling seamlessly from 320px mobile viewports to 4K ultra-wide monitors.
* **State Persistence**: Browser storage engine retaining last-read position, page ribbon bookmarks, and display preferences across sessions.

---

## ✦ Tech Stack & Tooling

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **React 19** | Concurrent UI reconciliation and state synchronization |
| **Build Tool** | **Vite v8.3 (Rolldown / OXC)** | Native Rust-powered bundling for lightning-fast compilation |
| **Styling** | **Tailwind CSS v4** | Modern atomic styling via `@tailwindcss/vite` |
| **Animation** | **Framer Motion** | Physics-based gestures, smooth transitions, and sheet dialogs |
| **Icons** | **Lucide React** | Lightweight, accessible vector iconography matching UI borders |
| **Typography** | **Google Fonts CDN** | `Amiri Quran`, `Scheherazade New`, `Plus Jakarta Sans` |

---

## ✦ Project Structure

```bash
al-quran/
├── public/
│   ├── favicon.svg              # Custom vector open-book favicon
│   └── ...
├── src/
│   ├── assets/
│   │   └── images/              # Verified studio reciter portraits
│   ├── components/
│   │   ├── AudioLibrary.jsx     # Master reciter directory and surah index
│   │   ├── AudioPlayer.jsx      # Persistent audio dock with instant switcher
│   │   ├── MushafViewer.jsx     # Dual-mode reader, Tajweed engine & bookmarks
│   │   └── SurahList.jsx        # Surah explorer with search and filtering
│   ├── App.jsx                  # Application shell and route orchestration
│   ├── index.css                # Global luxury scrollbar and typography rules
│   └── main.jsx                 # Client entry point
├── index.html                   # Resource preconnects, SEO metadata & vector icon
├── vite.config.js               # Optimized Vite v8 and Tailwind v4 pipeline
└── vercel.json                  # Single-Page Application routing and cache headers

## ✦ Local Development

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **Package Manager**: `npm`, `yarn`, or `pnpm`

### Setup Steps
```bash
# 1. Clone repository
git clone [https://github.com/MuhammadSaim54/AlQuran](https://github.com/MuhammadSaim54/AlQuran)

# 2. Navigate to project root
cd al-quran

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev