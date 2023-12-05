import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Label } from '../Label';
import { Card } from '../Card';

type ComponentType = typeof Input;
const meta: Meta<ComponentType> = {
  component: Input,
  render: () => (
    <Card className="flex items-center p-5">
      <Input />
    </Card>
  ),
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
      <Card className="p-10">
        <Label htmlFor="input">Input</Label>
        <Input {...args} id="input" placeholder="Placeholder text" />
      </Card>
    );
  },
};
