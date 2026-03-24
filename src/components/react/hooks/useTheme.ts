import { useState, useEffect } from 'react';
import { THEME_ATTRIBUTE, DEFAULT_THEME } from '../../../config/theme';

export function useTheme(): string {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute(THEME_ATTRIBUTE) || DEFAULT_THEME
      : DEFAULT_THEME,
  );

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(html.getAttribute(THEME_ATTRIBUTE) || DEFAULT_THEME);
    });
    observer.observe(html, { attributes: true, attributeFilter: [THEME_ATTRIBUTE] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
