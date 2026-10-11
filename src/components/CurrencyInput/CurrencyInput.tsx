'use client';

import * as React from 'react';
import { NumericFormat } from 'react-number-format';

import { Input, type InputProps } from '../Input/Input';
import {
  currencyFormatOptions,
  currencyInputValue,
  parseCurrencyPaste,
  type CurrencyInputValue,
  type CurrencyOptions,
} from './currency';

export * from './currency';

export type CurrencyInputProps = Omit<InputProps, 'value' | 'defaultValue' | 'type' | 'min' | 'max'> &
  CurrencyOptions & {
    value?: string;
    defaultValue?: string;
    allowNegative?: boolean;
    /** reject (default) blocks excess digits; allow preserves them and reports exceedsPrecision. */
    precisionPolicy?: 'reject' | 'allow';
    onValueChange?: (value: CurrencyInputValue) => void;
    /** Caller-owned business constraints, operating on exact strings. */
    isAllowed?: (value: CurrencyInputValue) => boolean;
    onInputRejected?: (reason: 'format' | 'precision' | 'negative' | 'validation') => void;
  };

export function CurrencyInput({
  currency,
  locale,
  fractionDigits,
  value,
  defaultValue,
  allowNegative = false,
  precisionPolicy = 'reject',
  onValueChange,
  isAllowed,
  onInputRejected,
  onPaste,
  ref,
  inputMode = 'decimal',
  ...props
}: CurrencyInputProps) {
  const config = React.useMemo(
    () => currencyFormatOptions({ currency, locale, fractionDigits }),
    [currency, locale, fractionDigits],
  );
  const { fractionDigits: scale, ...formatProps } = config;
  const suppliedValue = value ?? defaultValue;
  if (suppliedValue !== undefined) {
    if (!/^-?(?:\d*(?:\.\d*)?)$/.test(suppliedValue))
      throw new RangeError('CurrencyInput value must be an ASCII decimal draft.');
    if (!allowNegative && suppliedValue.startsWith('-')) throw new RangeError('Negative value requires allowNegative.');
    if (precisionPolicy === 'reject' && currencyInputValue(suppliedValue, '', config.fractionDigits).exceedsPrecision)
      throw new RangeError('Excess precision requires precisionPolicy="allow" or explicit rounding.');
  }
  function accepts(draft: string, formattedValue: string) {
    const details = currencyInputValue(draft, formattedValue, config.fractionDigits);
    const reason =
      !allowNegative && draft.startsWith('-')
        ? 'negative'
        : precisionPolicy === 'reject' && details.exceedsPrecision
          ? 'precision'
          : isAllowed && !isAllowed(details)
            ? 'validation'
            : null;
    if (reason) onInputRejected?.(reason);
    return !reason;
  }
  return (
    <NumericFormat<InputProps>
      {...props}
      {...formatProps}
      customInput={Input}
      getInputRef={ref}
      type="text"
      inputMode={inputMode}
      value={value}
      defaultValue={defaultValue}
      valueIsNumericString
      allowNegative={allowNegative}
      allowLeadingZeros
      allowedDecimalSeparators={[config.decimalSeparator]}
      isAllowed={({ value: draft, formattedValue }) => accepts(draft, formattedValue)}
      onValueChange={({ value: draft, formattedValue }, source) => {
        if (source.source === 'event') onValueChange?.(currencyInputValue(draft, formattedValue, scale));
      }}
      onPaste={(event) => {
        onPaste?.(event);
        if (event.defaultPrevented || props.disabled || props.readOnly) return;
        const draft = parseCurrencyPaste(event.clipboardData.getData('text'), { currency, locale, fractionDigits });
        if (draft === null) {
          event.preventDefault();
          onInputRejected?.('format');
        } else if (!allowNegative && draft.startsWith('-')) {
          // NumericFormat strips disallowed minus signs, so reject them before insertion.
          event.preventDefault();
          onInputRejected?.('negative');
        }
        // NumericFormat's isAllowed checks precision and business constraints on the resulting edit.
      }}
    />
  );
}
