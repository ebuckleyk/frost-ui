import { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

type ComponentType = typeof Select;
const meta: Meta<ComponentType> = {
  component: Select,
};

export default meta;

type Story = StoryObj<ComponentType>;

export const Default: Story = {
  args: {},
};
