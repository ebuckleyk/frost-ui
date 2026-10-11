# CurrencyInput

Install the optional peer dependency `react-number-format` (v5):

```sh
npm install react-number-format
```

```tsx
import { CurrencyInput, formatCurrencyValue } from '@ebuckleyk/frost-ui/components/CurrencyInput';

const [draft, setDraft] = React.useState('');
<CurrencyInput
  currency="EUR"
  locale="de-DE"
  value={draft}
  onValueChange={(next) => setDraft(next.editableValue)}
  aria-label="Betrag in Euro"
/>;
```

`currency` is an explicit uppercase ISO 4217 code. It is never inferred from a label, symbol or locale. `locale` defaults to `en-US` so SSR and clients agree. Separators, currency affixes and grouping come from Intl; Latin digits are used consistently, including for locales whose default numbering system differs. Grouping supports thousands, Indian lakh and four-digit wan patterns. The currency's Intl fractional precision is the default (JPY: 0, USD/EUR: 2, KWD: 3); `fractionDigits` overrides it.

The editable display has currency affixes and locale separators. `value` / `defaultValue` are **ASCII decimal strings**, never localized strings or JavaScript numbers. Clear with `''`. The `onValueChange` payload contains:

| Property | Meaning |
| --- | --- |
| `editableValue` | Raw decimal draft, preserving `''`, `'-'`, `'.'`, `'1.'` and trailing fractional zeros. Use this for controlled state. |
| `decimalValue` | Canonical decimal string, or `null` for empty/sign/decimal-only drafts. `'1.'` yields `'1'`, `'.5'` yields `'0.5'`. Empty and zero remain distinct. |
| `formattedValue` | Current display, e.g. `1.234,50 €`. |
| `exceedsPrecision` | Whether fractional digits exceed the configured precision; independent of business validity. |

The callback reports user edits (including blur normalization), not external prop updates. Do not echo `decimalValue` into the input while editing: that would remove intermediate decimal points. `onChange` is a native display-string event; `onBlur`, `ref`, `id`, `name`, `disabled`, `readOnly`, `glass`, `className`, and accessibility attributes pass through to FrostUI Input. Its semantic styling and focus/invalid treatments apply in all themes. The text input defaults to `inputMode="decimal"`; mobile keyboards vary, especially in offering a minus key. Supply translated labels and validation messages yourself.

## Precision and paste

`precisionPolicy="reject"` is the default. Excess typed digits and pasted precision are rejected without rounding or truncation; excess precision in a supplied value throws. `precisionPolicy="allow"` preserves all digits and reports `exceedsPrecision` so an application can show a validation error. Neither policy changes monetary units. Display padding is avoided during editing.

Pastes must follow the configured locale's grammar. `1.234,56` is valid for `de-DE`; `1,234.56` is rejected there. Misgrouped values like `12.34` in German or `1,23` in US English are rejected. Ungrouped numbers are accepted; valid grouped numbers follow the locale's grouping pattern. For space-grouping locales, space, NBSP and narrow NBSP are accepted. Matching formatted currency affixes are accepted; foreign symbols, mixed separators, exponent notation and arbitrary text are rejected. Separator meaning is always the configured locale's meaning; no alternate locale is guessed.

`onInputRejected` reports `format`, `precision`, `negative` or `validation`; use it to provide translated feedback in an `aria-live` region. Negatives require `allowNegative`. `isAllowed(details)` can block an edit with caller-owned constraints. Keep empty/incomplete drafts editable when checking limits. Applications own min/max, required fields, precision errors and all business validation; use a decimal library or exact string comparison for bounds, never Number conversion for large monetary values.

## Forms and API adapters

For React Hook Form, pass `field.value`, `field.ref`, `field.name`, `field.onBlur`, and adapt `onValueChange` to `field.onChange(next.editableValue)`. Validate completeness and business constraints on submission. Do not spread `field.onChange` as the canonical amount handler. The FormController story demonstrates this pattern with translated-label support via ordinary Label/aria attributes.

`name` makes a native HTML form submit the **formatted display**, not a canonical amount. Use a form controller or an explicitly named hidden field if your server expects decimal strings.

After validation, submit a complete canonical decimal string according to your API contract:

```ts
// Keep this as JSON text, never parseFloat(amount).
const payload = { currency: 'USD', amount: decimalValue };
```

For integer minor units, validate fractional precision, split the decimal string, pad the fraction to the configured scale, and concatenate the digits; serialize the resulting signed integer string (or use BigInt internally). For USD, `'12.30'` becomes `'1230'`; JPY `'12'` becomes `'12'`; KWD `'12.300'` becomes `'12300'`. Never multiply a floating-point amount by 100 or assume all currencies use two fractional digits.

## Exact read-only formatting and explicit rounding

Share the same currency/locale/precision configuration for submitted amounts and read-only displays:

```ts
const config = { currency: 'EUR', locale: 'de-DE' };
formatCurrencyValue('1234.5', config); // '1.234,50 €'
formatCurrencyValue(null, config); // '' (zero is still formatted as zero)
```

The helper pads fractional zeros and groups decimal **strings** without converting the amount to a binary float. It requires a complete decimal string and throws on excess precision unless an explicit `rounding: 'half-up' | 'truncate'` is supplied. Half-up rounds ties away from zero; truncate rounds toward zero. For a deliberate edit transformation, call `roundCurrencyValue(value, fractionDigits, mode)` and assign its returned string to controlled state. Both helpers handle large values exactly and never change units. Rounding is an application decision and is never performed automatically by CurrencyInput.

React Number Format's supported `customInput`, `getInputRef`, `isAllowed` and `onValueChange` APIs provide editing/caret behavior. A decimal scale is intentionally not passed to NumericFormat because its normalization could silently discard precision before validation.
