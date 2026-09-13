import defaultTheme from './defaultTheme';

const withTheme = (overrides) => ({ ...defaultTheme, ...overrides });

const themePresets = {
  'SKYNZ Neon': withTheme({ primary: '#b000ff', secondary: '#00bfff', accent: '#ff1493', background: '#060608', panelBackground: '#101014', glow: true }),
  'Southern Rock': withTheme({ primary: '#d97706', secondary: '#facc15', accent: '#ef4444', background: '#17120d', panelBackground: '#261b13', glow: true }),
  Country: withTheme({ primary: '#a16207', secondary: '#65a30d', accent: '#f59e0b', background: '#15130f', panelBackground: '#242018', glow: false }),
  Metal: withTheme({ primary: '#94a3b8', secondary: '#475569', accent: '#ef4444', background: '#08090c', panelBackground: '#151820', glow: true }),
  'Hip Hop': withTheme({ primary: '#facc15', secondary: '#22c55e', accent: '#f97316', background: '#0b0b0b', panelBackground: '#191919', glow: true }),
  Electronic: withTheme({ primary: '#22d3ee', secondary: '#818cf8', accent: '#f472b6', background: '#071018', panelBackground: '#101d2b', glow: true }),
  Podcast: withTheme({ primary: '#f97316', secondary: '#fb7185', accent: '#facc15', background: '#17100d', panelBackground: '#241915', glow: false }),
  'Clean Minimal': withTheme({ primary: '#2563eb', secondary: '#0f766e', accent: '#ea580c', background: '#f5f7fa', panelBackground: '#ffffff', text: '#111827', mutedText: '#526071', glow: false, borderRadius: 10 })
};

export default themePresets;
