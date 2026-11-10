export type Language = 'en' | 'hi';

export interface Translations {
  // Brand & Tagline
  brandName: string;
  tagline: string;

  // Header Nav
  navHome: string;
  navHighlights: string;
  navAllNews: string;
  navCategories: string;
  navSaved: string;
  navAbout: string;
  navMenu: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  popularTopics: string;
  updatedPrefix: string;
  totalArticlesLabel: string;
  totalArticlesSuffix: string;
  primarySourcesLabel: string;
  primarySourcesValue: string;
  syllabusMappingLabel: string;
  syllabusMappingValue: string;
  updateFrequencyLabel: string;
  updateFrequencyValue: string;
  staleWarningTitle: string;
  staleWarningDesc: string;

  // Highlights Section
  highlightsTitle: string;
  highlightsSubtitle: string;
  viewAllButton: string;

  // Categories Section
  categoriesTitle: string;
  categoriesSubtitle: string;
  allCategories: string;

  // GS Papers Section
  gsPaperTitle: string;
  gsPaperSubtitle: string;
  showAllPapers: string;
  activeFilter: string;
  clickToFilter: string;
  itemsCount: string;

  // News Feed
  feedTitle: string;
  feedSubtitle: string;
  feedSearchPlaceholder: string;
  dropdownCategory: string;
  dropdownGSPaper: string;
  dropdownSource: string;
  dropdownTimeframe: string;
  searchCategoryPlaceholder: string;
  searchGSPaperPlaceholder: string;
  searchSourcePlaceholder: string;
  searchTimeframePlaceholder: string;
  relevanceLabel: string;
  relevanceAll: string;
  relevancePrelims: string;
  relevanceMains: string;
  resetFilters: string;
  showingPrefix: string;
  showingOf: string;
  showingArticles: string;
  filteredSuffix: string;
  loadMore: string;
  remainingSuffix: string;
  noArticlesFound: string;
  noArticlesDesc: string;
  clearAllFilters: string;

  // Timeframe labels
  timeframeAll: string;
  timeframeToday: string;
  timeframe3Days: string;
  timeframe7Days: string;
  timeframeMonth: string;

  // News Card & Details
  prelimsBadge: string;
  mainsBadge: string;
  upscNotesButton: string;
  sourceButton: string;
  saveArticleTooltip: string;
  removeBookmarkTooltip: string;
  verifiedSourceCommunique: string;
  readCompleteReport: string;
  syllabusClassification: string;
  syllabusNote: string;
  primaryCategory: string;
  examStageRelevance: string;
  prelimsHighYield: string;
  mainsAnalytical: string;
  gsLinkages: string;
  keyAreas: string;
  highPriorityKeywords: string;
  close: string;
  openOriginalSource: string;
  shareSuccess: string;

  // Saved Articles
  savedTitle: string;
  savedSubtitle: string;
  exportNotes: string;
  clearAll: string;
  noSavedArticles: string;
  noSavedDesc: string;
  browseCurrentAffairs: string;
  confirmClearTitle: string;
  confirmClearDesc: string;
  cancel: string;

  // Footer
  footerAboutDesc: string;
  footerDataUpdated: string;
  footerActiveFeeds: string;
  footerMonitoredSources: string;
  footerArchitectureTitle: string;
  footerArchitectureDesc: string;
  footerGithubRepo: string;
  footerDisclaimerTitle: string;
  footerDisclaimerText: string;
  footerCopyright: string;
  footerProduction: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'UPSC Current Affairs',
    tagline: 'Understand Today. Prepare for Tomorrow.',

    navHome: 'Home',
    navHighlights: "Today's Highlights",
    navAllNews: 'All News',
    navCategories: 'Categories',
    navSaved: 'Saved Articles',
    navAbout: 'About & Sources',
    navMenu: 'Navigation',

