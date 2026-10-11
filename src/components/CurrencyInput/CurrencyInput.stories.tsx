import * as React from 'react';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '../Button';
import { Label } from '../Label';
import { CurrencyInput, formatCurrencyValue, type CurrencyInputValue } from './CurrencyInput';

const meta: Meta<typeof CurrencyInput> = {
  component: CurrencyInput,
  args: { currency: 'USD', locale: 'en-US', 'aria-label': 'Amount in US dollars' },
  parameters: {
    docs: {
      description: {
        component:
          'Exact decimal-string currency input. Currency is required; locale defaults to en-US. onValueChange separates editableValue, decimalValue (null for empty/incomplete), formattedValue and exceedsPrecision. Excess precision is rejected by default; precisionPolicy="allow" preserves it for caller validation. Paste uses strict locale grouping. Applications own validation and API serialization. See the component README for adapters and exact read-only formatting.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const Empty: Story = {};
export const Zero: Story = { args: { defaultValue: '0' } };
export const Incomplete: Story = { args: { defaultValue: '12.' } };
export const Positive: Story = { args: { defaultValue: '1234.56' } };
export const Negative: Story = { args: { defaultValue: '-1234.56', allowNegative: true } };
export const Disabled: Story = { args: { defaultValue: '1234.56', disabled: true } };
export const ReadOnly: Story = { args: { value: '1234.56', readOnly: true } };
export const Invalid: Story = {
  args: { defaultValue: '12.345', precisionPolicy: 'allow', 'aria-invalid': true, 'aria-describedby': 'amount-error' },
  render: (args) => (
    <>
      <CurrencyInput {...args} />
      <p id="amount-error" className="text-sm text-destructive">
        Use at most two fractional digits.
      </p>
    </>
  ),
};
export const EuroGerman: Story = {
  args: { currency: 'EUR', locale: 'de-DE', defaultValue: '1234.56', 'aria-label': 'Betrag in Euro' },
};
export const EuroFrench: Story = {
  args: { currency: 'EUR', locale: 'fr-FR', defaultValue: '1234.56', 'aria-label': 'Montant en euros' },
};
export const YenZeroDigits: Story = {
  args: { currency: 'JPY', locale: 'ja-JP', defaultValue: '1234', 'aria-label': 'Amount in Japanese yen' },
};
export const DinarThreeDigits: Story = {
  args: { currency: 'KWD', defaultValue: '1234.567', 'aria-label': 'Amount in Kuwaiti dinars' },
};
export const IndianGrouping: Story = {
  args: { currency: 'INR', locale: 'en-IN', defaultValue: '1234567.89', 'aria-label': 'Amount in Indian rupees' },
};
export const PrecisionOverride: Story = { args: { currency: 'JPY', fractionDigits: 2, defaultValue: '1234.56' } };
export const LargeExactValue: Story = { args: { defaultValue: '9007199254740993.12' } };

function ControlledExample() {
  const [value, setValue] = React.useState('');
  const [details, setDetails] = React.useState<CurrencyInputValue>();
  const [rejection, setRejection] = React.useState('');
  return (
    <div className="max-w-sm space-y-3">
      <Label htmlFor="controlled-amount">Amount in euros</Label>
      <CurrencyInput
        currency="EUR"
        locale="de-DE"
        id="controlled-amount"
        value={value}
        onValueChange={(next) => {
          setValue(next.editableValue);
          setDetails(next);
          setRejection('');
        }}
        onInputRejected={(reason) => setRejection(`Input rejected: ${reason}`)}
        aria-describedby="controlled-help"
      />
      <p id="controlled-help" aria-live="polite" className="text-sm text-muted-foreground">
        {rejection || 'Paste German amounts such as 1.234,56.'}
      </p>
      <pre>{JSON.stringify(details, null, 2)}</pre>
      <Button onClick={() => setValue('')}>Clear</Button>
    </div>
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };

function FormExample() {
  const { control, handleSubmit } = useForm({ defaultValues: { amount: '' } });
  const [submitted, setSubmitted] = React.useState('');
  return (
    <form
      className="max-w-sm space-y-3"
      onSubmit={handleSubmit(({ amount }) =>
        setSubmitted(formatCurrencyValue(amount, { currency: 'USD', locale: 'en-US' })),
      )}
    >
      <Label htmlFor="form-amount">Amount in US dollars</Label>
      <Controller
        name="amount"
        control={control}
        rules={{
          validate: (draft) =>
            /^\d+(?:\.\d{1,2})?$/.test(draft) ||
            'Enter a complete nonnegative amount with at most two fractional digits.',
        }}
        render={({ field, fieldState }) => (
          <>
            <CurrencyInput
              currency="USD"
              locale="en-US"
              id="form-amount"
              name={field.name}
              ref={field.ref}
              value={field.value}
              onBlur={field.onBlur}
              onValueChange={(next) => field.onChange(next.editableValue)}
              aria-invalid={!!fieldState.error}
              aria-describedby="form-help"
            />
            <p id="form-help" className="text-sm text-muted-foreground">
              {fieldState.error?.message ||
                'The form stores the editable decimal string; validate before adapting it to your API.'}
            </p>
          </>
        )}
      />
      <Button type="submit">Submit</Button>
      <output aria-live="polite">{submitted}</output>
    </form>
  );
}
export const FormController: Story = { render: () => <FormExample /> };
