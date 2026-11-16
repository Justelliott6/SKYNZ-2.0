// Creator-controlled visual presets. Real local artwork can be added later as a
// separate licensed asset pack; CSS presets must work without external images.
// These are style targets, not claims that screenshot widgets are implemented.
export const CREATOR_THEMES = Object.freeze({
  emerald: { label: 'SKYNZ Green', accent: '#39d99a', secondary: '#9cf9cf', background: 'linear-gradient(145deg, #061711 0%, #0d1720 55%, #07100d 100%)', panel: 'rgba(9, 26, 23, 0.93)', border: '#387f6e', glow: 'rgba(57,217,154,.26)', text: '#f3fff9', subtitle: 'Creator control' },
  cyan: { label: 'Electric Blue', accent: '#37b9ed', secondary: '#a2e9ff', background: 'linear-gradient(130deg, #031423, #091a32 60%, #061723)', panel: 'rgba(8, 25, 43, .94)', border: '#327b9a', glow: 'rgba(55,185,237,.28)', text: '#f2fbff', subtitle: 'Digital stage' },
  amber: { label: 'Southern Rock', accent: '#f3b657', secondary: '#ffe0a8', background: 'linear-gradient(140deg, #1c1209, #251911 58%, #0e1417)', panel: 'rgba(34, 23, 16, .94)', border: '#916a3c', glow: 'rgba(243,182,87,.26)', text: '#fff8ec', subtitle: 'Made for the stage' },
  rose: { label: 'Rose', accent: '#f07b99', secondary: '#ffd2e1', background: 'linear-gradient(135deg, #241025, #35192c 60%, #101727)', panel: 'rgba(42,18,39,.93)', border: '#a04c80', glow: 'rgba(240,123,153,.25)', text: '#fff4f9', subtitle: 'Your own spotlight' },
  lambo: { label: 'Lambo / Luxury', accent: '#eebd62', secondary: '#fff0c5', background: 'radial-gradient(circle at 80% 0%, rgba(161,108,34,.38), transparent 42%), linear-gradient(145deg,#05070a,#171c1e 53%,#07090a)', panel: 'rgba(12, 16, 18, .94)', border: '#8b6a38', glow: 'rgba(238,189,98,.25)', text: '#fff8e9', subtitle: 'Performance · Precision · Presence' },
  luna: { label: 'Luna Ray / Glam', accent: '#ff90d8', secondary: '#ffe5f6', background: 'radial-gradient(circle at 15% 0%, rgba(255,95,181,.37), transparent 40%), linear-gradient(135deg,#291033,#511e66 56%,#1c1239)', panel: 'rgba(50, 20, 70, .92)', border: '#c668d1', glow: 'rgba(255,144,216,.34)', text: '#fff3ff', subtitle: 'Make your own magic' },
  elliott: { label: 'Elliott / Backstage', accent: '#b1ff71', secondary: '#e4ffc3', background: 'radial-gradient(circle at 75% 10%, rgba(72,153,40,.28), transparent 45%), linear-gradient(135deg,#06100b,#18251a 60%,#0b0d10)', panel: 'rgba(12, 26, 17, .95)', border: '#517c46', glow: 'rgba(177,255,113,.27)', text: '#f4ffed', subtitle: 'The music. The story. The stage.' }
});

export const CREATOR_THEME_IDS = Object.freeze(Object.keys(CREATOR_THEMES));
export const getCreatorTheme = (id) => CREATOR_THEMES[id] || CREATOR_THEMES.emerald;
