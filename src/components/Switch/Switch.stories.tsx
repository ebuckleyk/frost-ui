import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Label } from '../Label';
import { Switch } from './Switch';

function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  );
}

type ComponentType = React.ComponentProps<typeof Switch>;
const meta: Meta<ComponentType> = {
  component: Switch,
  render: SwitchDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
