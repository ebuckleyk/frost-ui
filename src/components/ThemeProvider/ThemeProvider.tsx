import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export type ThemeProviderProps = {
  children: ReactNode;
  theme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const MEDIA = '(prefers-color-scheme: dark)';
const isServer = typeof window === 'undefined';

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  theme = 'system',
  storageKey = 'ebuckleyk/frost-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [themeState, setThemeState] = useState<Theme>(() => theme || getTheme(storageKey, theme));

  const applyTheme = useCallback((t: Theme) => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (t === 'system') {
      const systemTheme = window.matchMedia(MEDIA).matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return t;
    }

    root.classList.add(t);
    return t;
  }, []);

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const systemTheme = getSystemTheme(e);
      if (themeState === 'system') {
        applyTheme(systemTheme);
      }
    },
    [applyTheme, themeState],
  );

  const setTheme = useCallback(
    (t: Theme) => {
      try {
        setThemeState(t);
        localStorage.setItem(storageKey, t);
      } catch (error) {
        // unsupported
      }
    },
    [storageKey],
  );

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;

      const t = (e.newValue || theme) as Theme;
      setTheme(t);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setTheme, storageKey, theme]);

  // always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // whenever theme changes, apply it
  useEffect(() => {
    setTheme(theme || 'system');
  }, [applyTheme, setTheme, theme]);

  useEffect(() => {
    applyTheme(themeState);
  }, [applyTheme, themeState]);

  const providerValue: ThemeProviderState = {
    theme: themeState,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={providerValue}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent): Theme => {
  if (!e) e = window.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? 'dark' : 'light';
  return systemTheme;
};

const getTheme = (key: string, fallback: Theme): Theme => {
  if (isServer) return fallback;
  let theme: Theme = fallback;
  try {
    theme = (localStorage.getItem(key) as Theme) || undefined;
  } catch (error) {
    /* empty */
  }
  return theme || fallback;
};
