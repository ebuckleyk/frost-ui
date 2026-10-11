import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  CurrencyInput,
  formatCurrencyValue,
  parseCurrencyPaste,
  roundCurrencyValue,
  type CurrencyInputValue,
} from './CurrencyInput';

describe('CurrencyInput', () => {
  it.each([
    ['USD', 'en-US', '$1.99'],
    ['EUR', 'de-DE', '1,99\u00a0€'],
  ])('validates the resulting amount for pasted edits in %s / %s', async (currency, locale, display) => {
    const user = userEvent.setup();
    const rejected = vi.fn();
    const change = vi.fn();
    const allowed = vi.fn((next: CurrencyInputValue) => next.decimalValue === null || Number(next.decimalValue) <= 10);
    render(
      <CurrencyInput
        currency={currency}
        locale={locale}
        defaultValue="1."
        isAllowed={allowed}
        onValueChange={change}
        onInputRejected={rejected}
      />,
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);
    const decimalIndex = input.value.indexOf(locale === 'de-DE' ? ',' : '.');
    input.setSelectionRange(decimalIndex + 1, decimalIndex + 1);
    await user.paste('99');
    expect(input).toHaveValue(display);
    expect(allowed).toHaveBeenLastCalledWith(
      expect.objectContaining({ decimalValue: '1.99', formattedValue: display }),
    );
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue: '1.99' }));
    expect(rejected).not.toHaveBeenCalled();
    await user.click(input);
    input.setSelectionRange(0, input.value.length);
    await user.paste('11');
    expect(input).toHaveValue(display);
    expect(rejected).toHaveBeenLastCalledWith('validation');
    await user.click(input);
    input.setSelectionRange(0, input.value.length);
    await user.paste('8');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue: '8' }));
  });

  it('preserves amounts when rejecting negative pastes and honors a consumer paste cancellation', async () => {
    const user = userEvent.setup();
    const rejected = vi.fn();
    const { rerender } = render(<CurrencyInput currency="USD" defaultValue="12" onInputRejected={rejected} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.paste('-3');
    expect(input).toHaveValue('$12');
    expect(rejected).toHaveBeenLastCalledWith('negative');
    rerender(<CurrencyInput currency="USD" onPaste={(event) => event.preventDefault()} />);
    await user.paste('4');
    expect(input).toHaveValue('$12');
  });

  it('handles a mobile input event and range deletion without changing decimal units', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<CurrencyInput currency="USD" defaultValue="1234.56" onValueChange={change} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);
    fireEvent.input(input, { target: { value: '$1,234.5' }, inputType: 'deleteContentBackward' });
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue: '1234.5' }));
    await user.click(input);
    input.setSelectionRange(3, 5);
    await user.keyboard('[Backspace]');
    expect(input).toHaveValue('$14.5');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue: '14.5' }));
  });

  it('uses locale separators for mid-string pasted replacements and enforces combined precision', async () => {
    const user = userEvent.setup();
    render(<CurrencyInput currency="EUR" locale="de-DE" defaultValue="1234.56" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);
    input.setSelectionRange(2, 4);
    await user.paste('99');
    expect(input).toHaveValue('1.994,56\u00a0€');
    input.setSelectionRange(7, 7);
    await user.paste('7');
    expect(input).toHaveValue('1.994,56\u00a0€');
  });

  it('keeps empty, zero, decimal-only and intermediate drafts separate from exact values', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<CurrencyInput currency="USD" onValueChange={change} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
    await user.type(input, '.');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ editableValue: '.', decimalValue: null }));
    await user.clear(input);
    await user.type(input, '0');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue: '0' }));
    await user.type(input, '.');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ editableValue: '0.', decimalValue: '0' }));
    await user.type(input, '12');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue: '0.12' }));
    await user.clear(input);
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ editableValue: '', decimalValue: null }));
  });

  it.each([
    ['USD', 'en-US', '1234.56', '$1,234.56', '1234.56'],
    ['EUR', 'de-DE', '1234,56', '1.234,56\u00a0€', '1234.56'],
    ['JPY', 'ja-JP', '1234', '￥1,234', '1234'],
    ['KWD', 'en-US', '1234.567', 'KWD\u00a01,234.567', '1234.567'],
    ['INR', 'en-IN', '1234567.89', '₹12,34,567.89', '1234567.89'],
  ])('formats typing for %s / %s', async (currency, locale, typed, display, decimalValue) => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<CurrencyInput currency={currency} locale={locale} onValueChange={change} />);
    await user.type(screen.getByRole('textbox'), typed);
    expect(screen.getByRole('textbox')).toHaveValue(display);
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue }));
  });

  it('supports controlled echoes, mid-string insertion, deletion, caret and external updates', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = React.useState('1234.56');
      return (
        <>
          <CurrencyInput currency="USD" value={value} onValueChange={(next) => setValue(next.editableValue)} />
          <button onClick={() => setValue('0')}>Reset</button>
        </>
      );
    }
    render(<Controlled />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);
    input.setSelectionRange(4, 4);
    await user.keyboard('9');
    expect(input).toHaveValue('$12,934.56');
    expect(input.selectionStart).toBe(5);
    await user.keyboard('[Backspace]');
    expect(input).toHaveValue('$1,234.56');
    await user.click(screen.getByRole('button'));
    expect(input).toHaveValue('$0');
    await user.clear(input);
    expect(input).toHaveValue('');
  });

  it('accepts only configured paste grammar and preserves large decimal strings', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const reject = vi.fn();
    render(<CurrencyInput currency="EUR" locale="de-DE" onValueChange={change} onInputRejected={reject} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.paste('9.007.199.254.740.993,12');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue: '9007199254740993.12' }));
    await user.clear(input);
    await user.paste('1,234.56');
    expect(input).toHaveValue('');
    expect(reject).toHaveBeenLastCalledWith('format');
    await user.paste('12.34');
    expect(input).toHaveValue('');
    await user.paste('1.234,56');
    expect(input).toHaveValue('1.234,56\u00a0€');
  });

  it.each([
    ['JPY', '1', '1.1'],
    ['USD', '1.23', '1.234'],
    ['KWD', '1.234', '1.2345'],
  ])('rejects excess pasted precision for %s without altering the amount', async (currency, valid, excess) => {
    const user = userEvent.setup();
    const reject = vi.fn();
    render(<CurrencyInput currency={currency} defaultValue={valid} onInputRejected={reject} />);
    const input = screen.getByRole('textbox');
    const previous = (input as HTMLInputElement).value;
    await user.click(input);
    await user.keyboard('[ControlLeft]a[/ControlLeft]');
    await user.paste(excess);
    expect(input).toHaveValue(previous);
    expect(reject).toHaveBeenLastCalledWith('precision');
  });

  it('rejects excess typed digits and can explicitly preserve excess precision', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender } = render(<CurrencyInput currency="USD" onValueChange={change} />);
    await user.type(screen.getByRole('textbox'), '1.234');
    expect(screen.getByRole('textbox')).toHaveValue('$1.23');
    rerender(<CurrencyInput currency="USD" precisionPolicy="allow" onValueChange={change} />);
    await user.type(screen.getByRole('textbox'), '4');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue: '1.234', exceedsPrecision: true }));
  });

  it('supports negative drafts, precision overrides and caller constraints', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <CurrencyInput
        currency="JPY"
        fractionDigits={2}
        allowNegative
        onValueChange={change}
        isAllowed={(next) => next.decimalValue !== '-10'}
      />,
    );
    const input = screen.getByRole('textbox');
    await user.type(input, '-');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ editableValue: '-', decimalValue: null }));
    await user.type(input, '10');
    expect(input).toHaveValue('-¥1');
    await user.type(input, '.25');
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ decimalValue: '-1.25' }));
  });

  it('forwards ref, labels, native events, validation attributes and mobile keyboard hints', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLInputElement>();
    const blur = vi.fn();
    const change = vi.fn();
    const { rerender } = render(
      <>
        <label htmlFor="amount">Montant</label>
        <CurrencyInput
          currency="EUR"
          id="amount"
          name="amount"
          ref={ref}
          aria-invalid
          aria-describedby="help"
          onBlur={blur}
          onChange={change}
        />
        <p id="help">Required</p>
        <button>Next</button>
      </>,
    );
    const input = screen.getByRole('textbox', { name: 'Montant' });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(input).toHaveAttribute('name', 'amount');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Required');
    expect(input).toHaveClass('input-glass', 'border-input', 'focus-visible:border-ring');
    await user.tab();
    expect(input).toHaveFocus();
    await user.keyboard('12');
    expect(change).toHaveBeenCalled();
    await user.tab();
    expect(blur).toHaveBeenCalled();
    rerender(<CurrencyInput currency="USD" disabled defaultValue="12" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    rerender(<CurrencyInput currency="USD" readOnly value="12" />);
    await user.type(screen.getByRole('textbox'), '9');
    expect(screen.getByRole('textbox')).toHaveValue('$12');
  });

  it('updates controlled currency and locale without emitting user changes', () => {
    const change = vi.fn();
    const { rerender } = render(<CurrencyInput currency="USD" value="1234.50" onValueChange={change} />);
    rerender(<CurrencyInput currency="EUR" locale="de-DE" value="9876.50" onValueChange={change} />);
    expect(screen.getByRole('textbox')).toHaveValue('9.876,50\u00a0€');
    expect(change).not.toHaveBeenCalled();
    fireEvent.blur(screen.getByRole('textbox'));
  });
});

