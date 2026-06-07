import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Avatar, AvatarFallback } from '../Avatar';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../Card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../Chart';
import { Input } from '../Input';
import { Separator } from '../Separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '../Sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, active: true },
  { title: 'Accounts', icon: Users },
  { title: 'Payments', icon: CreditCard },
  { title: 'Reports', icon: FileText },
  { title: 'Performance', icon: BarChart3 },
];

const secondaryItems = [
  { title: 'Home', icon: Home },
  { title: 'Activity', icon: Activity },
  { title: 'Settings', icon: Settings },
];

const chartData = [
  { month: 'Jan', recurring: 186, pipeline: 80 },
  { month: 'Feb', recurring: 224, pipeline: 118 },
  { month: 'Mar', recurring: 252, pipeline: 142 },
  { month: 'Apr', recurring: 278, pipeline: 168 },
  { month: 'May', recurring: 302, pipeline: 195 },
  { month: 'Jun', recurring: 348, pipeline: 226 },
  { month: 'Jul', recurring: 376, pipeline: 244 },
  { month: 'Aug', recurring: 402, pipeline: 261 },
  { month: 'Sep', recurring: 441, pipeline: 288 },
  { month: 'Oct', recurring: 468, pipeline: 312 },
  { month: 'Nov', recurring: 496, pipeline: 336 },
  { month: 'Dec', recurring: 528, pipeline: 372 },
];

const chartConfig = {
  recurring: {
    label: 'Recurring',
    color: 'var(--primary)',
  },
  pipeline: {
    label: 'Pipeline',
    color: 'var(--accent)',
  },
} satisfies ChartConfig;

const metrics = [
  {
    title: 'Total Revenue',
    value: '$128,430',
    delta: '+12.5%',
    trend: 'up',
    detail: 'Trending up this month',
    tone: 'primary',
  },
  {
    title: 'Subscriptions',
    value: '2,847',
    delta: '+8.2%',
    trend: 'up',
    detail: '312 net-new accounts',
    tone: 'accent',
  },
  {
    title: 'Churn Risk',
    value: '4.8%',
    delta: '-1.1%',
    trend: 'down',
    detail: 'Improved retention health',
    tone: 'muted',
  },
  {
    title: 'Open Invoices',
    value: '$18,240',
    delta: '+3.4%',
    trend: 'up',
    detail: '14 invoices need review',
    tone: 'primary',
  },
];

const transactions = [
  ['Arden Systems', 'Enterprise plan', '$12,400', 'Paid'],
  ['Northline Labs', 'Seat expansion', '$8,950', 'Pending'],
  ['Cinder Health', 'Annual renewal', '$21,000', 'Paid'],
  ['Metro Works', 'Implementation', '$6,200', 'Review'],
  ['Fieldstone Co.', 'Usage overage', '$3,840', 'Paid'],
];

const activity = [
  ['Revenue operations', 'Closed billing exception queue', '2m ago'],
  ['Customer success', 'Flagged 3 accounts for outreach', '18m ago'],
  ['Finance', 'Approved September payout batch', '1h ago'],
];

function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <TrendingUp className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm/tight">
                <span className="truncate font-semibold">Frost Finance</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Revenue console</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-3">
              <Avatar className="size-8 border border-sidebar-border">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">EB</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm/tight">
                <span className="truncate font-semibold">Emmanuel Buckley</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function SiteHeader() {
  return (
    <header
      className="
        glass-card sticky top-3 z-20 mx-3 mt-3 flex h-14 shrink-0
        items-center gap-3 rounded-xl px-4
      "
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">Revenue Dashboard</p>
        <p className="truncate text-xs text-muted-foreground">Performance summary for Q4</p>
      </div>
      <div className="hidden w-full max-w-xs items-center md:flex">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-8 pl-8" placeholder="Search accounts..." />
        </div>
      </div>
      <Button variant="outline" size="sm" className="hidden h-8 gap-2 md:inline-flex">
        <CalendarDays className="size-4" />
        Q4 2026
      </Button>
      <Button variant="outline" size="icon" className="size-8">
        <Bell />
        <span className="sr-only">Notifications</span>
      </Button>
    </header>
  );
}

