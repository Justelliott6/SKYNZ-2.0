export const createCreatorPageConfig = (page = {}) => ({
  theme: {
    primary: '#b000ff',
    secondary: '#00bfff',
    accent: '#ff1493',
    background: '#060608',
    panelBackground: '#101014',
    text: '#ffffff',
    mutedText: '#a7a7b3',
    borderRadius: 16,
    glow: true,
    fontFamily: 'system-ui'
  },
  creator: {
    name: page.title || 'Creator',
    handle: page.handle || 'creator',
    bio: page.description || 'Creator details will appear here.',
    genre: 'Creator',
    vibe: 'Open channel',
    profileImage: '',
    heroImage: '',
    verified: false,
    platforms: page.platforms || []
  },
  media: {
    embedUrl: page.embed_url || '',
    nowPlaying: page.embed_url ? 'Embedded media' : 'No media selected',
    listeners: 0,
    isLive: false
  },
  support: {
    supportLink: page.affiliate_link || '',
    affiliateLink: page.affiliate_link || '',
    merchandiseLink: '',
    membershipLink: '',
    externalLinks: []
  },
  layout: {
    showStatusBar: true,
    showChat: true,
    showAnalytics: true,
    mediaPosition: 'left'
  },
  analytics: {
    pageViews: 0,
    uniqueVisitors: 0,
    watchTime: 0,
    chatActivity: 0,
    viewsOverTime: [],
    audienceLocations: [],
    range: '24H'
  },
  addons: []
});

export default createCreatorPageConfig;
