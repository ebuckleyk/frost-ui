'use client';

import * as React from 'react';
import { AsYouType, getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';

import { cn } from '@/lib/utils';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import { type InputProps } from '../Input';
import { InputGroup, InputGroupInput } from '../InputGroup';
import { ScrollArea } from '../ScrollArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select';

export type PhoneInputValue = {
  /** Editable display, including incomplete numbers and extension text. */
  draft: string;
  country?: CountryCode;
  /** Candidate only: may be incomplete or invalid. Excludes the extension. */
  e164?: string;
  extension?: string;
  unsupported: boolean;
};

export type PhoneInputProps = Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'type'> & {
  value?: string;
  defaultValue?: string;
  defaultCountry?: CountryCode;
  onValueChange?: (value: PhoneInputValue) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onCountryChange?: (country: CountryCode | undefined) => void;
  /** Strict picker choices. Omit for all countries and International; an empty list permits no selection. Does not validate input. */
  countries?: readonly CountryCode[];
  labels?: Partial<Record<CountryCode | 'country' | 'international' | 'countryPlaceholder', string>>;
  inputClassName?: string;
  countryTriggerClassName?: string;
  countryContentClassName?: string;
  countryScrollbarClassName?: string;
  countryScrollbarThumbClassName?: string;
};

const allCountries = getCountries();

/** No extraction from arbitrary text: unsupported input stays visible. */
export function normalizePhoneInput(draft: string, country?: CountryCode): PhoneInputValue {
  const extensionMatch = /\s*(?:;ext=|ext\.?\s*|x\s*|#\s*)(.*)$/i.exec(draft);
  const base = extensionMatch ? draft.slice(0, extensionMatch.index) : draft;
  const extension = extensionMatch?.[1];
  const unsupported = !/^\s*\+?[\d\s().-]*$/.test(base) || (extension !== undefined && !/^\d*$/.test(extension));
  if (unsupported) return { draft, country, extension, unsupported: true };
  const formatter = new AsYouType(base.trimStart().startsWith('+') ? undefined : country);
  const formatted = formatter.input(base);
  const candidate = formatter.getNumber()?.number;
  return {
    draft: formatted + (extensionMatch ? extensionMatch[0] : ''),
    country: formatter.isInternational() ? formatter.getCountry() : country,
    e164: candidate && /^\+[1-9]\d{1,14}$/.test(candidate) ? candidate : undefined,
    extension,
    unsupported: false,
  };
}

function caretPosition(raw: string, formatted: string, position: number): number {
  const extensionMatch = /\s*(?:;ext=|ext\.?\s*|x\s*|#\s*)(.*)$/i.exec(raw);
  if (extensionMatch) {
    if (position > extensionMatch.index) return position + formatted.length - raw.length;
    raw = raw.slice(0, extensionMatch.index);
    formatted = formatted.slice(0, formatted.length - extensionMatch[0].length);
  }
  if (position === raw.length) return formatted.length;
  const count = raw.slice(0, position).replace(/[^\d+]/g, '').length;
  if (!count) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/[\d+]/.test(formatted[i]) && ++seen === count) return i + 1;
  }
  return formatted.length;
}

export function PhoneInput({
  value,
  defaultValue = '',
  defaultCountry,
  onValueChange,
  onChange,
  onCountryChange,
  countries,
  labels,
  className,
  inputClassName,
  countryTriggerClassName,
  countryContentClassName,
  countryScrollbarClassName,
  countryScrollbarThumbClassName,
  disabled,
  readOnly,
  glass = true,
  ref,
  ...props
}: PhoneInputProps) {
  const [uncontrolledDraft, setDraft] = React.useState(defaultValue);
  const [selectedCountry, setCountry] = React.useState(defaultCountry);
  const draft = value === undefined ? uncontrolledDraft : value;
  const restricted = countries !== undefined;
  const isPermitted = (country?: CountryCode) => country !== undefined && (!restricted || countries.includes(country));
  const shouldPreserveDraft = (raw: string, country?: CountryCode) =>
    restricted && raw.trimStart().startsWith('+') && !isPermitted(country);

  function normalizeDraft(raw: string, country?: CountryCode): PhoneInputValue {
    const next = normalizePhoneInput(raw, isPermitted(country) ? country : undefined);
    // Keep excluded/unknown international drafts intact for application validation.
    // Retain the actual detected country in the payload, separate from the picker.
    if (shouldPreserveDraft(raw, next.country)) {
      return { ...next, draft: raw };
    }
    return next;
  }

  const state = normalizeDraft(draft, selectedCountry);
  const pickerCountry = isPermitted(state.country) ? state.country : undefined;
  const countryOptions = Array.from(new Set(countries ?? allCountries));
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const pendingCaret = React.useRef<{ draft: string; position: number } | null>(null);

  useIsomorphicLayoutEffect(() => {
    const pending = pendingCaret.current;
    if (pending && pending.draft === state.draft) {
      inputRef.current?.setSelectionRange(pending.position, pending.position);
    }
    pendingCaret.current = null;
  });

  function publish(next: PhoneInputValue) {
    if (value === undefined) setDraft(next.draft);
    setCountry(next.country);
    if (next.country !== state.country) onCountryChange?.(next.country);
    onValueChange?.(next);
  }

  return (
    <InputGroup
      data-slot="phone-input"
      glass={glass}
      className={cn(
        'h-9 rounded-md',
        readOnly && !disabled && 'has-disabled:bg-transparent has-disabled:opacity-100 dark:has-disabled:bg-input/30',
        className,
      )}
    >
      <Select
        value={pickerCountry ?? (restricted ? '' : 'international')}
        disabled={disabled || readOnly}
        onValueChange={(selection) => {
          const country = (selection === 'international' ? undefined : selection) as CountryCode | undefined;
          let nextDraft = draft;
          if (
            country &&
            draft.trimStart().startsWith('+') &&
            !state.unsupported &&
            (!restricted || isPermitted(state.country))
          ) {
            const formatter = new AsYouType();
            formatter.input(draft.split(/\s*(?:;ext=|ext\.?\s*|x\s*|#\s*)/i)[0]);
            const national = formatter.getNumber()?.formatNational() ?? formatter.getNationalNumber();
            // Unknown or incomplete calling codes have no national digits to convert.
            if (national) {
              const suffix = /\s*(?:;ext=|ext\.?\s*|x\s*|#\s*)(.*)$/i.exec(draft)?.[0] ?? '';
              nextDraft = national + suffix;
            }
          }
          publish(normalizeDraft(nextDraft, country));
        }}
      >
        <SelectTrigger
          glass={false}
          data-slot="input-group-control"
          className={cn(
            'max-w-40 shrink-0 rounded-none rounded-l-md border-0 border-r border-input bg-transparent shadow-none focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent dark:hover:bg-accent/20',
            countryTriggerClassName,
          )}
          aria-label={labels?.country ?? 'Country / calling code'}
          aria-describedby={props['aria-describedby']}
          aria-invalid={props['aria-invalid']}
        >
          <SelectValue placeholder={labels?.countryPlaceholder ?? 'Select country'} />
        </SelectTrigger>
        <SelectContent
          className={countryContentClassName}
          renderViewport={(viewport) => (
            <ScrollArea
              type="always"
              renderViewport={(scrollViewport) => React.cloneElement(viewport, { asChild: true }, scrollViewport)}
              scrollbarClassName={countryScrollbarClassName}
              scrollbarThumbClassName={countryScrollbarThumbClassName}
            >
              {viewport.props.children}
            </ScrollArea>
          )}
        >
          {!restricted && <SelectItem value="international">{labels?.international ?? 'International'}</SelectItem>}
          {countryOptions.map((country) => (
            <SelectItem key={country} value={country}>
              {labels?.[country] ?? country} (+{getCountryCallingCode(country)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <InputGroupInput
        {...props}
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === 'function') return ref(node);
          if (ref) ref.current = node;
        }}
        type="tel"
        inputMode={props.inputMode ?? 'tel'}
        autoComplete={props.autoComplete ?? 'tel'}
        disabled={disabled}
        readOnly={readOnly}
        className={inputClassName}
        value={state.draft}
        onChange={(event) => {
          let raw = event.target.value;
          let position = event.target.selectionStart ?? raw.length;
          const inputType = (event.nativeEvent as InputEvent).inputType;
          // Input events also cover mobile keyboards that do not dispatch keydown.
          if (
            state.extension === undefined &&
            !state.unsupported &&
            !shouldPreserveDraft(state.draft, state.country) &&
            raw.length < state.draft.length &&
            raw.replace(/[^\d+]/g, '') === state.draft.replace(/[^\d+]/g, '') &&
            (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward')
          ) {
            const backwards = inputType === 'deleteContentBackward';
            let index = backwards ? position - 1 : position;
            while (index >= 0 && index < raw.length && !/[\d+]/.test(raw[index])) index += backwards ? -1 : 1;
            if (index >= 0 && index < raw.length) {
              raw = raw.slice(0, index) + raw.slice(index + 1);
              if (backwards) position = index;
            }
          }
          const next = normalizeDraft(raw, pickerCountry);
          pendingCaret.current = {
            draft: next.draft,
            position:
              next.unsupported || shouldPreserveDraft(next.draft, next.country)
                ? position
                : caretPosition(raw, next.draft, position),
          };
          publish(next);
          onChange?.(event);
        }}
      />
    </InputGroup>
  );
}

export type { CountryCode as PhoneInputCountry } from 'libphonenumber-js';