function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
        const iconClassName =
          metric.tone === 'accent'
            ? 'bg-accent/60 text-accent-foreground'
            : metric.tone === 'muted'
              ? 'bg-secondary/60 text-secondary-foreground'
              : 'bg-primary text-primary-foreground';

        return (
          <Card key={metric.title} className="gap-4 overflow-hidden py-5">
            <CardHeader className="px-5">
              <div className="flex items-center gap-3">
                <div className={`flex size-9 items-center justify-center rounded-md ${iconClassName}`}>
                  <TrendIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <CardDescription>{metric.title}</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">{metric.value}</CardTitle>
                </div>
              </div>
              <CardAction>
                <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'} className="gap-1">
                  {metric.delta}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="px-5">
              <p className="text-sm text-muted-foreground">{metric.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function RevenueChart() {
  return (
    <Card className="gap-4 overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>Revenue trajectory</CardTitle>
          <CardDescription>Recurring revenue and active pipeline across the year.</CardDescription>
        </div>
        <CardAction>
          <Button variant="outline" size="sm" className="h-8">
            Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="pipeline"
              type="natural"
              fill="var(--color-pipeline)"
              fillOpacity={0.16}
              stroke="var(--color-pipeline)"
              strokeWidth={2}
            />
            <Area
              dataKey="recurring"
              type="natural"
              fill="var(--color-recurring)"
              fillOpacity={0.22}
              stroke="var(--color-recurring)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function TransactionTable() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>High-value customer activity that changed this week.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(([account, type, amount, status]) => (
              <TableRow key={account}>
                <TableCell className="font-medium">{account}</TableCell>
                <TableCell className="text-muted-foreground">{type}</TableCell>
                <TableCell>
                  <Badge variant={status === 'Paid' ? 'default' : 'secondary'}>{status}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ActivityPanel() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Team activity</CardTitle>
        <CardDescription>Operational updates from the last hour.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activity.map(([team, update, time]) => (
          <div key={update} className="flex items-start gap-3">
            <div className="mt-1 size-2 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{team}</p>
              <p className="text-sm text-muted-foreground">{update}</p>
            </div>
            <span className="text-xs whitespace-nowrap text-muted-foreground">{time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DashboardHero() {
  return (
    <Card className="overflow-hidden py-0">
      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary">Live summary</Badge>
            <span className="text-xs text-muted-foreground">Updated 4 minutes ago</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Revenue health is ahead of forecast.</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Expansion revenue and renewals are outpacing late-stage risk. The accounts below need finance review before
            the next payout batch closes.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              Add account
            </Button>
            <Button variant="outline" size="sm">
              View forecast
            </Button>
          </div>
        </div>
        <div className="border-t bg-primary/8 p-6 lg:border-t-0 lg:border-l">
          <p className="text-sm font-medium">Forecast confidence</p>
          <p className="mt-3 text-4xl font-semibold tabular-nums">92%</p>
          <p className="mt-2 text-sm text-muted-foreground">Based on closed revenue, renewals, and Q4 pipeline.</p>
        </div>
      </div>
    </Card>
  );
}

function DashboardExample() {
  return (
    <SidebarProvider
      className="
        min-h-[900px] text-foreground
        has-data-[variant=inset]:bg-transparent
      "
      style={
        {
          '--sidebar-width': '18rem',
          '--header-height': '3.5rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <SiteHeader />
        <div className="flex flex-1 justify-center px-3 py-4 md:py-6">
          <div className="flex w-full max-w-[1500px] flex-col gap-4 md:gap-6">
            <DashboardHero />
            <SectionCards />
            <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
              <RevenueChart />
              <ActivityPanel />
            </div>
            <TransactionTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

type ComponentType = typeof DashboardExample;

const meta: Meta<ComponentType> = {
  title: 'Examples/Dashboard',
  component: DashboardExample,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'frost-ambient',
    },
  },
};

export default meta;

type Story = StoryObj<ComponentType>;

export const Dashboard01: Story = {
  render: DashboardExample,
};