    heroTitle: 'Stay Updated. Stay Ahead.',
    heroSubtitle:
      'Daily Indian current affairs curated from official government portals and trusted primary sources, mapped specifically to the UPSC Civil Services Examination.',
    searchPlaceholder:
      'Search news, government schemes, keywords (e.g. RBI, Supreme Court, COP, GDP)...',
    popularTopics: 'Popular Topics:',
    updatedPrefix: 'Updated',
    totalArticlesLabel: 'Total Articles',
    totalArticlesSuffix: '+ Verified',
    primarySourcesLabel: 'Primary Sources',
    primarySourcesValue: 'PIB, RBI, PRS & More',
    syllabusMappingLabel: 'Syllabus Mapping',
    syllabusMappingValue: 'GS I, II, III, IV & Essay',
    updateFrequencyLabel: 'Updates',
    updateFrequencyValue: 'Every 6 Hours',
    staleWarningTitle: 'Note on Data Freshness:',
    staleWarningDesc:
      'The current affairs data was last updated over 24 hours ago. The next automated GitHub Actions cycle will refresh the feed shortly.',

    highlightsTitle: "Today's Important News",
    highlightsSubtitle:
      'Latest verified developments published by official government bodies and leading national newspapers.',
    viewAllButton: 'View All Articles',

    categoriesTitle: 'UPSC Syllabus Categories',
    categoriesSubtitle:
      'Filter articles by specific topics prescribed in the Civil Services Examination syllabus.',
    allCategories: 'All Categories',

    gsPaperTitle: 'General Studies (GS) Paper Mapping',
    gsPaperSubtitle:
      'Direct syllabus correlation for UPSC Civil Services Mains Examination.',
    showAllPapers: 'Show All Papers',
    activeFilter: 'Active Filter',
    clickToFilter: 'Click to Filter',
    itemsCount: 'items',

    feedTitle: 'Daily Current Affairs Feed',
    feedSubtitle:
      'Chronological, unedited news stream from verified primary sources mapped with UPSC syllabus tags.',
    feedSearchPlaceholder: 'Search keywords, headlines, schemes, judicial rulings...',
    dropdownCategory: 'UPSC Category',
    dropdownGSPaper: 'GS Paper',
    dropdownSource: 'News Source',
    dropdownTimeframe: 'Timeframe',
    searchCategoryPlaceholder: 'Type to search category...',
    searchGSPaperPlaceholder: 'Type to search paper...',
    searchSourcePlaceholder: 'Type to search source...',
    searchTimeframePlaceholder: 'Type to search timeframe...',
    relevanceLabel: 'Relevance:',
    relevanceAll: 'All Stages',
    relevancePrelims: 'Prelims High-Yield',
    relevanceMains: 'Mains Analytical',
    resetFilters: 'Reset All Filters',
    showingPrefix: 'Showing',
    showingOf: 'of',
    showingArticles: 'articles',
    filteredSuffix: '(filtered)',
    loadMore: 'Load More Articles',
    remainingSuffix: 'remaining',
    noArticlesFound: 'No Articles Found',
    noArticlesDesc:
      'No current affairs matched your active search query and filter criteria. Try clearing filters or adjusting your search term.',
    clearAllFilters: 'Clear All Filters',

    timeframeAll: 'All Available (30 Days)',
    timeframeToday: "Today's News Only",
    timeframe3Days: 'Past 3 Days',
    timeframe7Days: 'Past 7 Days',
    timeframeMonth: 'Past 30 Days',

    prelimsBadge: 'Prelims',
    mainsBadge: 'Mains',
    upscNotesButton: 'UPSC Notes',
    sourceButton: 'Source',
    saveArticleTooltip: 'Save for Revision',
    removeBookmarkTooltip: 'Remove Bookmark',
    verifiedSourceCommunique: 'Verified Source Communiqué',
    readCompleteReport: 'Read Complete Report at',
    syllabusClassification: 'UPSC Syllabus Classification & Relevance',
    syllabusNote:
      'Classification derived objectively from article topic metadata and the official UPSC Civil Services Examination syllabus.',
    primaryCategory: 'Primary Category',
    examStageRelevance: 'Exam Stage Relevance',
    prelimsHighYield: 'Prelims High-Yield',
    mainsAnalytical: 'Mains Analytical',
    gsLinkages: 'General Studies (GS) Paper Linkages:',
    keyAreas: 'Key Areas:',
    highPriorityKeywords: 'High-Priority Syllabus Keywords:',
    close: 'Close',
    openOriginalSource: 'Open Original Source',
    shareSuccess: 'Article link copied to clipboard!',

