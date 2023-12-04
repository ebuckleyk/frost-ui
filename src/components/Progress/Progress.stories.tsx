import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

type ComponentType = React.ComponentProps<typeof Progress>;
const meta: Meta<ComponentType> = {
  component: Progress,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
