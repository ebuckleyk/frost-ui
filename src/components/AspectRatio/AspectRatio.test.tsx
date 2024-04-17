import * as React from 'react';
import { render } from '@testing-library/react';

import { AspectRatio } from './AspectRatio';

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
const Component = () => {
  return (
    <AspectRatio style={style} ratio={16}>
      <img
        style={{ ...style.image }}
        src="https://wowslider.com/sliders/demo-31/data1/images/autumn1072827.jpg"
        alt="thumbnail"
      />
    </AspectRatio>
  );
};

describe('AspectRatio', () => {
  it('should render AspectRatio component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
