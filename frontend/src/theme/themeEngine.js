export const themeToVariables = (theme) => ({
  '--primary': theme.primary,
  '--secondary': theme.secondary,
  '--accent': theme.accent,
  '--background': theme.background,
  '--panel': theme.panelBackground,
  '--text': theme.text,
  '--muted-text': theme.mutedText,
  '--radius': `${theme.borderRadius}px`,
  '--glow': theme.glow ? `0 0 28px ${theme.primary}33` : 'none',
  '--font-family': theme.fontFamily || 'system-ui'
});

export const applyTheme = (element, theme) => {
  Object.entries(themeToVariables(theme)).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
};
