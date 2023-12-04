import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Label } from '../Label';

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
      <React.Fragment>
        <Label htmlFor="input">Input</Label>
        <Input {...args} id="input" placeholder="Placeholder text" />
      </React.Fragment>
    );
  },
};
