import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from './DropdownMenu';

type ComponentType = React.ComponentProps<typeof DropdownMenu>;
const meta: Meta<ComponentType> = {
  component: DropdownMenu,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
