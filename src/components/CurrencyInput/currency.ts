import { numericFormatter } from 'react-number-format';

export type CurrencyOptions = {
  /** Explicit ISO 4217 currency code. */
  currency: string;
  /** Defaults to en-US for deterministic server/client rendering. */
  locale?: string;
  fractionDigits?: number;
};

export type CurrencyInputValue = {
  /** ASCII decimal draft, including intermediate values such as "-" and "1.". */
  editableValue: string;
  /** null for empty/sign/decimal-only drafts; never a floating-point number. */
  decimalValue: string | null;
  formattedValue: string;
  exceedsPrecision: boolean;
};

export function currencyFormatOptions({ currency, locale = 'en-US', fractionDigits }: CurrencyOptions) {
  if (!/^[A-Z]{3}$/.test(currency)) throw new RangeError('Currency must be an uppercase ISO 4217 code.');
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency, numberingSystem: 'latn' });
  const scale = fractionDigits ?? formatter.resolvedOptions().maximumFractionDigits!;
  if (!Number.isInteger(scale) || scale < 0 || scale > 100) throw new RangeError('fractionDigits must be 0–100.');
  const parts = formatter.formatToParts(123456789.12);
  const first = parts.findIndex((part) => part.type === 'integer');
  const last = parts.reduce(
    (index, part, i) => (['integer', 'fraction', 'decimal', 'group'].includes(part.type) ? i : index),
    first,
  );
  const integers = parts.filter((part) => part.type === 'integer');
  const groupSize = integers[integers.length - 1].value.length;
  const thousandsGroupStyle =
    groupSize === 4
      ? 'wan'
      : integers.length > 1 && integers[integers.length - 2].value.length === 2
        ? 'lakh'
        : 'thousand';
  const decimalSeparator = new Intl.NumberFormat(locale, { numberingSystem: 'latn' })
    .formatToParts(1.1)
    .find((part) => part.type === 'decimal')!.value;
  return {
    fractionDigits: scale,
    prefix: parts
      .slice(0, first)
      .map((part) => part.value)
      .join(''),
    suffix: parts
      .slice(last + 1)
      .map((part) => part.value)
      .join(''),
    thousandSeparator: parts.find((part) => part.type === 'group')?.value ?? false,
    decimalSeparator,
    thousandsGroupStyle: thousandsGroupStyle as 'thousand' | 'lakh' | 'wan',
  };
}

export function currencyInputValue(
  editableValue: string,
  formattedValue: string,
  fractionDigits: number,
): CurrencyInputValue {
  const complete = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(editableValue);
  let decimalValue: string | null = null;
  if (complete) {
    const negative = editableValue.startsWith('-');
    const [integer, fraction] = editableValue.replace(/^-/, '').split('.');
    decimalValue = (negative ? '-' : '') + (integer.replace(/^0+(?=\d)/, '') || '0') + (fraction ? `.${fraction}` : '');
  }
  return {
    editableValue,
    decimalValue,
    formattedValue,
    exceedsPrecision: (editableValue.split('.')[1]?.length ?? 0) > fractionDigits,
  };
}

/** Explicit, exact decimal-string rounding; never converts an amount to Number. */
export function roundCurrencyValue(value: string, fractionDigits: number, mode: 'half-up' | 'truncate'): string {
  if (!/^-?\d+(?:\.\d+)?$/.test(value)) throw new RangeError('Expected a complete decimal string.');
  if (!Number.isInteger(fractionDigits) || fractionDigits < 0 || fractionDigits > 100)
    throw new RangeError('fractionDigits must be 0–100.');
  if (mode !== 'half-up' && mode !== 'truncate') throw new RangeError('Choose an explicit rounding mode.');
  const negative = value.startsWith('-');
  const [integer, fraction = ''] = value.replace(/^-/, '').split('.');
  const digits = (integer + fraction.padEnd(fractionDigits, '0').slice(0, fractionDigits)).split('');
  if (mode === 'half-up' && fraction.length > fractionDigits && fraction[fractionDigits] >= '5') {
    let carry = 1;
    for (let i = digits.length - 1; i >= 0 && carry; i--) {
      const digit = Number(digits[i]) + carry;
      digits[i] = String(digit % 10);
      carry = digit === 10 ? 1 : 0;
    }
    if (carry) digits.unshift('1');
  }
  const result = digits.join('').padStart(fractionDigits + 1, '0');
  const whole = (fractionDigits ? result.slice(0, -fractionDigits) : result).replace(/^0+(?=\d)/, '');
  return (negative ? '-' : '') + whole + (fractionDigits ? `.${result.slice(-fractionDigits)}` : '');
}

/** Read-only formatting with the same configuration; excess precision throws unless rounding is explicit. */
export function formatCurrencyValue(
  value: string | null,
  options: CurrencyOptions & { rounding?: 'half-up' | 'truncate' },
): string {
  const config = currencyFormatOptions(options);
  if (value === null || value === '') return '';
  if (!/^-?\d+(?:\.\d+)?$/.test(value)) throw new RangeError('Expected a complete decimal string.');
  const exceeds = (value.split('.')[1]?.length ?? 0) > config.fractionDigits;
  if (exceeds && !options.rounding) throw new RangeError('Excess precision requires an explicit rounding policy.');
  const exact = exceeds ? roundCurrencyValue(value, config.fractionDigits, options.rounding!) : value;
  return numericFormatter(exact, {
    ...config,
    decimalScale: config.fractionDigits,
    fixedDecimalScale: true,
    allowNegative: true,
  });
}

/** Strict locale grammar: foreign separators and malformed grouping are rejected, never guessed. */
export function parseCurrencyPaste(text: string, options: CurrencyOptions): string | null {
  const config = currencyFormatOptions(options);
  let draft = text.trim();
  const sign = draft.startsWith('-') ? '-' : '';
  draft = draft.replace(/^-/, '');
  if (config.prefix && draft.startsWith(config.prefix)) draft = draft.slice(config.prefix.length);
  if (config.suffix && draft.endsWith(config.suffix)) draft = draft.slice(0, -config.suffix.length);
  // Space grouping locales accept space, NBSP and narrow NBSP as equivalent separators.
  if (typeof config.thousandSeparator === 'string' && /\s/.test(config.thousandSeparator))
    draft = draft.replace(/[ \u00a0\u202f]/g, config.thousandSeparator);
  const parts = draft.split(config.decimalSeparator);
  if (parts.length > 2 || (parts[1] !== undefined && !/^\d*$/.test(parts[1]))) return null;
  let integer = parts[0];
  if (typeof config.thousandSeparator === 'string' && integer.includes(config.thousandSeparator)) {
    const raw = integer.split(config.thousandSeparator).join('');
    if (!/^\d+$/.test(raw) || numericFormatter(raw, { ...config, prefix: '', suffix: '' }) !== integer) return null;
    integer = raw;
  }
  if (!/^\d*$/.test(integer) || !/\d/.test(draft)) return null;
  return sign + integer + (parts.length === 2 ? `.${parts[1]}` : '');
}
