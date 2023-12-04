import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from './AlertDialog';

type ComponentType = React.ComponentProps<typeof AlertDialog>;
const meta: Meta<ComponentType> = {
  component: AlertDialog,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
