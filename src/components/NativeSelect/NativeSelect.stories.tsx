import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Field, FieldError, FieldLabel } from '../Field';
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from './NativeSelect';

function NativeSelectDemo() {
  return (
    <Field className="w-[240px]">
      <FieldLabel htmlFor="status">Status</FieldLabel>
      <NativeSelect id="status" defaultValue="">
        <NativeSelectOption value="" disabled>
          Select status
        </NativeSelectOption>
        <NativeSelectOption value="todo">Todo</NativeSelectOption>
        <NativeSelectOption value="progress">In Progress</NativeSelectOption>
        <NativeSelectOption value="done">Done</NativeSelectOption>
        <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
      </NativeSelect>
    </Field>
  );
}

function GroupedNativeSelectDemo() {
  return (
    <Field className="w-[280px]">
      <FieldLabel htmlFor="department">Department</FieldLabel>
      <NativeSelect id="department" defaultValue="frontend">
        <NativeSelectOptGroup label="Engineering">
          <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
          <NativeSelectOption value="backend">Backend</NativeSelectOption>
          <NativeSelectOption value="devops">DevOps</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Customer">
          <NativeSelectOption value="sales">Sales Rep</NativeSelectOption>
          <NativeSelectOption value="support">Customer Support</NativeSelectOption>
          <NativeSelectOption value="success">Customer Success</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </Field>
  );
}

function InvalidNativeSelectDemo() {
  return (
    <Field data-invalid className="w-[240px]">
      <FieldLabel htmlFor="invalid-status">Status</FieldLabel>
      <NativeSelect id="invalid-status" aria-invalid defaultValue="">
        <NativeSelectOption value="">Select status</NativeSelectOption>
        <NativeSelectOption value="todo">Todo</NativeSelectOption>
        <NativeSelectOption value="done">Done</NativeSelectOption>
      </NativeSelect>
      <FieldError>Choose a status before continuing.</FieldError>
    </Field>
  );
}

type ComponentType = typeof NativeSelect;

const meta: Meta<ComponentType> = {
  component: NativeSelect,
  subcomponents: { NativeSelectOptGroup, NativeSelectOption },
};

export default meta;

type Story = StoryObj<ComponentType>;

export const Demo: Story = {
  render: NativeSelectDemo,
};

export const Groups: Story = {
  render: GroupedNativeSelectDemo,
};

export const Disabled: Story = {
  render: () => (
    <NativeSelect className="w-[200px]" disabled defaultValue="apple">
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    </NativeSelect>
  ),
};

export const Invalid: Story = {
  render: InvalidNativeSelectDemo,
};
