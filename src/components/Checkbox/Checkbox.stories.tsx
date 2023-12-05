import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { Card } from '../Card';

function CheckboxDemo() {
  return (
    <Card className="flex items-center space-x-2 p-5">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </Card>
  );
}
type ComponentType = React.ComponentProps<typeof Checkbox>;
const meta: Meta<ComponentType> = {
  component: Checkbox,
  render: CheckboxDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
