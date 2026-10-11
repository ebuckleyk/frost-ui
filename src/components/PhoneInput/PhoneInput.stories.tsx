import * as React from 'react';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '../Button';
import { Label } from '../Label';
import { normalizePhoneInput, PhoneInput, type PhoneInputCountry, type PhoneInputValue } from './PhoneInput';

const meta: Meta<typeof PhoneInput> = {
  component: PhoneInput,
  args: { 'aria-label': 'Phone number' },
  parameters: {
    docs: {
      description: {
        component:
          'Country-aware telephone draft with as-you-type formatting. onValueChange returns draft, country, E.164 candidate and separate extension. A candidate can be incomplete or invalid; applications own validation. Controlled value is the draft string; clear with an empty string. No default country is assumed.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Empty: Story = {};
export const Incomplete: Story = { args: { defaultCountry: 'GB', defaultValue: '020' } };
export const Valid: Story = { args: { defaultCountry: 'GB', defaultValue: '02079460018' } };
export const Invalid: Story = {
  args: { defaultCountry: 'US', defaultValue: '1111111111', 'aria-invalid': true, 'aria-describedby': 'phone-error' },
  render: (args) => (
    <>
      <PhoneInput {...args} />
      <p id="phone-error" className="text-sm text-destructive">
        This number does not meet this application’s acceptance rules.
      </p>
    </>
  ),
};
export const Disabled: Story = { args: { disabled: true, defaultCountry: 'US', defaultValue: '2133734253' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: '+14165550123' } };
export const CountrySelection: Story = {
  args: {
    defaultCountry: 'FR',
    countries: ['FR', 'GB', 'US', 'CA'],
    labels: { country: 'Pays / indicatif', FR: 'France', GB: 'Royaume-Uni', US: 'États-Unis', CA: 'Canada' },
  },
};
export const Extension: Story = { args: { defaultCountry: 'US', defaultValue: '2133734253 ext. 42' } };
export const CustomScrollbar: Story = {
  args: {
    defaultCountry: 'US',
    countryContentClassName: 'border border-primary/30',
    countryScrollbarClassName: 'w-3',
    countryScrollbarThumbClassName: 'bg-primary/60 hover:bg-primary',
  },
};

function ControlledExample() {
  const [value, setValue] = React.useState('');
  const [details, setDetails] = React.useState<PhoneInputValue>();
  return (
    <div className="max-w-lg space-y-3">
      <Label htmlFor="controlled-phone">Phone number</Label>
      <PhoneInput
        id="controlled-phone"
        value={value}
        defaultCountry="GB"
        onValueChange={(next) => {
          setValue(next.draft);
          setDetails(next);
        }}
      />
      <Button
        onClick={() => {
          setValue('');
          setDetails(undefined);
        }}
      >
        Clear
      </Button>
      <pre className="text-sm">{JSON.stringify(details ?? { draft: value }, null, 2)}</pre>
    </div>
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };

function FormExample() {
  const { control, handleSubmit } = useForm({ defaultValues: { phone: '' } });
  const [submitted, setSubmitted] = React.useState('');
  const [country, setCountry] = React.useState<PhoneInputCountry | undefined>('GB');
  return (
    <form className="max-w-lg space-y-3" onSubmit={handleSubmit((data) => setSubmitted(data.phone))}>
      <Label htmlFor="form-phone">Phone number</Label>
      <Controller
        control={control}
        name="phone"
        rules={{
          validate: (draft) => {
            // Example policy: possible-length subscriber number, with no extension.
            const details = normalizePhoneInput(draft, country);
            return (
              (!details.unsupported &&
                details.extension === undefined &&
                !!details.e164 &&
                isPossiblePhoneNumber(details.e164)) ||
              'Enter a possible UK or international number without an extension.'
            );
          },
        }}
        render={({ field, fieldState }) => (
          <>
            <PhoneInput
              {...field}
              id="form-phone"
              defaultCountry="GB"
              onChange={undefined}
              onValueChange={(next) => {
                setCountry(next.country);
                field.onChange(next.draft);
              }}
              aria-invalid={!!fieldState.error}
              aria-describedby="form-phone-help"
            />
            <p id="form-phone-help" className="text-sm text-muted-foreground">
              {fieldState.error?.message ?? 'This example checks length, not reachability.'}
            </p>
          </>
        )}
      />
      <Button type="submit">Submit</Button>
      <output>{submitted}</output>
    </form>
  );
}

export const FormController: Story = { render: () => <FormExample /> };
