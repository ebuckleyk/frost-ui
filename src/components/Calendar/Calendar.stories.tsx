import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';

type ComponentType = React.ComponentProps<typeof Calendar>;
const meta: Meta<ComponentType> = {
  component: Calendar,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
