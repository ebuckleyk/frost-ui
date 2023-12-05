import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';
import { Checkbox } from '../Checkbox';
import { Card } from '../Card';

function LabelDemo() {
  return (
    <Card className="p-10">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </Card>
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
