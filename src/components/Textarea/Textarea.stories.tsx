import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from './Textarea';

function TextareaDemo() {
  return <Textarea className="w-[250px]" placeholder="Type your message here." />;
}
type ComponentType = React.ComponentProps<typeof Textarea>;
const meta: Meta<ComponentType> = {
  component: Textarea,
  render: TextareaDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
