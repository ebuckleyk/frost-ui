import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

type ComponentType = React.ComponentProps<typeof Textarea>;
const meta: Meta<ComponentType> = {
  component: Textarea,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
