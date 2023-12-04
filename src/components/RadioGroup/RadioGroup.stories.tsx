import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

type ComponentType = React.ComponentProps<typeof RadioGroup>;
const meta: Meta<ComponentType> = {
  component: RadioGroup,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
