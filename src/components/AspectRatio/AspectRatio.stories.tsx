import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './AspectRatio';
import { Card } from '../Card';

function AspectRatioDemo({ ratio }: { ratio: number | undefined }) {
  return (
    <Card className="w-[250px] content-center">
      <AspectRatio ratio={ratio}>
        <img src="https://wowslider.com/sliders/demo-31/data1/images/autumn1072827.jpg" />
      </AspectRatio>
    </Card>
  );
}
type ComponentType = React.ComponentProps<typeof AspectRatio>;
const meta: Meta<ComponentType> = {
  component: AspectRatio,
  render: ({ ratio }) => <AspectRatioDemo ratio={ratio} />,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const SixteenBy9: Story = {
  args: {
    ratio: 16 / 9,
  },
};
SixteenBy9.storyName = '16 / 9';

export const FourBy3: Story = {
  args: {
    ratio: 4 / 3,
  },
};

FourBy3.storyName = '4 / 3';
