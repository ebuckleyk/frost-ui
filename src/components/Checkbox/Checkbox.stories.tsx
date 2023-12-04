import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

type ComponentType = React.ComponentProps<typeof Checkbox>;
const meta: Meta<ComponentType> = {
  component: Checkbox,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
