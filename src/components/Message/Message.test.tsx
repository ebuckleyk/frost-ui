import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Bubble, BubbleContent } from '../Bubble';
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader } from './Message';

describe('Message', () => {
  it('composes an aligned message row', () => {
    const { container } = render(
      <Message align="end">
        <MessageAvatar>ME</MessageAvatar>
        <MessageContent>
          <MessageHeader>Emmanuel</MessageHeader>
          <Bubble>
            <BubbleContent>Ship it.</BubbleContent>
          </Bubble>
          <MessageFooter>Delivered</MessageFooter>
        </MessageContent>
      </Message>,
    );
    expect(screen.getByText('Ship it.')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-align', 'end');
  });
});
