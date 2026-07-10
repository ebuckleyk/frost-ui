import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Bubble, BubbleContent, BubbleReactions } from './Bubble';

describe('Bubble', () => {
  it('renders aligned conversational content and reactions', () => {
    const { container } = render(
      <Bubble variant="secondary" align="end">
        <BubbleContent>Hello</BubbleContent>
        <BubbleReactions>👍 2</BubbleReactions>
      </Bubble>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-align', 'end');
    expect(container.firstChild).toHaveAttribute('data-variant', 'secondary');
  });

  it('renders content as a link', () => {
    render(
      <Bubble>
        <BubbleContent asChild>
          <a href="/help">Get help</a>
        </BubbleContent>
      </Bubble>,
    );
    expect(screen.getByRole('link', { name: 'Get help' })).toHaveAttribute('href', '/help');
  });
});
