import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';

type ComponentType = React.ComponentProps<typeof ScrollArea>;
const meta: Meta<ComponentType> = {
  component: ScrollArea,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
