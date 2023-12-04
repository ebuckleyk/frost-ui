import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

type ComponentType = React.ComponentProps<typeof Toggle>;
const meta: Meta<ComponentType> = {
  component: Toggle,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
