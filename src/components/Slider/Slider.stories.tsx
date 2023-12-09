import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Slider } from './Slider';

function SliderDemo() {
  return (
    <div className="w-[200px]">
      <Slider defaultValue={[50]} max={100} step={1} className={'w-[100%]'} />
    </div>
  );
}

type ComponentType = React.ComponentProps<typeof Slider>;
const meta: Meta<ComponentType> = {
  component: Slider,
  render: SliderDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
