import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup } from './ToggleGroup';

type ComponentType = React.ComponentProps<typeof ToggleGroup>;
const meta: Meta<ComponentType> = {
  component: ToggleGroup,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
