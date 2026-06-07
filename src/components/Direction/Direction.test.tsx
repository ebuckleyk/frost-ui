import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DirectionProvider, useDirection } from './Direction';

function DirectionProbe() {
  const direction = useDirection();
  return <span>{direction}</span>;
}

describe('DirectionProvider', () => {
  it('should provide the current direction', () => {
    render(
      <DirectionProvider direction="rtl">
        <DirectionProbe />
      </DirectionProvider>,
    );

    expect(screen.getByText('rtl')).toBeInTheDocument();
  });
});
