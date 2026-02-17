import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../Checkbox';
import { Label } from './Label';

function LabelDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  );
}
type ComponentType = typeof Label;
const meta: Meta<ComponentType> = {
  component: Label,
  render: LabelDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;

export const Demo: Story = {
  args: {},
};
