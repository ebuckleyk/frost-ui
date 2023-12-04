import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
// https://github.com/shadcn.png
function AvatarDemo({ url }: { url: string | undefined }) {
  return (
    <Avatar>
      <AvatarImage src={url} alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
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
    imageSrc: 'https://github.com/shadcn.png',
  },
};