    savedTitle: 'Saved Current Affairs',
    savedSubtitle:
      'Your personal revision repository stored locally in your browser. No sign-up required.',
    exportNotes: 'Export Notes (.JSON)',
    clearAll: 'Clear All',
    noSavedArticles: 'No Saved Articles Yet',
    noSavedDesc:
      'Click the bookmark icon on any news card while studying to save key developments, government schemes, and landmark judgments for your Prelims and Mains revision.',
    browseCurrentAffairs: "Browse Today's Current Affairs",
    confirmClearTitle: 'Clear all saved articles?',
    confirmClearDesc:
      'This action will remove all bookmarked articles from your browser local storage. This cannot be undone.',
    cancel: 'Cancel',

    footerAboutDesc:
      'An independent, ad-free educational portal designed to help UPSC Civil Services aspirants track genuine daily developments across Indian Polity, Economy, Environment, Science & Technology, and International Relations.',
    footerDataUpdated: 'Data Updated:',
    footerActiveFeeds: 'active feeds',
    footerMonitoredSources: 'Monitored Primary Sources',
    footerArchitectureTitle: 'Open Architecture',
    footerArchitectureDesc:
      'Zero traditional backend. 100% free serverless architecture powered by GitHub Actions scheduled crawlers and deployed statically on GitHub Pages.',
    footerGithubRepo: 'GitHub Repository',
    footerDisclaimerTitle: 'Educational Disclaimer',
    footerDisclaimerText:
      'This website is an independent educational resource for UPSC aspirants. News and information are collected from publicly available sources. Please refer to the original source for official information and updates.',
    footerCopyright: 'UPSC Current Affairs. Understand Today. Prepare for Tomorrow.',
    footerProduction: 'Production Build • Deployed on GitHub Pages',
  },

  hi: {
    brandName: 'UPSC समसामयिकी (Current Affairs)',
    tagline: 'आज को समझें। कल के लिए तैयार रहें।',

    navHome: 'होम',
    navHighlights: 'आज की सुर्खियां',
    navAllNews: 'सभी समाचार',
    navCategories: 'श्रेणियां',
    navSaved: 'सहेजे गए लेख',
    navAbout: 'स्रोत व परिचय',
    navMenu: 'नेविगेशन',

    heroTitle: 'अपडेट रहें। आगे रहें।',
    heroSubtitle:
      'आधिकारिक सरकारी पोर्टलों और विश्वसनीय प्राथमिक स्रोतों से संकलित दैनिक भारतीय समसामयिकी, विशेष रूप से UPSC सिविल सेवा परीक्षा के पाठ्यक्रम के अनुरूप।',
    searchPlaceholder:
      'समाचार, सरकारी योजनाएं, कीवर्ड खोजें (जैसे: RBI, सुप्रीम कोर्ट, COP, GDP)...',
    popularTopics: 'लोकप्रिय विषय:',
    updatedPrefix: 'अद्यतन',
    totalArticlesLabel: 'कुल समाचार',
    totalArticlesSuffix: '+ सत्यापित',
    primarySourcesLabel: 'प्राथमिक स्रोत',
    primarySourcesValue: 'PIB, RBI, PRS एवं अन्य',
    syllabusMappingLabel: 'पाठ्यक्रम मैपिंग',
    syllabusMappingValue: 'GS I, II, III, IV एवं निबंध',
    updateFrequencyLabel: 'अपडेट आवृत्ति',
    updateFrequencyValue: 'प्रत्येक 6 घंटे में',
    staleWarningTitle: 'डेटा ताजगी पर सूचना:',
    staleWarningDesc:
      'समसामयिकी डेटा 24 घंटे से अधिक पुराना है। अगला स्वचालित गिटहब एक्शन चक्र शीघ्र ही नए समाचार अपडेट करेगा।',

    highlightsTitle: 'आज के महत्वपूर्ण समाचार',
    highlightsSubtitle:
      'आधिकारिक सरकारी निकायों और प्रमुख राष्ट्रीय समाचार पत्रों द्वारा प्रकाशित नवीनतम सत्यापित घटनाक्रम।',
    viewAllButton: 'सभी समाचार देखें',

    categoriesTitle: 'UPSC पाठ्यक्रम श्रेणियां',
    categoriesSubtitle:
      'सिविल सेवा परीक्षा पाठ्यक्रम में निर्धारित विशिष्ट विषयों के अनुसार समाचारों को फ़िल्टर करें।',
    allCategories: 'सभी श्रेणियां',

    gsPaperTitle: 'सामान्य अध्ययन (GS) प्रश्नपत्र मैपिंग',
    gsPaperSubtitle:
      'UPSC सिविल सेवा मुख्य परीक्षा के पाठ्यक्रम के साथ सीधा सह-संबंध।',
    showAllPapers: 'सभी प्रश्नपत्र दिखाएं',
    activeFilter: 'सक्रिय फ़िल्टर',
    clickToFilter: 'फ़िल्टर करने के लिए क्लिक करें',
    itemsCount: 'आलेख',

    feedTitle: 'दैनिक समसामयिकी प्रवाह',
    feedSubtitle:
      'सत्यापित प्राथमिक स्रोतों से कालानुक्रमिक, निष्पक्ष समाचार प्रवाह जो UPSC पाठ्यक्रम टैग के साथ मैप किया गया है।',
    feedSearchPlaceholder: 'कीवर्ड, मुख्य शीर्षक, योजनाएं, न्यायिक निर्णय खोजें...',
    dropdownCategory: 'UPSC श्रेणी',
    dropdownGSPaper: 'GS प्रश्नपत्र',
    dropdownSource: 'समाचार स्रोत',
    dropdownTimeframe: 'समय सीमा',
    searchCategoryPlaceholder: 'श्रेणी खोजने के लिए टाइप करें...',
    searchGSPaperPlaceholder: 'प्रश्नपत्र खोजने के लिए टाइप करें...',
    searchSourcePlaceholder: 'स्रोत खोजने के लिए टाइप करें...',
    searchTimeframePlaceholder: 'समय सीमा खोजने के लिए टाइप करें...',
    relevanceLabel: 'प्रासंगिकता:',
    relevanceAll: 'सभी चरण',
    relevancePrelims: 'प्रारंभिक परीक्षा उपयोगी',
    relevanceMains: 'मुख्य परीक्षा विश्लेषणात्मक',
    resetFilters: 'सभी फ़िल्टर रीसेट करें',
    showingPrefix: 'प्रदर्शित:',
    showingOf: 'में से',
    showingArticles: 'आलेख',
    filteredSuffix: '(फ़िल्टर किए गए)',
    loadMore: 'और समाचार लोड करें',
    remainingSuffix: 'शेष',
    noArticlesFound: 'कोई समाचार नहीं मिला',
    noArticlesDesc:
      'आपकी सक्रिय खोज और फ़िल्टर मानदंडों से मेल खाता हुआ कोई समाचार नहीं मिला। कृपया फ़िल्टर हटाएं या खोज शब्द बदलें।',
    clearAllFilters: 'सभी फ़िल्टर हटाएं',

    timeframeAll: 'सभी उपलब्ध (30 दिन)',
    timeframeToday: 'केवल आज के समाचार',
    timeframe3Days: 'पिछले 3 दिन',
    timeframe7Days: 'पिछले 7 दिन',
    timeframeMonth: 'पिछले 30 दिन',

    prelimsBadge: 'प्रारंभिक (Prelims)',
    mainsBadge: 'मुख्य (Mains)',
    upscNotesButton: 'UPSC नोट्स',
    sourceButton: 'मूल स्रोत',
    saveArticleTooltip: 'पुनरीक्षण के लिए सहेजें',
    removeBookmarkTooltip: 'बुकमार्क हटाएं',
    verifiedSourceCommunique: 'सत्यापित स्रोत विज्ञप्ति',
    readCompleteReport: 'पर पूरी रिपोर्ट पढ़ें',
    syllabusClassification: 'UPSC पाठ्यक्रम वर्गीकरण एवं प्रासंगिकता',
    syllabusNote:
      'समाचार विषय मेटाडेटा और आधिकारिक UPSC सिविल सेवा परीक्षा पाठ्यक्रम के आधार पर वस्तुनिष्ठ वर्गीकरण।',
    primaryCategory: 'प्राथमिक श्रेणी',
    examStageRelevance: 'परीक्षा चरण प्रासंगिकता',
    prelimsHighYield: 'प्रारंभिक परीक्षा उपयोगी',
    mainsAnalytical: 'मुख्य परीक्षा विश्लेषणात्मक',
    gsLinkages: 'सामान्य अध्ययन (GS) प्रश्नपत्र सह-संबंध:',
    keyAreas: 'प्रमुख क्षेत्र:',
    highPriorityKeywords: 'उच्च-प्राथमिकता पाठ्यक्रम कीवर्ड:',
    close: 'बंद करें',
    openOriginalSource: 'मूल आधिकारिक स्रोत खोलें',
    shareSuccess: 'आलेख लिंक क्लिपबोर्ड पर कॉपी हो गया!',

    savedTitle: 'सहेजे गए समसामयिकी आलेख',
    savedSubtitle:
      'आपके ब्राउज़र में सुरक्षित आपकी व्यक्तिगत पुनरीक्षण रिपॉजिटरी। किसी लॉगिन की आवश्यकता नहीं।',
    exportNotes: 'नोट्स निर्यात करें (.JSON)',
    clearAll: 'सभी हटाएं',
    noSavedArticles: 'अभी तक कोई आलेख सहेजा नहीं गया',
    noSavedDesc:
      'अध्ययन करते समय किसी भी समाचार कार्ड पर बुकमार्क आइकन पर क्लिक करें ताकि महत्वपूर्ण निर्णय, सरकारी योजनाएं और तथ्य आपकी प्रारंभिक और मुख्य परीक्षा की तैयारी के लिए सुरक्षित रहें।',
    browseCurrentAffairs: 'आज के समसामयिकी देखें',
    confirmClearTitle: 'क्या आप सभी सहेजे गए आलेख हटाना चाहते हैं?',
    confirmClearDesc:
      'यह कार्रवाई आपके ब्राउज़र स्टोरेज से सभी बुकमार्क किए गए आलेखों को हटा देगी। इसे पूर्ववत नहीं किया जा सकता।',
    cancel: 'रद्द करें',

    footerAboutDesc:
      'UPSC सिविल सेवा अभ्यर्थियों के लिए भारतीय राजव्यवस्था, अर्थव्यवस्था, पर्यावरण, विज्ञान एवं प्रौद्योगिकी और अंतर्राष्ट्रीय संबंधों के प्रामाणिक घटनाक्रमों को ट्रैक करने हेतु एक स्वतंत्र, विज्ञापन-मुक्त शैक्षिक पोर्टल।',
    footerDataUpdated: 'डेटा अद्यतन:',
    footerActiveFeeds: 'सक्रिय फ़ीड',
    footerMonitoredSources: 'निगरानी किए जाने वाले प्राथमिक स्रोत',
    footerArchitectureTitle: 'खुली वास्तुकला (Open Architecture)',
    footerArchitectureDesc:
      'शून्य पारंपरिक बैकएंड। 100% निःशुल्क सर्वरलेस तकनीक जो गिटहब एक्शन्स स्वचालित क्रॉलर द्वारा संचालित और गिटहब पेजेस पर परिनियोजित है।',
    footerGithubRepo: 'गिटहब रिपॉजिटरी',
    footerDisclaimerTitle: 'शैक्षिक अस्वीकरण (Disclaimer)',
    footerDisclaimerText:
      'यह वेबसाइट UPSC अभ्यर्थियों के लिए एक स्वतंत्र शैक्षिक संसाधन है। समाचार और जानकारी सार्वजनिक रूप से उपलब्ध स्रोतों से एकत्र की जाती है। आधिकारिक जानकारी के लिए कृपया मूल स्रोत देखें।',
    footerCopyright: 'UPSC Current Affairs. आज को समझें। कल के लिए तैयार रहें।',
    footerProduction: 'प्रोडक्शन बिल्ड • गिटहब पेजेस पर परिनियोजित',
  },
};

