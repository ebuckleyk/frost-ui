'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/Combobox';

export type TagsInputRejectionReason = 'duplicate' | 'invalid' | 'max-tags' | 'freeform-disabled';

export type TagsInputRejection = {
  value: string;
  reason: TagsInputRejectionReason;
  message?: string;
};

export type TagsInputProps = {
  value: string[];
  onValueChange: (value: string[]) => void;
  suggestions?: readonly string[];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxTags?: number;
  allowDuplicates?: boolean;
  allowFreeform?: boolean;
  commitOnComma?: boolean;
  commitOnBlur?: boolean;
  splitOnSpace?: boolean;
  normalizeTag?: (value: string) => string;
  validateTag?: (value: string) => boolean | string;
  onTagRejected?: (rejection: TagsInputRejection) => void;
  renderTag?: (value: string) => React.ReactNode;
  id?: string;
  name?: string;
  className?: string;
  inputClassName?: string;
  invalid?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

const DEFAULT_NORMALIZE = (value: string) => value.trim();

export function TagsInput({
  value,
  onValueChange,
  suggestions = [],
  placeholder = 'Add a tag',
  disabled = false,
  readOnly = false,
  maxTags,
  allowDuplicates = false,
  allowFreeform = true,
  commitOnComma = true,
  commitOnBlur = false,
  splitOnSpace = false,
  normalizeTag = DEFAULT_NORMALIZE,
  validateTag,
  onTagRejected,
  renderTag,
  id,
  name,
  className,
  inputClassName,
  invalid = false,
  onFocus,
  onBlur,
  'aria-label': ariaLabel = 'Tags',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}: TagsInputProps): React.ReactElement {
  const anchorRef = useComboboxAnchor();
  const [inputValue, setInputValue] = React.useState('');
  const reachedLimit = maxTags !== undefined && value.length >= maxTags;
  const comboboxItems = React.useMemo(() => Array.from(new Set([...suggestions, ...value])), [suggestions, value]);

  const reject = React.useCallback(
    (candidate: string, reason: TagsInputRejectionReason, message?: string) => {
      onTagRejected?.({ value: candidate, reason, message });
    },
    [onTagRejected],
  );

  const appendCandidates = React.useCallback(
    (candidates: readonly string[], source: 'freeform' | 'suggestion' = 'freeform') => {
      const next = [...value];

      candidates.forEach((rawCandidate) => {
        const candidate = normalizeTag(rawCandidate);
        if (!candidate) return;
        if (
          source === 'freeform' &&
          !allowFreeform &&
          !suggestions.some((suggestion) => normalizeTag(suggestion) === candidate)
        ) {
          reject(candidate, 'freeform-disabled');
          return;
        }
        if (maxTags !== undefined && next.length >= maxTags) {
          reject(candidate, 'max-tags');
          return;
        }
        if (!allowDuplicates && next.some((tag) => normalizeTag(tag) === candidate)) {
          reject(candidate, 'duplicate');
          return;
        }
        const validation = validateTag?.(candidate) ?? true;
        if (validation !== true) {
          reject(candidate, 'invalid', typeof validation === 'string' ? validation : undefined);
          return;
        }
        next.push(candidate);
      });

      if (next.length !== value.length) onValueChange(next);
    },
    [allowDuplicates, allowFreeform, maxTags, normalizeTag, onValueChange, reject, suggestions, validateTag, value],
  );

  const commitInput = React.useCallback(() => {
    if (!inputValue) return;
    appendCandidates([inputValue]);
    setInputValue('');
  }, [appendCandidates, inputValue]);

  const handleComboboxValueChange = React.useCallback(
    (nextValue: string[]) => {
      if (nextValue.length < value.length) {
        onValueChange(nextValue);
        return;
      }
      const added = nextValue.filter((tag) => !value.includes(tag));
      appendCandidates(added, 'suggestion');
      setInputValue('');
    },
    [appendCandidates, onValueChange, value],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;
      if (event.key === 'Tab' && !event.shiftKey) {
        if (!inputValue) return;
        event.preventDefault();
        commitInput();
      } else if (event.key === 'Enter' || (commitOnComma && event.key === ',')) {
        if (!inputValue) return;
        event.preventDefault();
        commitInput();
      } else if (event.key === 'Backspace' && inputValue.length === 0 && value.length > 0) {
        event.preventDefault();
        onValueChange(value.slice(0, -1));
      }
    },
    [commitInput, commitOnComma, disabled, inputValue, onValueChange, readOnly, value],
  );

  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;
      const pasted = event.clipboardData.getData('text');
      const delimiter = splitOnSpace ? /[,\n\r\t ]+/ : /[,\n\r]+/;
      const candidates = pasted.split(delimiter).filter(Boolean);
      if (candidates.length < 2) return;
      event.preventDefault();
      appendCandidates(candidates);
      setInputValue('');
    },
    [appendCandidates, disabled, readOnly, splitOnSpace],
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (commitOnBlur && !disabled && !readOnly) commitInput();
      onBlur?.(event);
    },
    [commitInput, commitOnBlur, disabled, onBlur, readOnly],
  );

  return (
    <>
      <Combobox<string, true>
        items={comboboxItems}
        multiple
        value={value}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        onValueChange={handleComboboxValueChange}
        disabled={disabled}
      >
        <ComboboxChips
          ref={anchorRef}
          data-slot="tags-input"
          data-readonly={readOnly || undefined}
          aria-disabled={disabled || undefined}
          className={cn(
            'min-h-9 w-full px-2 py-1.5',
            readOnly && 'bg-muted/40',
            disabled && 'cursor-not-allowed opacity-50',
            invalid && 'border-destructive ring-[3px] ring-destructive/20 dark:ring-destructive/40',
            className,
          )}
        >
          <ComboboxValue>
            {value.map((tag, index) => (
              <ComboboxChip key={`${tag}-${index}`} showRemove={!readOnly && !disabled} removeLabel={`Remove ${tag}`}>
                {renderTag ? renderTag(tag) : tag}
              </ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput
            id={id}
            value={inputValue}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={reachedLimit ? undefined : placeholder}
            aria-label={ariaLabelledBy ? undefined : ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-invalid={invalid || undefined}
            aria-readonly={readOnly || undefined}
            data-max-reached={reachedLimit || undefined}
            className={cn(readOnly && 'cursor-default', inputClassName)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={onFocus}
            onBlur={handleBlur}
          />
        </ComboboxChips>
        {suggestions.length > 0 && !readOnly && !disabled ? (
          <ComboboxContent anchor={anchorRef}>
            <ComboboxEmpty>No suggestions found.</ComboboxEmpty>
            <ComboboxList>
              {(suggestion) => (
                <ComboboxItem key={suggestion} value={suggestion}>
                  {suggestion}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        ) : null}
      </Combobox>
      {name
        ? value.map((tag, index) => (
            <input key={`${tag}-${index}`} type="hidden" name={name} value={tag} disabled={disabled} />
          ))
        : null}
    </>
  );
}
