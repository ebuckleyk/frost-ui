import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

type ComponentType = React.ComponentProps<typeof Avatar>;
const meta: Meta<ComponentType> = {
  component: Avatar,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
