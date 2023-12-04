import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Collapsible } from './Collapsible';

type ComponentType = React.ComponentProps<typeof Collapsible>;
const meta: Meta<ComponentType> = {
  component: Collapsible,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
