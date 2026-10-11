# PhoneInput

Install the optional peers `libphonenumber-js`, `@radix-ui/react-select`, and
`@radix-ui/react-scroll-area`, then import `PhoneInput` from
`@ebuckleyk/frost-ui/components/PhoneInput` (also available from the root).

```tsx
const [draft, setDraft] = React.useState('');
<PhoneInput
  id="phone"
  name="phone"
  aria-label="Phone number"
  defaultCountry="GB"
  value={draft}
  onValueChange={(next) => {
    setDraft(next.draft);
    // next.country, next.e164, next.extension, next.unsupported
  }}
/>;
```

`value` is the editable draft string, not an E.164-only field. Keep it controlled
by passing a string for its lifetime and clear with `''`. Omitting `value` uses
uncontrolled state initialized by `defaultValue`. `defaultCountry` initializes
the national-entry context; it is not inferred from language and is not a
controlled country prop. External value updates are formatted without emitting
change callbacks. Persist the selected country separately if saving national
drafts, and restore it with `defaultCountry` when remounting. Clearing preserves
the user's selected country.

`onValueChange` receives the formatted `draft`, selected `country`, normalized
`e164` candidate, separate `extension`, and `unsupported` flag. The native
`onChange` receives the original input change event; `onBlur` and `ref` target
the telephone input. Country changes emit `onValueChange` and `onCountryChange`.
Changing country reinterprets national digits. For an international draft,
selecting a country first converts to national format and preserves extensions.
Selecting International removes national-entry context; it does not insert a
calling code. Explicit `+` input/paste always takes precedence over the default.
Shared calling codes may leave `country` undefined until enough digits identify
it; non-geographic codes such as +800 remain International. `countries` limits
the menu, but a country identified from explicit international input is still
shown so the number is never misrepresented.

Common ASCII spaces, dots, hyphens and parentheses are accepted and reformatted
while typing. Incomplete input such as `+`, `+1`, or `020` stays editable. The
formatter never fills in missing subscriber digits. Caret positions follow digits
across formatting changes; deleting a separator deletes the adjacent digit so
backspace/delete continues to make progress.

Extensions introduced by `x`, `ext`, `ext.`, `#`, or `;ext=` are retained in the
draft and returned separately, including an empty extension while it is being
entered. Extension digits are never included in `e164`. Unsupported text (including
unrecognized extension syntax, vanity letters, or malformed extension digits)
stays visible, sets `unsupported`, and has no candidate. Applications must decide
whether to accept extensions and store them separately. Never submit only the
candidate without checking the draft/extension state.

Normalization is not validation: `e164` can be an incomplete candidate and is
undefined when there is no country context, no subscriber digits, unsupported
text, an unknown calling code, or more than 15 E.164 digits. Applications can use
`isPossiblePhoneNumber` for length checks, or `isValidPhoneNumber` for numbering
plan checks. The default library metadata uses `min`; use `libphonenumber-js/max`
for detailed numbering-plan validation if needed. Neither check proves ownership
or reachability. No validation policy or error text is imposed by PhoneInput.

The component uses FrostUI InputGroupInput and Select inside one InputGroup,
sharing a border, glass surface, and focus/invalid treatment. The country popup
uses ScrollArea with a shared Select viewport for keyboard navigation, typeahead,
touch/wheel scrolling, and a customizable scrollbar. The input defaults to `type="tel"`, `inputMode="tel"` and
`autoComplete="tel"`; other Input props (including id/name, required, disabled,
readOnly, aria-invalid and aria-describedby) pass through. readOnly also disables
country selection. `className` styles the wrapper and `inputClassName` styles the
input. `labels` accepts country names keyed by ISO country code plus `country`
(selector accessible label) and `international`. Defaults use ISO codes; callers
can supply translations without affecting country inference. Give the input an
associated label or aria-label. Storybook includes a react-hook-form Controller
example storing the draft and applying application-owned acceptance rules.

Consumers can customize the portalled country menu directly:

```tsx
<PhoneInput
  defaultCountry="US"
  countryTriggerClassName="max-w-48"
  countryContentClassName="border border-primary/30"
  countryScrollbarClassName="w-3"
  countryScrollbarThumbClassName="bg-primary/60 hover:bg-primary"
/>
```

The scrollbar is rendered by ScrollArea, so browser `::-webkit-scrollbar` rules
do not style it. Use the class props above or global `[data-slot=scroll-area-scrollbar]`
and `[data-slot=scroll-area-thumb]` selectors. The popup is portalled outside the
InputGroup; use `countryContentClassName` to scope overrides to this menu.

The implementation uses libphonenumber-js's AsYouType directly. We evaluated
[react-phone-number-input](https://github.com/catamphetamine/react-phone-number-input)
and its supported custom input/country selector APIs; its normalized-value
contract does not directly provide a lossless editable draft with extensions.
Using the formatter directly keeps that contract explicit without intercepting
the wrapper's internal state.
