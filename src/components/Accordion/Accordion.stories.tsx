import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

type ComponentType = React.ComponentProps<typeof Accordion>;
const meta: Meta<ComponentType> = {
  component: Accordion,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
