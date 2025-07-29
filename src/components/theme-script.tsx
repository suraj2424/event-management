export function ThemeScript() {
  const codeToRunOnClient = `
(function() {
  function getThemePreference() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return 'system';
  }
  
  function getActualTheme(theme) {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }
  
  const theme = getThemePreference();
  const actualTheme = getActualTheme(theme);
  document.documentElement.classList.add(actualTheme);
})();`

  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}