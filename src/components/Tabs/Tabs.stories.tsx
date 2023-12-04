import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

type ComponentType = React.ComponentProps<typeof Tabs>;
const meta: Meta<ComponentType> = {
  component: Tabs,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
