import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { AlignCenter, AlignLeft, AlignRight, Bold, Copy, Download, Italic, Share2, Underline } from 'lucide-react';

import { Button } from '../Button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './ButtonGroup';

function HorizontalDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <Bold />
        Bold
      </Button>
      <Button variant="outline">
        <Italic />
        Italic
      </Button>
      <Button variant="outline">
        <Underline />
        Underline
      </Button>
    </ButtonGroup>
  );
}

function VerticalDemo() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">
        <Copy />
        Copy
      </Button>
      <Button variant="outline">
        <Download />
        Download
      </Button>
      <Button variant="outline">
        <Share2 />
        Share
      </Button>
    </ButtonGroup>
  );
}

function WithSeparatorDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <AlignLeft />
      </Button>
      <Button variant="outline">
        <AlignCenter />
      </Button>
      <Button variant="outline">
        <AlignRight />
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline">
        <Bold />
      </Button>
      <Button variant="outline">
        <Italic />
      </Button>
    </ButtonGroup>
  );
}

function WithTextDemo() {
  return (
    <ButtonGroup>
      <ButtonGroupText>Font:</ButtonGroupText>
      <Button variant="outline">Sans</Button>
      <Button variant="outline">Serif</Button>
      <Button variant="outline">Mono</Button>
    </ButtonGroup>
  );
}

function IconOnlyDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <Bold />
      </Button>
      <Button variant="outline" size="icon">
        <Italic />
      </Button>
      <Button variant="outline" size="icon">
        <Underline />
      </Button>
    </ButtonGroup>
  );
}

function MixedVariantsDemo() {
  return (
    <ButtonGroup>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </ButtonGroup>
  );
}

const meta: Meta<typeof ButtonGroup> = {
  component: ButtonGroup,
  subcomponents: { ButtonGroupSeparator, ButtonGroupText },
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Horizontal: Story = {
  render: HorizontalDemo,
};

export const Vertical: Story = {
  render: VerticalDemo,
};

export const WithSeparator: Story = {
  render: WithSeparatorDemo,
};

export const WithText: Story = {
  render: WithTextDemo,
};

export const IconOnly: Story = {
  render: IconOnlyDemo,
};

export const MixedVariants: Story = {
  render: MixedVariantsDemo,
};
