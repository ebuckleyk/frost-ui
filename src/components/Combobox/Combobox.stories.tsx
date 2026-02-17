import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { GlobeIcon } from 'lucide-react';

import { Button } from '../Button';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from '../Combobox';
import { InputGroupAddon } from '../InputGroup';

const frameworks1 = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

type Framework = {
  label: string;
  value: string;
};

const frameworks: Framework[] = [
  { label: 'Next.js', value: 'next' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Nuxt', value: 'nuxt' },
];

const timezones = [
  {
    value: 'Americas',
    items: [
      '(GMT-5) New York',
      '(GMT-8) Los Angeles',
      '(GMT-6) Chicago',
      '(GMT-5) Toronto',
      '(GMT-8) Vancouver',
      '(GMT-3) São Paulo',
    ],
  },
  {
    value: 'Europe',
    items: ['(GMT+0) London', '(GMT+1) Paris', '(GMT+1) Berlin', '(GMT+1) Rome', '(GMT+1) Madrid', '(GMT+1) Amsterdam'],
  },
  {
    value: 'Asia/Pacific',
    items: [
      '(GMT+9) Tokyo',
      '(GMT+8) Shanghai',
      '(GMT+8) Singapore',
      '(GMT+4) Dubai',
      '(GMT+11) Sydney',
      '(GMT+9) Seoul',
    ],
  },
] as const;

function ComboboxDemo() {
  return (
    <Combobox items={frameworks1}>
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function ExampleComboboxCustomItems() {
  return (
    <Combobox<Framework>
      items={frameworks}
      itemToStringLabel={(framework) => framework.label}
      itemToStringValue={(framework) => framework.value}
    >
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(framework) => (
            <ComboboxItem key={framework.value} value={framework}>
              {framework.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function ExampleComboboxMultiple() {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <Combobox items={frameworks1} multiple value={value} onValueChange={setValue}>
      <ComboboxChips>
        <ComboboxValue>
          {value.map((item) => (
            <ComboboxChip key={item}>{item}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Add framework" />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export function ComboboxWithClear() {
  return (
    <Combobox items={frameworks} defaultValue={frameworks[0]}>
      <ComboboxInput placeholder="Select a framework" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function ExampleComboboxWithGroupsAndSeparator() {
  return (
    <Combobox items={timezones}>
      <ComboboxInput placeholder="Select a timezone" />
      <ComboboxContent>
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList>
          {(group, index) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
              {index < timezones.length - 1 && <ComboboxSeparator />}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

const countries = [
  { code: '', value: '', continent: '', label: 'Select country' },
  {
    code: 'ar',
    value: 'argentina',
    label: 'Argentina',
    continent: 'South America',
  },
  { code: 'au', value: 'australia', label: 'Australia', continent: 'Oceania' },
  { code: 'br', value: 'brazil', label: 'Brazil', continent: 'South America' },
  { code: 'ca', value: 'canada', label: 'Canada', continent: 'North America' },
  { code: 'cn', value: 'china', label: 'China', continent: 'Asia' },
  {
    code: 'co',
    value: 'colombia',
    label: 'Colombia',
    continent: 'South America',
  },
  { code: 'eg', value: 'egypt', label: 'Egypt', continent: 'Africa' },
  { code: 'fr', value: 'france', label: 'France', continent: 'Europe' },
  { code: 'de', value: 'germany', label: 'Germany', continent: 'Europe' },
  { code: 'it', value: 'italy', label: 'Italy', continent: 'Europe' },
  { code: 'jp', value: 'japan', label: 'Japan', continent: 'Asia' },
  { code: 'ke', value: 'kenya', label: 'Kenya', continent: 'Africa' },
  { code: 'mx', value: 'mexico', label: 'Mexico', continent: 'North America' },
  {
    code: 'nz',
    value: 'new-zealand',
    label: 'New Zealand',
    continent: 'Oceania',
  },
  { code: 'ng', value: 'nigeria', label: 'Nigeria', continent: 'Africa' },
  {
    code: 'za',
    value: 'south-africa',
    label: 'South Africa',
    continent: 'Africa',
  },
  { code: 'kr', value: 'south-korea', label: 'South Korea', continent: 'Asia' },
  {
    code: 'gb',
    value: 'united-kingdom',
    label: 'United Kingdom',
    continent: 'Europe',
  },
  {
    code: 'us',
    value: 'united-states',
    label: 'United States',
    continent: 'North America',
  },
];

function ExampleComboboxPopup() {
  return (
    <>
      <Combobox items={countries} defaultValue={countries[0]}>
        <ComboboxTrigger
          render={
            <Button variant="outline" className="w-64 justify-between font-normal">
              <ComboboxValue />
            </Button>
          }
        />
        <ComboboxContent>
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.code} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  );
}

function ExampleComboxboxInputGroup() {
  return (
    <Combobox items={timezones}>
      <ComboboxInput placeholder="Select a timezone">
        <InputGroupAddon>
          <GlobeIcon />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent alignOffset={-28} className="w-60">
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList>
          {(group) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

type ComponentType = React.ComponentProps<typeof ComboboxDemo>;
const meta: Meta<ComponentType> = {
  component: ComboboxDemo,
  render: ComboboxDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};

export const ComboboxCustomItems: Story = {
  render: ExampleComboboxCustomItems,
};

export const ComboboxMultiple: Story = {
  render: ExampleComboboxMultiple,
};

export const ComboboxWithClearButton: Story = {
  render: ComboboxWithClear,
};

export const ComboboxWithGroupsAndSeparator: Story = {
  render: ExampleComboboxWithGroupsAndSeparator,
};

export const ComboboxPopup: Story = {
  render: ExampleComboboxPopup,
};

export const ComboboxInputWithAddon: Story = {
  render: ExampleComboxboxInputGroup,
};
