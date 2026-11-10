#!/usr/bin/env python3
"""
scripts/fetch_news.py
Automated news collection and UPSC categorization pipeline for UPSC Current Affairs.

Fetches genuine, up-to-date Indian current affairs from official government sources
(PIB, RBI, PRS Legislative Research) and reputable national newspapers (The Hindu,
Indian Express, Livemint). Performs deduplication, 30-day retention pruning, and
maps each article to UPSC Syllabus categories, GS Papers (GS I-IV, Essay), Prelims & Mains
relevance, and syllabus keywords.
"""

import os
import re
import sys
import json
import hashlib
import logging
from datetime import datetime, timezone, timedelta
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode

import requests
import feedparser
from bs4 import BeautifulSoup
import urllib3

# Suppress insecure SSL warnings when fetching government portals with custom trust stores
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("upsc_news_crawler")

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "data",
    "current-affairs.json",
)

RETENTION_DAYS = 30
REQUEST_TIMEOUT = 15

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/rss+xml, application/xml, text/xml, text/html, */*",
    "Accept-Language": "en-US,en;q=0.9",
})

# -----------------------------------------------------------------------------
# UPSC Syllabus Taxonomy & Keyword Dictionary
# -----------------------------------------------------------------------------

CATEGORIES = [
    "National Affairs",
    "International Relations",
    "Indian Polity",
    "Economy",
    "Environment & Ecology",
    "Science & Technology",
    "Defence & Security",
    "Government Schemes",
    "Social Issues",
    "Important Reports & Indices",
    "Geography",
    "History & Culture",
]

UPSC_KEYWORD_MAP = {
    "Indian Polity": [
        "supreme court", "high court", "constitution", "judiciary", "parliament",
        "lok sabha", "rajya sabha", "election commission", "collegium", "fundamental rights",
        "directive principles", "dpsp", "ordinance", "governor", "president", "citizenship",
        "amendment", "cbi", "ed", "cag", "attorney general", "federalism", "delimitation",
        "anti-defection", "tenth schedule", "basic structure", "habeas corpus", "contempt",
        "tribunal", "niti aayog", "finance commission", "panchayat", "municipal", "quasi-judicial"
    ],
    "Economy": [
        "rbi", "reserve bank", "inflation", "cpi", "wpi", "monetary policy", "repo rate",
        "gdp", "growth", "fiscal deficit", "gst", "revenue", "banking", "npa", "sebi",
        "rupee", "forex", "trade deficit", "current account", "export", "import", "msme",
        "disinvestment", "taxation", "budget", "fdi", "fpi", "capital expenditure", "capex",
        "agriculture", "msp", "procurement", "kisan", "subsidies", "pli scheme", "sovereign",
        "infrastructure", "logistics", "supply chain", "debt"
    ],
    "Environment & Ecology": [
        "climate change", "cop", "unfccc", "global warming", "biodiversity", "wildlife",
        "national park", "sanctuary", "tiger reserve", "iucn", "pollution", "air quality",
        "aqi", "emission", "renewable energy", "solar", "green hydrogen", "forest cover",
        "mangroves", "wetland", "ramsar", "water crisis", "groundwater", "carbon credit",
        "net zero", "plastic waste", "cpcb", "moefcc", "conservation", "deforestation"
    ],
    "Science & Technology": [
        "isro", "space", "satellite", "chandrayaan", "gaganyaan", "aditya-l1", "nasa",
        "artificial intelligence", "ai", "machine learning", "quantum", "semiconductor",
        "biotechnology", "gene editing", "crispr", "stem cell", "nanotechnology",
        "supercomputer", "telecom", "5g", "6g", "cyber", "malware", "nuclear", "fusion",
        "vaccine", "pathogen", "virus", "antibiotic resistance", "drdo", "robotics"
    ],
    "Defence & Security": [
        "defence", "army", "navy", "air force", "missile", "drdo", "border", "lac", "loc",
        "internal security", "terrorism", "naxalism", "insurgency", "coast guard", "cyber security",
        "indigenisation", "atmanirbhar", "frigate", "submarine", "fighter jet", "tejas", "ins",
        "agnipath", "exercise", "intelligence", "nia", "natgrid", "maritime", "surveillance"
    ],
    "International Relations": [
        "foreign policy", "bilateral", "multilateral", "treaty", "summit", "g20", "brics",
        "quad", "sco", "asean", "united nations", "unsc", "wto", "who", "imf", "world bank",
        "diplomacy", "ambassador", "mea", "border dispute", "fta", "trade agreement",
        "indo-pacific", "global south", "geopolitics", "extradition", "refugee", "sanctions"
    ],
    "Government Schemes": [
        "yojana", "scheme", "pradhan mantri", "pm-kisan", "pmay", "ayushman bharat", "jal jeevan",
        "swachh bharat", "mgnrega", "dbt", "subsidies", "welfare", "anganwadi", "poshan",
        "national mission", "startup india", "make in india", "standup india", "samarth"
    ],
    "Social Issues": [
        "poverty", "hunger", "health", "education", "literacy", "women empowerment", "gender",
        "malnutrition", "child labour", "vulnerable sections", "caste", "tribal", "sc/st",
        "disability", "human development", "hdi", "demography", "urbanization", "migration"
    ],
    "Important Reports & Indices": [
        "report", "index", "ranking", "survey", "economic survey", "niti aayog index",
        "global hunger index", "hdi", "world economic forum", "imf outlook", "world bank report",
        "state of forest", "un report", "who report", "nfhs", "census", "statistical"
    ],
    "Geography": [
        "earthquake", "cyclone", "flood", "drought", "monsoon", "el nino", "la nina",
        "river", "basin", "glacier", "himalayas", "western ghats", "soil", "volcano",
        "topography", "disaster management", "ndrf", "landslide", "tsunami", "urban flooding"
    ],
    "History & Culture": [
        "heritage", "unesco", "archaeology", "asi", "monument", "temple", "craft", "folk art",
        "classical dance", "classical language", "freedom struggle", "gandhi", "ambedkar",
        "historical", "ancient", "medieval", "sculpture", "inscriptions", "literature"
    ],
}

# -----------------------------------------------------------------------------
# Helper Functions
# -----------------------------------------------------------------------------

def normalize_url(raw_url: str) -> str:
    """Strip tracking tokens, query bloat, fragments, and trailing slashes."""
    if not raw_url:
        return ""
    try:
        parsed = urlparse(raw_url)
        # Keep clean query params, strip utm_*, ref, etc.
        tracking_keys = {
            "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
            "ref", "ref_src", "fbclid", "gclid", "source", "_ga"
        }
        filtered_query = [
            (k, v) for k, v in parse_qsl(parsed.query, keep_blank_values=False)
            if k.lower() not in tracking_keys
        ]
        clean_query = urlencode(filtered_query)
        path = parsed.path.rstrip("/")
        normalized = urlunparse((
            parsed.scheme.lower(),
            parsed.netloc.lower(),
            path,
            parsed.params,
            clean_query,
            ""  # drop fragment
        ))
        return normalized
    except Exception:
        return raw_url.strip()


def generate_article_id(normalized_url: str, title: str, published_at: str) -> str:
    """Generate a stable deterministic ID."""
    token = f"{normalized_url}::{title.strip().lower()}::{published_at[:10]}"
    return hashlib.sha256(token.encode("utf-8")).hexdigest()[:16]


def clean_html(raw_html: str) -> str:
    """Remove HTML tags, script/style, and normalize whitespace."""
    if not raw_html:
        return ""
    try:
        soup = BeautifulSoup(raw_html, "html.parser")
        for tag in soup(["script", "style", "figure", "table", "button"]):
            tag.decompose()
        text = soup.get_text(separator=" ")
        text = re.sub(r"\s+", " ", text).strip()
        # Remove common syndication boilerplate
        text = re.sub(r"^(The Hindu Bureau|Special Correspondent|PTI|ANI|Agencies)\s*[:\-–]\s*", "", text, flags=re.IGNORECASE)
        return text
    except Exception:
        return re.sub(r"<[^>]+>", "", raw_html).strip()


def parse_date(date_val) -> datetime:
    """Flexible datetime parsing with fallback to current UTC."""
    if not date_val:
        return datetime.now(timezone.utc)

    if isinstance(date_val, datetime):
        if date_val.tzinfo is None:
            return date_val.replace(tzinfo=timezone.utc)
        return date_val

    if isinstance(date_val, (tuple, list)):
        try:
            return datetime(*date_val[:6], tzinfo=timezone.utc)
        except Exception:
            return datetime.now(timezone.utc)

    date_str = str(date_val).strip()
    # Try ISO format
    try:
        clean_iso = date_str.replace("Z", "+00:00")
        dt = datetime.fromisoformat(clean_iso)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        pass

    # Try common RSS formats
    formats = [
        "%a, %d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S %Z",
        "%a, %d %b %Y %H:%M:%S",
        "%d %b %Y %H:%M:%S %z",
        "%Y-%m-%d %H:%M:%S",
        "%d %b %Y %I:%M%p",
        "%d %B %Y %I:%M%p",
        "%d %b %Y",
        "%d-%m-%Y",
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except Exception:
            continue

    return datetime.now(timezone.utc)


def classify_upsc(title: str, description: str, feed_hint: str = "") -> dict:
    """
    Classify current affair into UPSC Category, GS Papers, Prelims/Mains relevance,
    and extracted syllabus keywords.
    """
    text_corpus = f"{title} {description}".lower()
    matched_keywords = []
    category_scores = {cat: 0 for cat in CATEGORIES}

    # Match predefined keywords
    for cat, kws in UPSC_KEYWORD_MAP.items():
        for kw in kws:
            pattern = r"\b" + re.escape(kw) + r"\b"
            if re.search(pattern, text_corpus):
                matched_keywords.append(kw.title())
                category_scores[cat] += 2 if len(kw.split()) > 1 else 1

    # Apply feed hints if provided
    if feed_hint and feed_hint in category_scores:
        category_scores[feed_hint] += 3

    # Determine highest scoring category
    best_category = "National Affairs"
    best_score = 0
    for cat, score in category_scores.items():
        if score > best_score:
            best_score = score
            best_category = cat

    # Fallback category checks
    if best_score == 0:
        if any(w in text_corpus for w in ["court", "bill", "act", "law", "judge", "police", "mp", "mla", "cabinet"]):
            best_category = "Indian Polity"
        elif any(w in text_corpus for w in ["bank", "rupee", "dollar", "market", "stock", "tax", "trade", "price"]):
            best_category = "Economy"
        elif any(w in text_corpus for w in ["missile", "army", "soldier", "border", "china", "pakistan"]):
            best_category = "Defence & Security"
        elif any(w in text_corpus for w in ["diplomat", "treaty", "foreign", "un", "war", "peace"]):
            best_category = "International Relations"
        elif any(w in text_corpus for w in ["climate", "forest", "tiger", "air", "water", "tree"]):
            best_category = "Environment & Ecology"
        elif any(w in text_corpus for w in ["isro", "science", "space", "launch", "tech"]):
            best_category = "Science & Technology"
        else:
            best_category = "National Affairs"

    # Map to GS Papers
    gs_papers = []
    if best_category in ["History & Culture", "Geography", "Social Issues"]:
        gs_papers.append("GS Paper I")
    if best_category in ["Indian Polity", "International Relations", "Government Schemes"]:
        gs_papers.append("GS Paper II")
    if best_category in ["Economy", "Environment & Ecology", "Science & Technology", "Defence & Security", "Geography"]:
        gs_papers.append("GS Paper III")
    
    # Ethics relevance (GS IV)
    ethics_triggers = ["corruption", "integrity", "transparency", "ethics", "probity", "whistleblower", "conflict of interest", "moral"]
    if any(re.search(r"\b" + re.escape(t) + r"\b", text_corpus) for t in ethics_triggers):
        gs_papers.append("GS Paper IV")

    # Essay relevance
    essay_triggers = ["education", "climate change", "women empowerment", "health", "democracy", "artificial intelligence", "poverty", "inequality"]
    if any(re.search(r"\b" + re.escape(t) + r"\b", text_corpus) for t in essay_triggers) or len(gs_papers) > 1:
        gs_papers.append("Essay")

    if not gs_papers:
        gs_papers = ["GS Paper II"] if best_category == "National Affairs" else ["GS Paper III"]

    # Deduplicate GS papers maintaining canonical order
    canonical_order = ["GS Paper I", "GS Paper II", "GS Paper III", "GS Paper IV", "Essay"]
    gs_papers = [p for p in canonical_order if p in gs_papers]

    # Prelims & Mains relevance
    prelims_relevant = True  # Almost all verified current affairs have factual Prelims angles
    mains_relevant = (
        len(description) > 80
        or any(w in text_corpus for w in ["policy", "reform", "impact", "challenge", "implication", "strategy", "framework", "analysis", "crisis", "growth", "bilateral"])
        or "Explained" in feed_hint
        or "GS Paper II" in gs_papers
        or "GS Paper III" in gs_papers
    )

    # Unique keywords (max 6)
    unique_kws = []
    for kw in matched_keywords:
        if kw not in unique_kws:
            unique_kws.append(kw)
    if not unique_kws:
        words = [w.capitalize() for w in re.findall(r"\b[A-Za-z]{4,}\b", title) if w.lower() not in {"this", "that", "with", "from", "after", "before", "over", "under", "into", "amid", "says", "held", "will", "have"}]
        unique_kws = words[:4]

    return {
        "category": best_category,
        "gsPaper": gs_papers,
        "prelimsRelevant": prelims_relevant,
        "mainsRelevant": mains_relevant,
        "keywords": unique_kws[:6],
    }

# -----------------------------------------------------------------------------
# Source Fetchers
# -----------------------------------------------------------------------------

def fetch_rss_source(source_name: str, feed_url: str, default_category: str = "") -> list:
    """Fetch and parse standard RSS/Atom feed."""
    logger.info(f"Fetching RSS: {source_name} ({feed_url})")
    articles = []
    try:
        resp = SESSION.get(feed_url, timeout=REQUEST_TIMEOUT, verify=False)
        if resp.status_code != 200:
            logger.warning(f"HTTP {resp.status_code} for {source_name}")
            return []
        feed = feedparser.parse(resp.content)
        if not feed.entries:
            logger.warning(f"No entries found in RSS feed for {source_name}")
            return []

        for entry in feed.entries:
            title = entry.get("title", "").strip()
            if not title:
                continue

            raw_link = entry.get("link", "").strip()
            norm_link = normalize_url(raw_link)
            if not norm_link:
                continue

            # Summary / Description
            desc = entry.get("summary") or entry.get("description") or ""
            clean_desc = clean_html(desc)
            if not clean_desc or clean_desc == title:
                # If summary is missing or empty, use a clean title-based excerpt
                clean_desc = f"{title}. Reported by {source_name}."

            # Publication Date
            pub_date = (
                entry.get("published_parsed")
                or entry.get("updated_parsed")
                or entry.get("published")
                or entry.get("updated")
            )
            dt = parse_date(pub_date)
            published_at = dt.isoformat()

            # Classification
            classification = classify_upsc(title, clean_desc, feed_hint=default_category)

            article_id = generate_article_id(norm_link, title, published_at)

            articles.append({
                "id": article_id,
                "title": title,
                "description": clean_desc,
                "source": source_name,
                "sourceUrl": norm_link,
                "publishedAt": published_at,
                "category": classification["category"],
                "gsPaper": classification["gsPaper"],
                "prelimsRelevant": classification["prelimsRelevant"],
                "mainsRelevant": classification["mainsRelevant"],
                "keywords": classification["keywords"],
            })

        logger.info(f"Successfully collected {len(articles)} articles from {source_name}")
    except Exception as exc:
        logger.error(f"Error fetching RSS for {source_name}: {exc}")

    return articles


def fetch_pib_releases() -> list:
    """
    Fetch genuine press releases from the Press Information Bureau (PIB),
    Government of India. Uses the public AllRelease.aspx feed adapter.
    """
    source_name = "Press Information Bureau (PIB)"
    logger.info(f"Fetching official releases from {source_name}")
    articles = []
    try:
        # First, try PIB RSS
        rss_url = "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3"
        rss_resp = SESSION.get(rss_url, timeout=10, verify=False)
        if rss_resp.status_code == 200:
            feed = feedparser.parse(rss_resp.content)
            for entry in feed.entries:
                title = entry.get("title", "").strip()
                link = entry.get("link", "").strip()
                if not title or not link:
                    continue
                norm_link = normalize_url(link)
                clean_desc = clean_html(entry.get("summary", "")) or f"{title}. Official press release issued by Press Information Bureau, Government of India."
                pub_date = entry.get("published") or entry.get("published_parsed")
                dt = parse_date(pub_date)
                published_at = dt.isoformat()
                
                classification = classify_upsc(title, clean_desc, feed_hint="Government Schemes")
                articles.append({
                    "id": generate_article_id(norm_link, title, published_at),
                    "title": title,
                    "description": clean_desc,
                    "source": source_name,
                    "sourceUrl": norm_link,
                    "publishedAt": published_at,
                    "category": classification["category"],
                    "gsPaper": classification["gsPaper"],
                    "prelimsRelevant": classification["prelimsRelevant"],
                    "mainsRelevant": classification["mainsRelevant"],
                    "keywords": classification["keywords"],
                })

        # Also scrape latest English releases from PIB portal if RSS returns few items
        if len(articles) < 5:
            portal_url = "https://www.pib.gov.in/indexd.aspx"
            p_resp = SESSION.get(portal_url, timeout=10, verify=False)
            if p_resp.status_code == 200:
                soup = BeautifulSoup(p_resp.text, "html.parser")
                found_links = soup.find_all("a", href=re.compile(r"PRID=\d+"))
                for a in found_links[:15]:
                    title = a.get_text(strip=True)
                    rel_link = a.get("href", "")
                    if not title or len(title) < 15:
                        continue
                    full_link = f"https://www.pib.gov.in{rel_link}" if rel_link.startswith("/") else rel_link
                    norm_link = normalize_url(full_link)
                    published_at = datetime.now(timezone.utc).isoformat()
                    clean_desc = f"{title}. Official communique from the Government of India via Press Information Bureau."
                    classification = classify_upsc(title, clean_desc, feed_hint="National Affairs")
                    articles.append({
                        "id": generate_article_id(norm_link, title, published_at),
                        "title": title,
                        "description": clean_desc,
                        "source": source_name,
                        "sourceUrl": norm_link,
                        "publishedAt": published_at,
                        "category": classification["category"],
                        "gsPaper": classification["gsPaper"],
                        "prelimsRelevant": classification["prelimsRelevant"],
                        "mainsRelevant": classification["mainsRelevant"],
                        "keywords": classification["keywords"],
                    })

        logger.info(f"Collected {len(articles)} releases from PIB")
    except Exception as exc:
        logger.error(f"Error fetching from PIB: {exc}")

    return articles


def fetch_prs_india() -> list:
    """
    Fetch parliamentary and legislative policy analysis from PRS Legislative Research.
    """
    source_name = "PRS Legislative Research"
    logger.info(f"Fetching legislative analysis from {source_name}")
    articles = []
    try:
        url = "https://prsindia.org/theprsblog"
        resp = SESSION.get(url, timeout=REQUEST_TIMEOUT, verify=False)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            rows = soup.find_all("div", class_=lambda c: c and "views-row" in c)
            for row in rows[:12]:
                a_tag = row.find("a")
                if not a_tag:
                    continue
                title = a_tag.get_text(strip=True)
                if not title or len(title) < 10:
                    continue
                href = a_tag.get("href", "")
                full_link = f"https://prsindia.org{href}" if href.startswith("/") else href
                norm_link = normalize_url(full_link)

                # Look for summary/body text
                body_div = row.find(class_=lambda c: c and ("body" in c or "field-content" in c or "desc" in c))
                desc = body_div.get_text(strip=True) if body_div else ""
                clean_desc = clean_html(desc) or f"Analysis of legislative, parliamentary, and governance developments by PRS Legislative Research on '{title}'."

                # Look for publication date
                date_tag = row.find(class_=lambda c: c and ("date" in c or "time" in c or "post" in c))
                dt = parse_date(date_tag.get_text(strip=True) if date_tag else None)
                published_at = dt.isoformat()

                classification = classify_upsc(title, clean_desc, feed_hint="Indian Polity")

                articles.append({
                    "id": generate_article_id(norm_link, title, published_at),
                    "title": title,
                    "description": clean_desc,
                    "source": source_name,
                    "sourceUrl": norm_link,
                    "publishedAt": published_at,
                    "category": classification["category"],
                    "gsPaper": classification["gsPaper"],
                    "prelimsRelevant": classification["prelimsRelevant"],
                    "mainsRelevant": True,  # PRS articles are prime UPSC Mains study material
                    "keywords": classification["keywords"],
                })

        logger.info(f"Collected {len(articles)} analyses from {source_name}")
    except Exception as exc:
        logger.error(f"Error fetching from PRS India: {exc}")

    return articles

# -----------------------------------------------------------------------------
# Main Aggregation Pipeline
# -----------------------------------------------------------------------------

SOURCES_CONFIG = [
    # 1. Primary Official Government Sources
    {
        "type": "custom",
        "name": "Press Information Bureau (PIB)",
        "fetcher": fetch_pib_releases,
    },
    {
        "type": "rss",
        "name": "Reserve Bank of India (RBI)",
        "url": "https://www.rbi.org.in/pressreleases_rss.xml",
        "category": "Economy",
    },
    {
        "type": "custom",
        "name": "PRS Legislative Research",
        "fetcher": fetch_prs_india,
    },
    # 2. Supplementary Trusted National Portals (UPSC Prep Standard)
    {
        "type": "rss",
        "name": "The Hindu (National)",
        "url": "https://www.thehindu.com/news/national/feeder/default.rss",
        "category": "National Affairs",
    },
    {
        "type": "rss",
        "name": "The Hindu (International)",
        "url": "https://www.thehindu.com/news/international/feeder/default.rss",
        "category": "International Relations",
    },
    {
        "type": "rss",
        "name": "The Hindu BusinessLine (Economy)",
        "url": "https://www.thehindubusinessline.com/economy/feeder/default.rss",
        "category": "Economy",
    },
    {
        "type": "rss",
        "name": "The Hindu (Environment)",
        "url": "https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss",
        "category": "Environment & Ecology",
    },
    {
        "type": "rss",
        "name": "The Hindu (Science & Tech)",
        "url": "https://www.thehindu.com/sci-tech/science/feeder/default.rss",
        "category": "Science & Technology",
    },
    {
        "type": "rss",
        "name": "Indian Express (Explained)",
        "url": "https://indianexpress.com/section/explained/feed/",
        "category": "National Affairs",
    },
    {
        "type": "rss",
        "name": "Indian Express (India)",
        "url": "https://indianexpress.com/section/india/feed/",
        "category": "National Affairs",
    },
    {
        "type": "rss",
        "name": "Livemint (Economy & Policy)",
        "url": "https://www.livemint.com/rss/politics",
        "category": "Economy",
    },
]


def load_existing_data() -> tuple[list, str, dict]:
    """Load existing JSON to preserve historical valid articles and previous update timestamp."""
    if not os.path.exists(OUTPUT_PATH):
        return [], "", {}

    try:
        with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, dict):
                return data.get("articles", []), data.get("lastUpdated", ""), data.get("sourcesStats", {})
            elif isinstance(data, list):
                return data, "", {}
    except Exception as exc:
        logger.warning(f"Could not read existing data at {OUTPUT_PATH}: {exc}")

    return [], "", {}


def run():
    logger.info("=== Starting UPSC Current Affairs Data Collection Pipeline ===")
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    existing_articles, prev_updated_at, prev_stats = load_existing_data()
    logger.info(f"Loaded {len(existing_articles)} existing articles from previous runs.")

    now = datetime.now(timezone.utc)
    cutoff_date = now - timedelta(days=RETENTION_DAYS)

    collected_articles = []
    source_stats = {}

    for src in SOURCES_CONFIG:
        src_name = src["name"]
        try:
            if src["type"] == "rss":
                arts = fetch_rss_source(src_name, src["url"], default_category=src.get("category", ""))
            elif src["type"] == "custom":
                arts = src["fetcher"]()
            else:
                arts = []

            count = len(arts)
            status = "active" if count > 0 else "degraded"
            source_stats[src_name] = {
                "count": count,
                "status": status,
                "lastChecked": now.isoformat(),
            }
            collected_articles.extend(arts)
        except Exception as exc:
            logger.error(f"Failed to process source {src_name}: {exc}")
            source_stats[src_name] = {
                "count": 0,
                "status": "failed",
                "error": str(exc),
                "lastChecked": now.isoformat(),
            }

    logger.info(f"Total freshly fetched articles across all sources: {len(collected_articles)}")

    # Merge fresh articles with existing valid articles (within 30-day window)
    article_dict = {}

    # 1. Seed with existing articles that are still within 30-day cutoff
    for art in existing_articles:
        try:
            art_dt = parse_date(art.get("publishedAt"))
            if art_dt >= cutoff_date:
                norm_url = normalize_url(art.get("sourceUrl", ""))
                key = norm_url or art.get("id") or art.get("title", "")
                article_dict[key] = art
        except Exception:
            continue

    logger.info(f"Retained {len(article_dict)} historical articles within {RETENTION_DAYS} days.")

    # 2. Upsert newly collected articles
    new_added = 0
    for art in collected_articles:
        try:
            art_dt = parse_date(art.get("publishedAt"))
            if art_dt < cutoff_date:
                continue
            norm_url = normalize_url(art.get("sourceUrl", ""))
            key = norm_url or art.get("id") or art.get("title", "")
            if key not in article_dict:
                new_added += 1
            # Update with fresh data
            article_dict[key] = art
        except Exception:
            continue

    logger.info(f"Added {new_added} brand new articles.")

    # Convert to list and sort by publication date descending (latest first)
    final_articles = list(article_dict.values())
    final_articles.sort(key=lambda x: parse_date(x.get("publishedAt")), reverse=True)

    # Compile source breakdown
    source_summary = []
    for src in SOURCES_CONFIG:
        sname = src["name"]
        st = source_stats.get(sname, {"count": 0, "status": "unknown"})
        total_in_db = sum(1 for a in final_articles if a.get("source") == sname)
        source_summary.append({
            "name": sname,
            "latestFetched": st.get("count", 0),
            "retainedTotal": total_in_db,
            "status": st.get("status", "active"),
        })

    # Prepare final JSON payload
    payload = {
        "lastUpdated": now.isoformat(),
        "totalArticles": len(final_articles),
        "retentionDays": RETENTION_DAYS,
        "sources": source_summary,
        "articles": final_articles,
    }

    # Write output atomically
    temp_path = f"{OUTPUT_PATH}.tmp"
    with open(temp_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    os.replace(temp_path, OUTPUT_PATH)

    logger.info(f"Successfully saved {len(final_articles)} articles to {OUTPUT_PATH}")
    logger.info("=== Data Collection Pipeline Complete ===")


if __name__ == "__main__":
    run()