export const CATEGORY_TRANSLATIONS: Record<string, { en: string; hi: string }> = {
  'National Affairs': { en: 'National Affairs', hi: 'राष्ट्रीय मामले' },
  'International Relations': { en: 'International Relations', hi: 'अंतर्राष्ट्रीय संबंध' },
  'Indian Polity': { en: 'Indian Polity', hi: 'भारतीय राजव्यवस्था' },
  Economy: { en: 'Economy', hi: 'अर्थव्यवस्था' },
  'Environment & Ecology': { en: 'Environment & Ecology', hi: 'पर्यावरण एवं पारिस्थितिकी' },
  'Science & Technology': { en: 'Science & Technology', hi: 'विज्ञान एवं प्रौद्योगिकी' },
  'Defence & Security': { en: 'Defence & Security', hi: 'रक्षा एवं आंतरिक सुरक्षा' },
  'Government Schemes': { en: 'Government Schemes', hi: 'सरकारी योजनाएं' },
  'Social Issues': { en: 'Social Issues', hi: 'सामाजिक मुद्दे' },
  'Important Reports & Indices': { en: 'Important Reports & Indices', hi: 'महत्वपूर्ण रिपोर्ट एवं सूचकांक' },
  Geography: { en: 'Geography', hi: 'भूगोल एवं आपदा प्रबंधन' },
  'History & Culture': { en: 'History & Culture', hi: 'इतिहास, कला एवं संस्कृति' },
};

