import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

type ComponentType = React.ComponentProps<typeof Switch>;
const meta: Meta<ComponentType> = {
  component: Switch,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