describe('exact currency utilities', () => {
  it.each([
    ['USD', 'en-US', '9007199254740993.12', '$9,007,199,254,740,993.12'],
    ['JPY', 'ja-JP', '1234', '￥1,234'],
    ['KWD', 'en-US', '1.234', 'KWD\u00a01.234'],
    ['EUR', 'fr-FR', '1234.5', '1\u202f234,50\u00a0€'],
  ])('formats read-only %s exactly', (currency, locale, value, expected) => {
    expect(formatCurrencyValue(value, { currency, locale })).toBe(expected);
  });
  it('requires explicit rounding and implements half-up/truncate without floating-point loss', () => {
    expect(() => formatCurrencyValue('1.235', { currency: 'USD' })).toThrow();
    expect(formatCurrencyValue('1.235', { currency: 'USD', rounding: 'half-up' })).toBe('$1.24');
    expect(roundCurrencyValue('9007199254740999.999', 2, 'half-up')).toBe('9007199254741000.00');
    expect(roundCurrencyValue('-1.235', 2, 'half-up')).toBe('-1.24');
    expect(roundCurrencyValue('-1.239', 2, 'truncate')).toBe('-1.23');
    expect(roundCurrencyValue('999.9', 0, 'half-up')).toBe('1000');
    expect(formatCurrencyValue(null, { currency: 'USD' })).toBe('');
  });
  it('rejects foreign and malformed separators, allowing locale space equivalents', () => {
    expect(parseCurrencyPaste('1,234.56', { currency: 'EUR', locale: 'de-DE' })).toBeNull();
    expect(parseCurrencyPaste('1,23', { currency: 'USD' })).toBeNull();
    expect(parseCurrencyPaste('1e3', { currency: 'USD' })).toBeNull();
    expect(parseCurrencyPaste('1 234,56 €', { currency: 'EUR', locale: 'fr-FR' })).toBeNull();
    expect(parseCurrencyPaste('1 234,56', { currency: 'EUR', locale: 'fr-FR' })).toBe('1234.56');
    expect(parseCurrencyPaste('12,34,567.89', { currency: 'INR', locale: 'en-IN' })).toBe('1234567.89');
  });
  it('validates configuration and rejects excess programmatic precision', () => {
    expect(() => formatCurrencyValue('1', { currency: '' })).toThrow();
    expect(() => formatCurrencyValue('1', { currency: 'USD', fractionDigits: -1 })).toThrow();
    expect(() => render(<CurrencyInput currency="USD" value="1.234" />)).toThrow('Excess precision');
    expect(() => render(<CurrencyInput currency="USD" value="-1" />)).toThrow('Negative value');
  });
});
