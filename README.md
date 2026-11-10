# UPSC Current Affairs – Live India

> **"Understand Today. Prepare for Tomorrow."**
> A production-ready, single-page UPSC Civil Services Current Affairs portal powered entirely by genuine, unedited daily feeds from official Indian government sources and trusted primary journalism.

Built to be **100% free forever** using **GitHub Pages** for hosting and **GitHub Actions** for automated 6-hour data aggregation. **Zero traditional backend, zero paid APIs, zero database, and zero API keys required.**

---

## 🏛️ Project Overview

UPSC Civil Services Examination aspirants face information overload. Many coaching portals rewrite or summarize news with political commentary or delay. 

**UPSC Current Affairs** delivers:
- **Direct, verified primary news** from official government portals: Press Information Bureau (PIB), Reserve Bank of India (RBI), PRS Legislative Research, and supplementary reputed national journalism (The Hindu, Indian Express Explained, Livemint).
- **Automated UPSC Syllabus Mapping**: Every article is classified into 12 core UPSC categories and mapped directly to General Studies Papers (**GS Paper I, II, III, IV, and Essay**) along with Prelims and Mains relevance tags.
- **Local Revision Bookmarks**: Save critical articles to browser `localStorage` for offline review and export notes as `.json`.
- **Integrity Guarantee**: Never fabricates news, statistics, quotes, or timestamps. Real-time indicators display the exact timestamp of data refresh.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 8](https://vite.dev/) (Portable relative paths for any subpath) |
| **UI Components & Theme** | [Material UI (MUI v6/v9)](https://mui.com/) styled with deep Indian teal (`#01484a`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Date & Time Utilities** | [date-fns](https://date-fns.org/) |
| **Data Retrieval** | Native Fetch API with browser cache-busting |
| **Data Aggregation Pipeline** | Python 3.12 (`feedparser`, `requests`, `beautifulsoup4`) |
| **Scheduled Automation** | GitHub Actions (`cron: '0 */6 * * *'`) with deduplication |
| **Deployment** | Official GitHub Pages deployment workflow (`actions/deploy-pages@v4`) |

---

## 📂 Project Structure

```text
├── .github/
│   └── workflows/
│       ├── update-news.yml        # Scheduled 6-hour crawler & data updater
│       └── deploy.yml             # Automatic Vite build & GitHub Pages deploy
├── public/
│   ├── data/
│   │   └── current-affairs.json   # Processed, deduplicated current affairs
│   └── favicon.svg                # Portal emblem favicon
├── scripts/
│   └── fetch_news.py              # Python RSS & web crawler + UPSC classifier
├── src/
│   ├── components/
│   │   ├── ArticleDetails.tsx     # Full modal view with UPSC notes & original link
│   │   ├── CategoryFilters.tsx    # 12 UPSC categories with dynamic counts
│   │   ├── Footer.tsx             # Disclaimer, monitored sources, update status
│   │   ├── GSPaperFilters.tsx     # GS Papers (I, II, III, IV, Essay) syllabus cards
│   │   ├── Header.tsx             # Sticky responsive navigation with theme toggle
│   │   ├── Hero.tsx               # Header, metrics, date, freshness warnings, search
│   │   ├── NewsCard.tsx           # Individual current affair card with tags & bookmark
│   │   ├── NewsFeed.tsx           # Chronological feed with multi-filter toolbar
│   │   ├── SavedArticles.tsx      # Browser-persisted bookmark vault with export
│   │   ├── SearchBar.tsx          # Fast search input component
│   │   └── TodaysHighlights.tsx   # Top recent daily high-yield highlights
│   ├── hooks/
│   │   ├── useBookmarks.ts        # LocalStorage bookmark manager
│   │   └── useCurrentAffairs.ts   # Data fetching & stale status calculator
│   ├── pages/
│   │   └── HomePage.tsx           # Single-page application coordinator
│   ├── services/
│   │   └── newsService.ts         # Static JSON loader with subpath resolution
│   ├── theme/
│   │   └── theme.ts               # Light/Dark mode themes & typography
│   ├── types/
│   │   └── news.ts                # TypeScript interfaces (CurrentAffair, FilterState)
│   ├── utils/
│   │   ├── dateUtils.ts           # date-fns formatting & relative time
│   │   └── filterUtils.ts         # Multi-criteria filtering & syllabus metadata
│   ├── App.tsx                    # ThemeProvider & root application
│   └── main.tsx                   # React DOM root entry
├── index.html                     # HTML shell with Google Fonts & metadata
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Relative base path configuration
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: `v20` or higher (`node -v`)
- **npm**: `v10` or higher (`npm -v`)
- **Python**: `3.10` or higher (`python --version`) with `pip`

### Step 1: Clone or Open the Workspace
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Python Crawler Dependencies
```bash
pip install feedparser requests beautifulsoup4
```

### Step 4: Run the News Crawler (Optional for fresh data)
```bash
python scripts/fetch_news.py
```
This fetches genuine news from all monitored endpoints, normalizes URLs, removes duplicates, prunes articles older than 30 days, and saves the verified output to `public/data/current-affairs.json`.

### Step 5: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 6: Test Production Build
```bash
npm run build
npm run preview
```

---

## 📡 Automated News Collection Pipeline

Data collection is automated via **GitHub Actions** (`.github/workflows/update-news.yml`):
- **Schedule**: Automatically runs every 6 hours (`0 */6 * * *`).
- **Manual Trigger**: Can be executed manually on-demand at any time through the **workflow_dispatch** button in GitHub Actions.
- **Normalization & Deduplication**:
  - URL query tracking tags (`utm_*`, `ref`, `fbclid`, session tokens) are stripped.
  - A deterministic SHA-256 hash token (`normalized_url::title::date`) prevents duplicate articles across multiple RSS categories.
- **30-Day Retention**: Articles older than 30 days are automatically pruned, keeping dataset size compact (~600–900 KB).
- **Fault-Tolerant Merging**: If an individual government server temporarily times out or fails SSL handshake, previously collected valid articles from that source are preserved.
- **Atomic File Writing**: Writes via temporary file before replacing `current-affairs.json` to prevent partial reads.
- **Git Commit Optimization**: Commits to GitHub only when data actually changes (`git diff --staged --quiet`).

---

## ➕ How to Add a New News Source

To add a new verified source, edit `scripts/fetch_news.py`:

### Adding an RSS Feed
Add an entry to `SOURCES_CONFIG`:
```python
{
    "type": "rss",
    "name": "Ministry of Environment (MoEFCC)",
    "url": "https://moef.gov.in/feed/en/",
    "category": "Environment & Ecology",
}
```

### Adding a Custom Portal Adapter (For sites without native RSS)
If an official body does not publish an RSS feed (e.g. PRS blog):
1. Write a custom fetcher function:
```python
def fetch_isro_updates() -> list:
    resp = SESSION.get("https://www.isro.gov.in/Press_release.html", timeout=15)
    # Parse HTML using BeautifulSoup...
    return articles
```
2. Add it to `SOURCES_CONFIG`:
```python
{
    "type": "custom",
    "name": "ISRO Press Releases",
    "fetcher": fetch_isro_updates,
}
```

---

## 🌐 GitHub Pages Deployment Guide (Step-by-Step for Beginners)

The portal is designed to deploy **100% free** on GitHub Pages without modifying any repository names or code.

### Step 1: Create a GitHub Repository
1. Log in to [GitHub](https://github.com).
2. Click **New Repository** (green button).
3. Choose a name (e.g., `upsc-current-affairs`).
4. Set it to **Public**.
5. Click **Create repository**.

### Step 2: Push Your Code
In your terminal:
```bash
git init
git add .
git commit -m "feat: initial UPSC Current Affairs portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Step 3: Configure GitHub Pages Permissions
1. In your repository on GitHub, navigate to **Settings** (top tabs).
2. In the left sidebar, click **Actions** ➔ **General**.
3. Under **Workflow permissions**, select:
   - **Read and write permissions** (required for `update-news.yml` to commit new data).
4. Click **Save**.
5. In the left sidebar, click **Pages**.
6. Under **Build and deployment** ➔ **Source**, select **GitHub Actions** (not "Deploy from a branch").

### Step 4: Run the Deployment
Once you push to `main`, GitHub Actions will automatically trigger `.github/workflows/deploy.yml`. Within 1–2 minutes, your portal will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

### Step 5: Manually Trigger a News Update (Optional)
1. In your GitHub repository, click **Actions**.
2. Select **Update Current Affairs Data** on the left.
3. Click **Run workflow** ➔ **Run workflow**.
4. GitHub Actions will crawl latest news, commit `current-affairs.json`, and trigger a fresh deployment!

---

## 🏷️ UPSC Syllabus Taxonomy & Mapping Engine

Articles are categorized using objective keyword and semantic matching against the official UPSC CSE syllabus:

| UPSC Category | GS Paper Linkage | Exam Stage Relevance | Sample Covered Topics |
|---|---|---|---|
| **Indian Polity** | GS Paper II | Prelims & Mains | Supreme Court rulings, Constitutional Amendments, Collegium, Federalism, Election Commission |
| **Economy** | GS Paper III | Prelims & Mains | RBI Monetary Policy, Inflation (CPI/WPI), GDP, Fiscal Deficit, GST, Banking reforms, MSP |
| **Environment & Ecology** | GS Paper III | Prelims & Mains | UNFCCC COP summits, Ramsar wetlands, Biodiversity conservation, Air Quality Index (AQI), Green Hydrogen |
| **Science & Technology** | GS Paper III | Prelims & Mains | ISRO missions, AI developments, Quantum computing, Semiconductor Mission, Biotech & vaccines |
| **International Relations** | GS Paper II | Prelims & Mains | Bilateral treaties, G20, Quad, BRICS, Global South diplomacy, Foreign trade agreements |
| **Defence & Security** | GS Paper III | Prelims & Mains | Indigenisation (Make in India), DRDO tests, LAC/LOC border security, Cyber warfare doctrines |
| **Government Schemes** | GS Paper II | Prelims & Mains | PM-Kisan, Ayushman Bharat, PMAY, Jal Jeevan Mission, DBT welfare delivery |
| **Social Issues** | GS Paper I & II | Mains & Essay | Women empowerment, Poverty indices, Demographic dividend, Health & Education access |
| **History & Culture** | GS Paper I | Prelims & Mains | UNESCO World Heritage sites, ASI excavations, Classical languages, Art forms |
| **Geography** | GS Paper I & III | Prelims & Mains | Cyclones, El Niño/La Niña patterns, River basins, Disaster management protocols |
| **Important Reports & Indices** | GS Paper II & III | Prelims & Mains | NITI Aayog rankings, Economic Survey, Global indices (HDI, Hunger Index) |

---

## ⚠️ Integrity Principles & Known Limitations

1. **No Fabricated Content**: Unlike generic aggregators, this project never invents news or writes synthetic summaries. If a source summary is brief, only the verified source excerpt is shown.
2. **Transparent Freshness**: If GitHub Actions experiences scheduling latency, a visible warning indicates the last successful data collection time rather than falsely claiming a fresh update.
3. **No Paywall Circumvention**: All feeds are sourced strictly from official government public communications or publicly syndicated RSS channels in full accordance with terms of use.
4. **Offline Resilience**: When viewing previously saved bookmarks, articles are read instantly from `localStorage` without requiring an internet connection.

---

## 📄 License & Disclaimer

This website is an independent open-source educational resource for civil services aspirants. News and information are collected from publicly available feeds and portals. For official gazettes, notifications, and examination rules, candidates should consult the [Union Public Service Commission (UPSC)](https://upsc.gov.in) and respective ministry portals.
