import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

// https://github.com/shadcn.png
function AvatarDemo({ url }: { url: string | undefined }) {
  return (
    <Avatar>
      <AvatarImage src={url} alt="@ebuckleyk" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
type ComponentType = React.ComponentProps<typeof Avatar> & { imageSrc: string };
const meta: Meta<ComponentType> = {
  component: Avatar,
  subcomponents: { AvatarImage, AvatarFallback },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: ({ imageSrc }) => <AvatarDemo url={imageSrc} />,
  argTypes: {
    imageSrc: {
      control: { type: 'text' },
    },
  },
  args: {
    imageSrc: 'frost_ui.png',
  },
};
