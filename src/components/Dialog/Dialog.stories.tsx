import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';

type ComponentType = React.ComponentProps<typeof Dialog>;
const meta: Meta<ComponentType> = {
  component: Dialog,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
