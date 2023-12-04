import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Command } from './Command';

type ComponentType = React.ComponentProps<typeof Command>;
const meta: Meta<ComponentType> = {
  component: Command,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