export const GS_PAPER_TRANSLATIONS: Record<string, { en: string; hi: string; descEn: string; descHi: string }> = {
  'GS Paper I': {
    en: 'GS Paper I',
    hi: 'GS प्रश्नपत्र I',
    descEn: 'History, Art & Culture, Indian Society, Geography',
    descHi: 'इतिहास, कला एवं संस्कृति, भारतीय समाज, भूगोल',
  },
  'GS Paper II': {
    en: 'GS Paper II',
    hi: 'GS प्रश्नपत्र II',
    descEn: 'Governance, Constitution, Polity, Social Justice, IR',
    descHi: 'शासन व्यवस्था, संविधान, राजव्यवस्था, सामाजिक न्याय, अंतर्राष्ट्रीय संबंध',
  },
  'GS Paper III': {
    en: 'GS Paper III',
    hi: 'GS प्रश्नपत्र III',
    descEn: 'Economy, Agriculture, Science & Tech, Environment, Security',
    descHi: 'अर्थव्यवस्था, कृषि, विज्ञान एवं प्रौद्योगिकी, पर्यावरण, सुरक्षा',
  },
  'GS Paper IV': {
    en: 'GS Paper IV',
    hi: 'GS प्रश्नपत्र IV',
    descEn: 'Ethics, Integrity and Aptitude, Governance Probity',
    descHi: 'नीतिशास्त्र, सत्यनिष्ठा एवं अभिवृत्ति, शासन में शुचिता',
  },
  Essay: {
    en: 'Essay',
    hi: 'निबंध (Essay)',
    descEn: 'Analytical perspectives on socio-economic & philosophical issues',
    descHi: 'सामाजिक-आर्थिक और दार्शनिक मुद्दों पर विश्लेषणात्मक दृष्टिकोण',
  },
};

