import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Bubble, BubbleContent } from '../Bubble';
import { Message, MessageContent } from '../Message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from './MessageScroller';

const meta: Meta<typeof MessageScroller> = { component: MessageScroller };
export default meta;
type Story = StoryObj<typeof MessageScroller>;

export const Demo: Story = {
  render: () => (
    <MessageScrollerProvider defaultScrollPosition="end">
      <MessageScroller className="h-96 w-full max-w-xl rounded-xl border border-(--glass-edge)">
        <MessageScrollerViewport aria-label="Conversation" className="p-4">
          <MessageScrollerContent>
            {Array.from({ length: 8 }, (_, index) => (
              <MessageScrollerItem key={index} messageId={`message-${index}`} scrollAnchor={index === 7}>
                <Message align={index % 2 ? 'end' : 'start'}>
                  <MessageContent>
                    <Bubble variant={index % 2 ? 'default' : 'secondary'}>
                      <BubbleContent>Conversation message {index + 1}</BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  ),
};
