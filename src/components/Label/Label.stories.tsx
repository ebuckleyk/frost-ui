import { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

type ComponentType = typeof Label;
const meta: Meta<ComponentType> = {
  component: Label,
};

export default meta;

type Story = StoryObj<ComponentType>;

export const Default: Story = {
  args: {},
};
