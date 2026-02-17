import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../Label';
import { Input } from './Input';

type ComponentType = typeof Input;
const meta: Meta<ComponentType> = {
  component: Input,
};

export default meta;

type Story = StoryObj<ComponentType>;

export const Demo: Story = {
  args: {
    placeholder: 'Placeholder text',
  },
};

export const SelectWithLabel: Story = {
  render: (args) => {
    return (
      <>
        <Label htmlFor="input">Username</Label>
        <Input {...args} id="input" placeholder="Placeholder text" />
      </>
    );
  },
};
