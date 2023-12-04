import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

type ComponentType = React.ComponentProps<typeof DatePicker>;
const meta: Meta<ComponentType> = {
  component: DatePicker,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
