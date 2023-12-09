import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card';
import { FileDrop, FileDropArea, FileDropAreaText } from './FileDrop';

function FileDropDemo() {
  return (
    <Card className="w-[350px] p-5">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Drag & Drop or Click Browse to Upload File</CardDescription>
      </CardHeader>
      <CardContent>
        <FileDrop>
          <FileDropArea />
          <FileDropAreaText className="text-slate-700/30">Browse</FileDropAreaText>
        </FileDrop>
      </CardContent>
    </Card>
  );
}

function AcceptFileTypeFileDropDemo() {
  return (
    <Card className="w-[350px] p-5">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Drag & Drop or Click Browse to Upload File</CardDescription>
      </CardHeader>
      <CardContent>
        <FileDrop
          accept={{
            'image/*': ['.png'],
          }}
        >
          <FileDropArea>
            <FileDropAreaText className="text-slate-700/30">Only *.html and *.htm files accepted.</FileDropAreaText>
          </FileDropArea>
          Testing
        </FileDrop>
      </CardContent>
    </Card>
  );
}
type ComponentType = React.ComponentProps<typeof FileDrop>;
const meta: Meta<ComponentType> = {
  component: FileDrop,
  render: FileDropDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};

export const AcceptFileTypesDemo: Story = {
  render: AcceptFileTypeFileDropDemo,
};
