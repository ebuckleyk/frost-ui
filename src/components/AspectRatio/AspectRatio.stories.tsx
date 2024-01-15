import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { useImageOnLoad } from '../../hooks/useImageOnLoad';
import { AspectRatio } from './AspectRatio';

function AspectRatioDemo({ ratio }: { ratio: number | undefined }) {
  const { handleImageOnLoad, css } = useImageOnLoad();

  const style: { [key: string]: React.CSSProperties } = {
    wrap: {
      position: 'relative',
      width: 400,
      height: 400,
      margin: 'auto',
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: `100%`,
      height: `100%`,
    },
  };

  return (
    <AspectRatio style={style} ratio={ratio}>
      <img
        style={{ ...style.image, ...(css.thumbnail as React.CSSProperties) }}
        src="https://wowslider.com/sliders/demo-31/data1/images/autumn1072827.jpg"
        alt="thumbnail"
      />
      <img
        onLoad={handleImageOnLoad}
        style={{ ...style.image, ...(css.fullSize as React.CSSProperties) }}
        src="https://wowslider.com/sliders/demo-31/data1/images/autumn1072827.jpg"
        alt="thumbnail"
      />
    </AspectRatio>
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
