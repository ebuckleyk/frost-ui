import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { ThemeProvider, useTheme } from './ThemeProvider';

const storageKey = 'frost-ui-theme-test';

function ThemeConsumer() {
  const { theme, setTheme } = useTheme();

  return (
    <button type="button" onClick={() => setTheme('light')}>
      {theme}
    </button>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
  });

  it('restores and applies a stored theme', () => {
    localStorage.setItem(storageKey, 'dark');

    render(
      <ThemeProvider storageKey={storageKey}>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
  });

  it('updates state, storage, and the document class', () => {
    render(
      <ThemeProvider storageKey={storageKey} theme="dark">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('light');
    expect(localStorage.getItem(storageKey)).toBe('light');
    expect(document.documentElement).toHaveClass('light');
  });

  it('throws when useTheme is used outside ThemeProvider', () => {
    expect(() => render(<ThemeConsumer />)).toThrow('useTheme must be used within a ThemeProvider');
  });
});
