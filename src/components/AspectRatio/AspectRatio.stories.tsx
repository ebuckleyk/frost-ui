import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './AspectRatio';

type ComponentType = React.ComponentProps<typeof AspectRatio>;
const meta: Meta<ComponentType> = {
  component: AspectRatio,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
