import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { normalizePhoneInput, PhoneInput } from './PhoneInput';

async function selectCountry(user: ReturnType<typeof userEvent.setup>, name: string) {
  screen.getByRole('combobox').focus();
  await user.keyboard('[Enter]');
  await user.click(await screen.findByRole('option', { name }));
}

describe('PhoneInput', () => {
  it('restricts choices to accepted countries and starts with a neutral placeholder', async () => {
    const user = userEvent.setup();
    render(<PhoneInput countries={['US', 'CA', 'US']} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Select country');
    trigger.focus();
    await user.keyboard('[Enter]');
    expect((await screen.findAllByRole('option')).map((option) => option.textContent)).toEqual(['US (+1)', 'CA (+1)']);
    await user.click(screen.getByRole('option', { name: 'CA (+1)' }));
    expect(trigger).toHaveTextContent('CA (+1)');
  });

  it.each(['US', 'CA'] as const)('uses a permitted default country %s for national input', (country) => {
    const onValueChange = vi.fn();
    render(<PhoneInput countries={['US', 'CA']} defaultCountry={country} onValueChange={onValueChange} />);
    expect(screen.getByRole('combobox')).toHaveTextContent(`${country} (+1)`);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '2133734253' } });
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ country, e164: '+12133734253' }));
  });

  it.each([undefined, 'GB'] as const)(
    'does not assume a country with default %s outside the choices',
    (defaultCountry) => {
      const onValueChange = vi.fn();
      render(<PhoneInput countries={['US', 'CA']} defaultCountry={defaultCountry} onValueChange={onValueChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '213' } });
      expect(screen.getByRole('combobox')).toHaveTextContent('Select country');
      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ draft: '213', country: undefined, e164: undefined }),
      );
    },
  );

  it.each([
    ['+44 (20) 7946-0018 x42', 'GB', '+442079460018'],
    ['+33 6 12 34 56 78', 'FR', '+33612345678'],
    ['+80012345678', undefined, '+80012345678'],
    ['+999123', undefined, undefined],
  ])(
    'preserves excluded or unknown paste %s without adding or reinterpreting countries',
    async (draft, country, e164) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<PhoneInput countries={['US', 'CA']} defaultCountry="US" onValueChange={onValueChange} />);
      await user.click(screen.getByRole('textbox'));
      await user.paste(draft!);
      expect(screen.getByRole('textbox')).toHaveValue(draft);
      expect(screen.getByRole('combobox')).toHaveTextContent('Select country');
      expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ draft, country, e164 }));
      screen.getByRole('combobox').focus();
      await user.keyboard('[Enter]');
      expect((await screen.findAllByRole('option')).map((option) => option.textContent)).toEqual([
        'US (+1)',
        'CA (+1)',
      ]);
      await user.click(screen.getByRole('option', { name: 'US (+1)' }));
      expect(screen.getByRole('textbox')).toHaveValue(draft);
      expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ draft, country, e164 }));
    },
  );

  it.each([
    ['+12133734253', 'US'],
    ['+14165550123', 'CA'],
  ])('selects the permitted country detected from paste %s', async (draft, country) => {
    const user = userEvent.setup();
    const onCountryChange = vi.fn();
    render(<PhoneInput countries={['US', 'CA']} onCountryChange={onCountryChange} />);
    await user.click(screen.getByRole('textbox'));
    await user.paste(draft);
    expect(screen.getByRole('combobox')).toHaveTextContent(`${country} (+1)`);
    expect(onCountryChange).toHaveBeenLastCalledWith(country);
  });

  it.each(['Call 2133734253', '+44 invalid', '2133734253 x12a', '+1', '2222222222'])(
    'keeps invalid or incomplete restricted drafts editable: %s',
    (draft) => {
      const onValueChange = vi.fn();
      render(<PhoneInput countries={['US', 'CA']} onValueChange={onValueChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: draft } });
      expect(screen.getByRole('textbox')).toHaveValue(draft);
      expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ draft, country: undefined }));
      expect(onValueChange.mock.lastCall?.[0].e164).toBeUndefined();
      expect(screen.getByRole('combobox')).toHaveTextContent('Select country');
    },
  );

  it('supports localized placeholders and accessible labels, including an empty accepted list', () => {
    render(
      <PhoneInput
        countries={[]}
        defaultCountry="US"
        aria-label="Téléphone"
        labels={{ country: 'Pays', countryPlaceholder: 'Choisir un pays' }}
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Pays' })).toHaveTextContent('Choisir un pays');
    expect(screen.getByRole('textbox', { name: 'Téléphone' })).toHaveValue('');
  });

  it('updates restricted controlled values and country policy without emitting changes', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <PhoneInput countries={['US', 'CA']} defaultCountry="US" value="+442079460018" onValueChange={onValueChange} />,
    );
    expect(screen.getByRole('textbox')).toHaveValue('+442079460018');
    expect(screen.getByRole('combobox')).toHaveTextContent('Select country');
    rerender(
      <PhoneInput countries={['US', 'CA']} defaultCountry="US" value="+14165550123" onValueChange={onValueChange} />,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('CA (+1)');
    rerender(<PhoneInput countries={['CA']} defaultCountry="US" value="213" onValueChange={onValueChange} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Select country');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('retains International and all countries when countries is omitted', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultValue="+442079460018" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('GB (+44)');
    screen.getByRole('combobox').focus();
    await user.keyboard('[Enter]');
    expect((await screen.findAllByRole('option')).map((option) => option.textContent)).toEqual(
      expect.arrayContaining(['International', 'US (+1)', 'CA (+1)', 'GB (+44)']),
    );
  });

  it('shares the select and scroll-area viewport, exposes popup styling, and restores focus on Escape', async () => {
    const user = userEvent.setup();
    render(
      <PhoneInput countries={['US', 'GB']} countryContentClassName="bg-background" countryScrollbarClassName="w-3" />,
    );
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('[Enter]');
    const popup = await screen.findByRole('listbox');
    expect(popup).toHaveClass('bg-background');
    const viewport = popup.querySelector('[data-radix-select-viewport]');
    expect(viewport).toHaveAttribute('data-radix-scroll-area-viewport');
    expect(viewport).toHaveStyle({ overflowX: 'hidden', overflowY: 'auto' });
    expect(popup.querySelectorAll('[data-radix-scroll-area-viewport]')).toHaveLength(1);
    expect(popup.querySelector('[data-slot=scroll-area-scrollbar]')).toHaveClass('w-3');
    await user.keyboard('[End]');
    await waitFor(() => expect(screen.getByRole('option', { name: 'GB (+44)' })).toHaveFocus());
    await user.keyboard('[Escape]');
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
  it.each([
    ['US', '(213) 373-4253', '+12133734253'],
    ['GB', '020 7946 0018', '+442079460018'],
    ['FR', '06 12 34 56 78', '+33612345678'],
    ['CA', '416-555-0123', '+14165550123'],
  ] as const)('formats national typing for %s', async (country, number, candidate) => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry={country} onValueChange={onValueChange} aria-label="Phone" />);
    await user.type(screen.getByRole('textbox'), number);
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ country, e164: candidate }));
  });

  it.each([
    ['+44 (20) 7946-0018', 'GB', '+442079460018'],
    ['+1 416 555 0123', 'CA', '+14165550123'],
    ['+1 213 373 4253', 'US', '+12133734253'],
    ['+33 6 12 34 56 78', 'FR', '+33612345678'],
  ])('international paste %s overrides a default country', async (number, country, candidate) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneInput defaultCountry="FR" onValueChange={onValueChange} aria-label="Phone" />);
    await user.click(screen.getByRole('textbox'));
    await user.paste(number);
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ country, e164: candidate }));
    expect(screen.getByRole('combobox')).toHaveTextContent(country);
  });

  it('preserves incomplete input and never assumes a country from the locale', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneInput onValueChange={onValueChange} aria-label="Phone" />);
    await user.type(screen.getByRole('textbox'), '213');
    expect(onValueChange).toHaveBeenLastCalledWith({
      draft: '213',
      country: undefined,
      e164: undefined,
      extension: undefined,
      unsupported: false,
    });
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), '+1');
    expect(screen.getByRole('textbox')).toHaveValue('+1');
    expect(screen.getByRole('combobox')).toHaveTextContent('International');
    expect(onValueChange.mock.lastCall?.[0].e164).toBeUndefined();
  });

  it('supports mid-string editing, separator deletion, range deletion and clearing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <PhoneInput defaultCountry="US" defaultValue="2133734253" onValueChange={onValueChange} aria-label="Phone" />,
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);
    input.setSelectionRange(7, 7);
    await user.keyboard('9');
    expect(onValueChange.mock.lastCall?.[0].e164).toBe('+121339734253');
    expect(input.selectionStart).toBe(5);
    await user.clear(input);
    await user.type(input, '2133734253');
    input.setSelectionRange(6, 6);
    await user.keyboard('[Backspace]');
    expect(onValueChange.mock.lastCall?.[0].e164).toBe('+1213734253');
    input.setSelectionRange(0, 3);
    await user.keyboard('[Delete]');
    expect(onValueChange.mock.lastCall?.[0].e164).toBe('+13734253');
    await user.clear(input);
    expect(onValueChange.mock.lastCall?.[0]).toMatchObject({ draft: '', e164: undefined, country: 'US' });
  });

  it('accepts controlled updates and clear without emitting a user change', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<PhoneInput value="020" defaultCountry="GB" onValueChange={onValueChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('020');
    rerender(<PhoneInput value="+14165550123" defaultCountry="GB" onValueChange={onValueChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('+1 416 555 0123');
    expect(screen.getByRole('combobox')).toHaveTextContent('CA (+1)');
    rerender(<PhoneInput value="" defaultCountry="GB" onValueChange={onValueChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([' x42', ' ext. 42', ';ext=42', '#42', ' x'])(
    'keeps subsequent typing in the base number when extension suffix is %s',
    async (suffix) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<PhoneInput defaultValue={'2133734253' + suffix} defaultCountry="US" onValueChange={onValueChange} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.click(input);
      input.setSelectionRange(2, 2);
      await user.keyboard('9');
      expect(input).toHaveValue('29133734253' + suffix);
      expect(input.selectionStart).toBe(2);
      await user.keyboard('8');
      expect(input).toHaveValue('298133734253' + suffix);
      expect(input.selectionStart).toBe(3);
      expect(onValueChange.mock.lastCall?.[0].extension).toBe(suffix.endsWith('x') ? '' : '42');
    },
  );

  it('keeps the caret within the extension when the base gains formatting', () => {
    render(<PhoneInput defaultValue="2133734253 x42" defaultCountry="US" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.input(input, {
      inputType: 'insertText',
      target: { value: '2133734253 x492', selectionStart: 14, selectionEnd: 14 },
    });
    expect(input).toHaveValue('(213) 373-4253 x492');
    expect(input.value.slice(0, input.selectionStart!)).toBe('(213) 373-4253 x49');
  });

  it.each([' x123', ' ext. 123', ';ext=123', '#123', ' x'])(
    'captures extension %s separately without loss',
    async (suffix) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<PhoneInput defaultCountry="US" onValueChange={onValueChange} />);
      await user.click(screen.getByRole('textbox'));
      await user.paste('2133734253' + suffix);
      expect(screen.getByRole('textbox')).toHaveValue('(213) 373-4253' + suffix);
      expect(onValueChange.mock.lastCall?.[0]).toMatchObject({
        e164: '+12133734253',
        extension: suffix.endsWith('x') ? '' : '123',
      });
    },
  );

  it.each(['2133734253 extension 12', '2133734253 x12a', 'Call 2133734253', '213+3734253'])(
    'preserves unsupported text %s without a candidate',
    (draft) => {
      expect(normalizePhoneInput(draft, 'US')).toMatchObject({ draft, unsupported: true });
      expect(normalizePhoneInput(draft, 'US').e164).toBeUndefined();
    },
  );

  it('does not impose strict validation or invent subscriber digits', () => {
    expect(normalizePhoneInput('+999123', 'US').e164).toBeUndefined();
    expect(normalizePhoneInput('+44', 'US').e164).toBeUndefined();
    expect(normalizePhoneInput('2', 'US').e164).toBe('+12');
    expect(normalizePhoneInput('2222222222', 'US').e164).toBe('+12222222222');
    expect(normalizePhoneInput('+80012345678', 'US')).toMatchObject({ country: undefined, e164: '+80012345678' });
    expect(normalizePhoneInput('+123456789012345678', 'US').e164).toBeUndefined();
  });

  it('supports translated country selection, refs, mobile attributes and handlers', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLInputElement>();
    const onBlur = vi.fn();
    const onChange = vi.fn();
    const onCountryChange = vi.fn();
    render(
      <>
        <label htmlFor="phone">Téléphone</label>
        <PhoneInput
          id="phone"
          name="phone"
          ref={ref}
          onBlur={onBlur}
          onChange={onChange}
          onCountryChange={onCountryChange}
          labels={{ country: 'Pays', international: 'International', FR: 'France' }}
          countries={['FR', 'GB']}
          aria-invalid
          aria-describedby="help"
        />
        <span id="help">Aide</span>
      </>,
    );
    expect(ref.current).toBe(screen.getByLabelText('Téléphone'));
    expect(ref.current).toHaveAttribute('type', 'tel');
    expect(ref.current).toHaveAttribute('inputmode', 'tel');
    expect(ref.current).toHaveAttribute('autocomplete', 'tel');
    expect(ref.current).toHaveAttribute('aria-invalid', 'true');
    expect(ref.current).toHaveAttribute('aria-describedby', 'help');
    await user.tab();
    expect(screen.getByRole('combobox', { name: 'Pays' })).toHaveFocus();
    await user.keyboard('[Enter]');
    expect(await screen.findByRole('option', { name: 'France (+33)' })).toBeInTheDocument();
    await user.keyboard('[Home][Enter]');
    expect(onCountryChange).toHaveBeenLastCalledWith('FR');
    await user.tab();
    expect(ref.current).toHaveFocus();
    await user.type(ref.current!, '06');
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveTextContent('France (+33)');
  });

  it('allows changing the country of an international draft', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneInput defaultValue="+12133734253" onValueChange={onValueChange} />);
    await selectCountry(user, 'CA (+1)');
    expect(screen.getByRole('combobox')).toHaveTextContent('CA (+1)');
    expect(onValueChange.mock.lastCall?.[0]).toMatchObject({ e164: '+12133734253', country: 'CA' });
  });

  it.each(['+999123', '+999123 x42', '+9', '+1'])(
    'preserves international draft %s without national digits when selecting a country',
    async (draft) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<PhoneInput defaultValue={draft} countries={['US']} onValueChange={onValueChange} />);
      await selectCountry(user, 'US (+1)');
      expect(screen.getByRole('textbox')).toHaveValue(draft);
      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ draft, e164: undefined, extension: draft.endsWith('x42') ? '42' : undefined }),
      );
    },
  );

  it.each(['disabled', 'readOnly'] as const)('blocks edits when %s', async (prop) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneInput {...{ [prop]: true }} defaultValue="213" defaultCountry="US" onValueChange={onValueChange} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
    await user.type(screen.getByRole('textbox'), '9');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps a controlled draft through change callbacks', () => {
    function Controlled() {
      const [value, setValue] = React.useState('');
      return <PhoneInput value={value} onValueChange={(next) => setValue(next.draft)} defaultCountry="GB" />;
    }
    render(<Controlled />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '02079460018' } });
    expect(screen.getByRole('textbox')).toHaveValue('020 7946 0018');
  });

  it.each(['deleteContentBackward', 'deleteContentForward'])(
    'preserves digits and caret when %s removes a separator from an excluded draft',
    (inputType) => {
      const onValueChange = vi.fn();
      const onCountryChange = vi.fn();
      render(
        <PhoneInput
          countries={['US', 'CA']}
          defaultValue="+44 20 7946-0018"
          onValueChange={onValueChange}
          onCountryChange={onCountryChange}
        />,
      );
      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.input(input, {
        inputType,
        target: { value: '+4420 7946-0018', selectionStart: 3, selectionEnd: 3 },
      });
      expect(input).toHaveValue('+4420 7946-0018');
      expect(input.selectionStart).toBe(3);
      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ draft: '+4420 7946-0018', country: 'GB', e164: '+442079460018' }),
      );
      expect(onCountryChange).not.toHaveBeenCalled();
      expect(screen.getByRole('combobox')).toHaveTextContent('Select country');
    },
  );

  it('keeps the caret beside user-supplied separators in an unknown international draft', () => {
    render(<PhoneInput countries={['US', 'CA']} defaultValue="+999  123" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.input(input, {
      inputType: 'deleteContentBackward',
      target: { value: '+999 123', selectionStart: 5, selectionEnd: 5 },
    });
    expect(input).toHaveValue('+999 123');
    expect(input.selectionStart).toBe(5);
  });

  it('handles mobile input-event separator deletion and calls the native change handler', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <PhoneInput defaultValue="2133734253" defaultCountry="US" onValueChange={onValueChange} onChange={onChange} />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.input(input, {
      inputType: 'deleteContentBackward',
      target: { value: '(213)373-4253', selectionStart: 5, selectionEnd: 5 },
    });
    expect(onValueChange.mock.lastCall?.[0].e164).toBe('+1213734253');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('preserves extensions through country changes in an unrestricted menu', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneInput defaultValue="+12133734253 x42" onValueChange={onValueChange} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('US (+1)');
    await selectCountry(user, 'GB (+44)');
    expect(onValueChange.mock.lastCall?.[0]).toMatchObject({ country: 'GB', e164: '+442133734253', extension: '42' });
    expect(screen.getByRole('textbox')).toHaveValue('2133734253 x42');
  });
});
