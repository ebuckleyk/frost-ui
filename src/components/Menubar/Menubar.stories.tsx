import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Menubar } from './Menubar';

type ComponentType = React.ComponentProps<typeof Menubar>;
const meta: Meta<ComponentType> = {
  component: Menubar,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
