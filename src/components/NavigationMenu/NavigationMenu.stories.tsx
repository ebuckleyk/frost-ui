import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from './NavigationMenu';

type ComponentType = React.ComponentProps<typeof NavigationMenu>;
const meta: Meta<ComponentType> = {
  component: NavigationMenu,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
