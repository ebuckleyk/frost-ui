import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';

type ComponentType = React.ComponentProps<typeof Table>;
const meta: Meta<ComponentType> = {
  component: Table,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
