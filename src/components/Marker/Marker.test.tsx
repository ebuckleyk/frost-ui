import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Marker, MarkerContent, MarkerIcon } from './Marker';

describe('Marker', () => {
  it('renders a labeled separator', () => {
    const { container } = render(
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>,
    );
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-variant', 'separator');
  });

  it('marks icons as decorative', () => {
    const { container } = render(
      <Marker role="status">
        <MarkerIcon>✓</MarkerIcon>
        <MarkerContent>Complete</MarkerContent>
      </Marker>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Complete');
    expect(container.querySelector('[data-slot="marker-icon"]')).toHaveAttribute('aria-hidden', 'true');
  });
});
