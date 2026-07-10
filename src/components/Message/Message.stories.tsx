import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback } from '../Avatar';
import { Bubble, BubbleContent } from '../Bubble';
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from './Message';

const meta: Meta<typeof Message> = { component: Message };
export default meta;
type Story = StoryObj<typeof Message>;

export const Demo: Story = {
  render: () => (
    <MessageGroup className="w-full max-w-xl">
      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Emmanuel</MessageHeader>
          <Bubble>
            <BubbleContent>Can you add the new components?</BubbleContent>
          </Bubble>
          <MessageFooter>Delivered</MessageFooter>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>F</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Frost UI</MessageHeader>
          <Bubble variant="secondary">
            <BubbleContent>They’re ready to review.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  ),
};
