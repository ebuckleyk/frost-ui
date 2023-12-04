import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Sheet } from './Sheet';

type ComponentType = React.ComponentProps<typeof Sheet>;
const meta: Meta<ComponentType> = {
  component: Sheet,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
