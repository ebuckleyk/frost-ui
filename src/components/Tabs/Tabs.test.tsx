import * as React from 'react';
import { render } from '@testing-library/react';

import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../Card';
import { Input } from '../Input';
import { Label } from '../Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

function Component() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('should render Tabs component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });

  it('should render line variant classes without leaking the variant prop', () => {
    const result = render(
      <Tabs defaultValue="account">
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const tabList = result.getByRole('tablist');
    const accountTab = result.getByRole('tab', { name: 'Account' });

    expect(tabList).toHaveAttribute('data-variant', 'line');
    expect(tabList).not.toHaveAttribute('variant');
    expect(tabList).toHaveClass('group/tabs-list', 'bg-transparent', 'p-0', 'border-b');
    expect(tabList).not.toHaveClass('glass-control-muted', 'rounded-lg', 'p-[3px]');

    expect(accountTab).not.toHaveAttribute('data-variant');
    expect(accountTab).toHaveClass(
      'group-data-[variant=line]/tabs-list:bg-transparent',
      'group-data-[variant=line]/tabs-list:border-b-2',
      'group-data-[variant=line]/tabs-list:data-[state=active]:border-b-primary',
      'group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent',
      'group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none',
    );
  });
});
