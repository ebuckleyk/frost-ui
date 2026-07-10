import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from './Bubble';

const meta: Meta<typeof Bubble> = { component: Bubble };
export default meta;
type Story = StoryObj<typeof Bubble>;

export const Demo: Story = {
  render: () => (
    <div className="flex min-h-120 w-full max-w-2xl flex-col justify-center gap-5 rounded-xl border border-(--glass-edge) bg-card/20 p-8">
      <Bubble align="end">
        <BubbleContent>Hey there! what&apos;s up?</BubbleContent>
      </Bubble>

      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>Hey! Want to see chat bubbles?</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>I can group messages, switch sides, and keep the whole thread easy to scan.</BubbleContent>
        </Bubble>
      </BubbleGroup>

      <Bubble align="end">
        <BubbleContent>Sure. Hit me with your best demo!</BubbleContent>
        <BubbleReactions>{'👍'}</BubbleReactions>
      </Bubble>

      <Bubble variant="secondary">
        <BubbleContent>Yes. You are reading a demo that is demoing itself. Very meta. Very on-brand.</BubbleContent>
        <BubbleReactions>{'👍 🔥 👀 +2'}</BubbleReactions>
      </Bubble>
    </div>
  ),
};
