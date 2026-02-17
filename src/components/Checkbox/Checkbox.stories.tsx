import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from './Checkbox';

function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2 p-5">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
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
