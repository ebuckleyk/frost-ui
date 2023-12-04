import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

type ComponentType = React.ComponentProps<typeof Alert>;
const meta: Meta<ComponentType> = {
  component: Alert,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
