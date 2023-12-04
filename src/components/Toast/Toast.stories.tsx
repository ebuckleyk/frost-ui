import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

type ComponentType = React.ComponentProps<typeof Toast>;
const meta: Meta<ComponentType> = {
  component: Toast,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
