import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

type ComponentType = React.ComponentProps<typeof Skeleton>;
const meta: Meta<ComponentType> = {
  component: Skeleton,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
