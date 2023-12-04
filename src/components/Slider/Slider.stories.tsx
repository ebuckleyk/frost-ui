import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

type ComponentType = React.ComponentProps<typeof Slider>;
const meta: Meta<ComponentType> = {
  component: Slider,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
