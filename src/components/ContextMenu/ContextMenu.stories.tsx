import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from './ContextMenu';

type ComponentType = React.ComponentProps<typeof ContextMenu>;
const meta: Meta<ComponentType> = {
  component: ContextMenu,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
