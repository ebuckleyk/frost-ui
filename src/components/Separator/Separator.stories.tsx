import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';

type ComponentType = React.ComponentProps<typeof Separator>;
const meta: Meta<ComponentType> = {
  component: Separator,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
