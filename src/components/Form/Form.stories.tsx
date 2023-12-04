import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';

type ComponentType = React.ComponentProps<typeof Form>;
const meta: Meta<ComponentType> = {
  component: Form,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
