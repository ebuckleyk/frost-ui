import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Kbd, KbdGroup } from './Kbd';

describe('Kbd', () => {
  it('should render Kbd component to match snapshot', () => {
    const result = render(<Kbd>Ctrl</Kbd>);
    expect(result).toMatchSnapshot();
  });

  it('should render Kbd with icon to match snapshot', () => {
    const result = render(<Kbd>⌘ K</Kbd>);
    expect(result).toMatchSnapshot();
  });

  it('should render KbdGroup to match snapshot', () => {
    const result = render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>C</Kbd>
      </KbdGroup>,
    );
    expect(result).toMatchSnapshot();
  });
});
