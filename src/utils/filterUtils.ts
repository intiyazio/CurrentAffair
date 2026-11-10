import type { CurrentAffair, FilterState, GSPaperInfo } from '../types/news';
import { matchesTimeframe } from './dateUtils';

export const UPSC_CATEGORIES = [
  'National Affairs',
  'International Relations',
  'Indian Polity',
  'Economy',
  'Environment & Ecology',
  'Science & Technology',
  'Defence & Security',
  'Government Schemes',
  'Social Issues',
  'Important Reports & Indices',
  'Geography',
  'History & Culture',
] as const;

export const GS_PAPERS: GSPaperInfo[] = [
  {
    code: 'GS Paper I',
    title: 'Heritage, Culture, History & Geography of the World & Society',
    shortDesc: 'History, Art & Culture, Indian Society, World & Physical Geography',
    topics: ['Art & Culture', 'Modern History', 'World History', 'Indian Society', 'Geography & Disasters'],
    color: '#b45309',
  },
  {
    code: 'GS Paper II',
    title: 'Governance, Constitution, Polity, Social Justice & International Relations',
    shortDesc: 'Indian Constitution, Governance, Public Policy, Rights Issues, Foreign Affairs',
    topics: ['Constitution & Polity', 'Parliament & State Legislatures', 'Judiciary', 'Social Justice & Welfare', 'International Treaties & Bilateral Ties'],
    color: '#0369a1',
  },
  {
    code: 'GS Paper III',
    title: 'Technology, Economic Development, Biodiversity, Environment, Security & Disaster Management',
    shortDesc: 'Indian Economy, Agriculture, Science & Tech, Biodiversity, Climate, Internal Security',
    topics: ['Macro & Inclusive Growth', 'Agriculture & Food Processing', 'Science, Space & Tech', 'Environment & Pollution', 'Defence & Cybersecurity'],
    color: '#047857',
  },
  {
    code: 'GS Paper IV',
    title: 'Ethics, Integrity and Aptitude',
    shortDesc: 'Public Administration Ethics, Probity in Governance, Ethical Case Studies',
    topics: ['Ethics & Human Interface', 'Civil Service Values', 'Probity in Governance', 'Transparency & Citizen Charters'],
    color: '#7c3aed',
  },
  {
    code: 'Essay',
    title: 'UPSC Mains Essay Paper',
    shortDesc: 'Analytical, multi-dimensional perspectives on contemporary socio-economic & philosophical issues',
    topics: ['Socio-economic Debates', 'Climate & Human Future', 'Women & Development', 'Technological Ethics'],
    color: '#be185d',
  },
];

export function filterArticles(articles: CurrentAffair[], filters: FilterState): CurrentAffair[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return articles.filter((article) => {
    // 1. Text Search
    if (query) {
      const inTitle = article.title.toLowerCase().includes(query);
      const inDesc = article.description.toLowerCase().includes(query);
      const inSource = article.source.toLowerCase().includes(query);
      const inKeywords = article.keywords?.some((k) => k.toLowerCase().includes(query));
      if (!inTitle && !inDesc && !inSource && !inKeywords) {
        return false;
      }
    }

    // 2. Category Filter
    if (filters.category && filters.category !== 'All') {
      if (article.category !== filters.category) {
        return false;
      }
    }

    // 3. GS Paper Filter
    if (filters.gsPaper && filters.gsPaper !== 'All') {
      if (!article.gsPaper.includes(filters.gsPaper)) {
        return false;
      }
    }

    // 4. Source Filter
    if (filters.source && filters.source !== 'All') {
      if (!article.source.toLowerCase().includes(filters.source.toLowerCase())) {
        return false;
      }
    }

    // 5. Timeframe Filter
    if (!matchesTimeframe(article.publishedAt, filters.timeframe)) {
      return false;
    }

    // 6. Relevance Filter
    if (filters.relevance === 'prelims' && !article.prelimsRelevant) {
      return false;
    }
    if (filters.relevance === 'mains' && !article.mainsRelevant) {
      return false;
    }

    return true;
  });
}
