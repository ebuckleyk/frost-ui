import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
import { Card } from '../Card';
// https://github.com/shadcn.png
function AvatarDemo({ url }: { url: string | undefined }) {
  return (
    <Card className="flex items-center space-x-2 p-5">
      <Avatar>
        <AvatarImage src={url} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </Card>
  );
}
type ComponentType = React.ComponentProps<typeof Avatar> & { imageSrc: string };
const meta: Meta<ComponentType> = {
  component: Avatar,
  render: ({ imageSrc }) => <AvatarDemo url={imageSrc} />,
  argTypes: {
    imageSrc: {
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  args: {
    imageSrc: 'frost_ui.png',
  },
};
