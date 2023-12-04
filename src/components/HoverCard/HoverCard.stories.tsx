import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';

type ComponentType = React.ComponentProps<typeof HoverCard>;
const meta: Meta<ComponentType> = {
  component: HoverCard,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
