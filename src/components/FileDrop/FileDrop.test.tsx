import * as React from 'react';
import { render } from '@testing-library/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card';
import { FileDrop, FileDropArea, FileDropAreaText, FileDropFileArea } from './FileDrop';

function Component() {
  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Drag & Drop or Click Browse to Upload File</CardDescription>
      </CardHeader>
      <CardContent>
        <FileDrop>
          <FileDropArea>
            <FileDropAreaText className="cursor-pointer text-slate-700/30 underline">Browse</FileDropAreaText>
          </FileDropArea>
          <FileDropFileArea />
        </FileDrop>
      </CardContent>
    </Card>
  );
}

describe('FileDrop', () => {
  it('should render FileDrop component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
