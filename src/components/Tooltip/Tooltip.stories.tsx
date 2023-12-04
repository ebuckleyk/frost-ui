import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

type ComponentType = React.ComponentProps<typeof Tooltip>;
const meta: Meta<ComponentType> = {
  component: Tooltip,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
