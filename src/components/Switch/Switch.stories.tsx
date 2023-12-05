import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Card } from '../Card';
import { Label } from '../Label';
import { Switch } from './Switch';

function SwitchDemo() {
  return (
    <Card className="flex items-center space-x-2 p-10">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </Card>
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
