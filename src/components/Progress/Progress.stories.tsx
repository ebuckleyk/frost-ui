import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Progress } from './Progress';

function ProgressDemo() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-w-[150px]">
      <Progress value={progress} className="w-full" />
    </div>
  );
}
type ComponentType = React.ComponentProps<typeof Progress>;
const meta: Meta<ComponentType> = {
  component: Progress,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: ProgressDemo,
};
