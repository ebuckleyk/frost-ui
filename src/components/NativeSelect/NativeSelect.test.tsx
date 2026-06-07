import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from './NativeSelect';

describe('NativeSelect', () => {
  it('should render NativeSelect component to match snapshot', () => {
    const result = render(
      <NativeSelect defaultValue="frontend">
        <NativeSelectOptGroup label="Engineering">
          <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
          <NativeSelectOption value="backend">Backend</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>,
    );
    expect(result).toMatchSnapshot();
  });
});
