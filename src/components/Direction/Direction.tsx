import * as React from 'react';
import { DirectionProvider as RadixDirectionProvider, useDirection } from '@radix-ui/react-direction';

type DirectionProviderProps = React.ComponentProps<typeof RadixDirectionProvider> & {
  direction?: 'ltr' | 'rtl';
};

function DirectionProvider({ direction, dir, ...props }: DirectionProviderProps) {
  return <RadixDirectionProvider dir={dir ?? direction} {...props} />;
}

export { DirectionProvider, useDirection };
