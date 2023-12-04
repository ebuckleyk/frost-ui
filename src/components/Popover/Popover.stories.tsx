import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';

type ComponentType = React.ComponentProps<typeof Popover>;
const meta: Meta<ComponentType> = {
  component: Popover,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
