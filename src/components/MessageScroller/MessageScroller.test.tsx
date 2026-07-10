import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from './MessageScroller';

describe('MessageScroller', () => {
  it('renders an accessible transcript and scroll control', () => {
    render(
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport aria-label="Conversation">
            <MessageScrollerContent>
              <MessageScrollerItem messageId="message-1" scrollAnchor>
                Hello
              </MessageScrollerItem>
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>,
    );

    expect(screen.getByRole('region', { name: 'Conversation' })).toBeInTheDocument();
    expect(screen.getByRole('log')).toHaveTextContent('Hello');
    expect(screen.getByRole('button', { name: 'Scroll to end' })).toBeInTheDocument();
  });
});
