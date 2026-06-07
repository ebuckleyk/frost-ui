import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card';
import { Input } from '../Input';
import { Label } from '../Label';
import { DirectionProvider, useDirection } from './Direction';

function DirectionValue() {
  const direction = useDirection();
  return <p className="text-sm text-muted-foreground">Current direction: {direction}</p>;
}

function DirectionDemo() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="w-[360px]">
        <Card>
          <CardHeader>
            <CardTitle>تسجيل الدخول</CardTitle>
            <CardDescription>أدخل بريدك الإلكتروني للمتابعة.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DirectionValue />
            <div className="space-y-2">
              <Label htmlFor="email-rtl">البريد الإلكتروني</Label>
              <Input id="email-rtl" type="email" placeholder="name@example.com" />
            </div>
            <Button className="w-full">متابعة</Button>
          </CardContent>
        </Card>
      </div>
    </DirectionProvider>
  );
}

type ComponentType = typeof DirectionProvider;

const meta: Meta<ComponentType> = {
  component: DirectionProvider,
};

export default meta;

type Story = StoryObj<ComponentType>;

export const RTL: Story = {
  render: DirectionDemo,
};