export const SOURCE_TRANSLATIONS: Record<string, { en: string; hi: string }> = {
  'Press Information Bureau (PIB)': { en: 'Press Information Bureau (PIB)', hi: 'प्रेस सूचना ब्यूरो (PIB)' },
  'Reserve Bank of India (RBI)': { en: 'Reserve Bank of India (RBI)', hi: 'भारतीय रिजर्व बैंक (RBI)' },
  'PRS Legislative Research': { en: 'PRS Legislative Research', hi: 'पीआरएस लेजिस्लेटिव रिसर्च (PRS)' },
  'The Hindu (National)': { en: 'The Hindu (National)', hi: 'द हिंदू (राष्ट्रीय)' },
  'The Hindu (International)': { en: 'The Hindu (International)', hi: 'द हिंदू (अंतर्राष्ट्रीय)' },
  'The Hindu BusinessLine (Economy)': { en: 'The Hindu BusinessLine (Economy)', hi: 'द हिंदू बिजनेसलाइन (अर्थव्यवस्था)' },
  'The Hindu (Environment)': { en: 'The Hindu (Environment)', hi: 'द हिंदू (पर्यावरण)' },
  'The Hindu (Science & Tech)': { en: 'The Hindu (Science & Tech)', hi: 'द हिंदू (विज्ञान एवं प्रौद्योगिकी)' },
  'Indian Express (Explained)': { en: 'Indian Express (Explained)', hi: 'इंडियन एक्सप्रेस (एक्सप्लेंड)' },
  'Indian Express (India)': { en: 'Indian Express (India)', hi: 'इंडियन एक्सप्रेस (भारत)' },
  'Livemint (Economy & Policy)': { en: 'Livemint (Economy & Policy)', hi: 'लाइवमिंट (नीति एवं अर्थव्यवस्था)' },
};
