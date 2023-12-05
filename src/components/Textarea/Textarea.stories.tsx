import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Card } from '../Card';
import { Textarea } from './Textarea';

function TextareaDemo() {
  return (
    <Card className="w-[350px] p-10">
      <Textarea placeholder="Type your message here." />
    </Card>
  );
}
type ComponentType = React.ComponentProps<typeof Textarea>;
const meta: Meta<ComponentType> = {
  component: Textarea,
  render: TextareaDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
