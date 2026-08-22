'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../Button';

type QuestionnaireItemStatus = 'unanswered' | 'answered' | 'skipped';
type QuestionnaireShortcutMode = 'letters' | 'numbers';

type QuestionnaireChoiceDefinition = {
  disabled?: boolean;
  value: string;
};

type QuestionnaireItemDefinition = {
  choices?: readonly QuestionnaireChoiceDefinition[];
  disabled?: boolean;
  name: string;
  required?: boolean;
};

type QuestionnaireProps = Omit<React.ComponentProps<'form'>, 'defaultValue' | 'value'> & {
  defaultItem?: string;
  item?: string;
  items?: readonly QuestionnaireItemDefinition[];
  onItemChange?: (item: string) => void;
  shortcuts?: QuestionnaireShortcutMode;
};

type RegisteredItem = {
  disabled: boolean;
  element: HTMLFieldSetElement | null;
  multiple: boolean;
  name: string;
  required: boolean;
};

type Answer = {
  choices: ReadonlySet<string>;
  input: string;
};

type QuestionnaireContextValue = {
  activeName: string | null;
  answerFor: (name: string) => Answer;
  choiceDisabledFor: (name: string, value: string, fallback: boolean) => boolean;
  current: number;
  disabledFor: (name: string, fallback: boolean) => boolean;
  goNext: () => void;
  goPrevious: () => void;
  invalidName: string | null;
  isFirst: boolean;
  isLast: boolean;
  registerItem: (item: RegisteredItem) => () => void;
  requiredFor: (name: string, fallback: boolean) => boolean;
  setChoice: (name: string, value: string, selected: boolean, multiple: boolean) => void;
  setInput: (name: string, value: string) => void;
  shortcutFor: (name: string, value: string) => string | null;
  shortcuts: QuestionnaireShortcutMode | undefined;
  skipCurrent: () => void;
  statusFor: (name: string) => QuestionnaireItemStatus;
  total: number;
};

type QuestionnaireItemContextValue = {
  active: boolean;
  answer: Answer;
  choiceDisabledFor: (value: string, fallback: boolean) => boolean;
  skipped: boolean;
  invalid: boolean;
  multiple: boolean;
  name: string;
  required: boolean;
  setChoice: (value: string, selected: boolean) => void;
  setDescriptionId: (id: string | undefined) => void;
  setErrorId: (id: string | undefined) => void;
  setInput: (value: string) => void;
  shortcutFor: (value: string) => string | null;
  shortcuts: QuestionnaireShortcutMode | undefined;
};

const QuestionnaireContext = React.createContext<QuestionnaireContextValue | null>(null);
const QuestionnaireItemContext = React.createContext<QuestionnaireItemContextValue | null>(null);

const emptyAnswer: Answer = { choices: new Set(), input: '' };

function answersEqual(first: Answer, second: Answer) {
  return (
    first.input === second.input &&
    first.choices.size === second.choices.size &&
    [...first.choices].every((value) => second.choices.has(value))
  );
}

function useQuestionnaire(component: string) {
  const context = React.useContext(QuestionnaireContext);

  if (!context) {
    throw new Error(`${component} must be used within a Questionnaire.`);
  }

  return context;
}

function useQuestionnaireItem(component: string) {
  const context = React.useContext(QuestionnaireItemContext);

  if (!context) {
    throw new Error(`${component} must be used within a QuestionnaireItem.`);
  }

  return context;
}

function Questionnaire({
  children,
  className,
  defaultItem,
  item,
  items,
  noValidate = true,
  onItemChange,
  onKeyDown,
  onSubmit,
  shortcuts,
  ...props
}: QuestionnaireProps) {
  const [registeredItems, setRegisteredItems] = React.useState<RegisteredItem[]>([]);
  const [activeItem, setActiveItem] = React.useState<string | null>(
    () => defaultItem ?? items?.find((candidate) => !candidate.disabled)?.name ?? null,
  );
  const [answers, setAnswers] = React.useState<Map<string, Answer>>(new Map());
  const [skippedItems, setSkippedItems] = React.useState<ReadonlySet<string>>(new Set());
  const [invalidName, setInvalidName] = React.useState<string | null>(null);
  const controlled = item !== undefined;

  const resolvedItems = React.useMemo(() => {
    if (!items) return registeredItems;

    return items.map((definition) => {
      const registered = registeredItems.find((candidate) => candidate.name === definition.name);

      return {
        disabled: definition.disabled ?? registered?.disabled ?? false,
        element: registered?.element ?? null,
        multiple: registered?.multiple ?? false,
        name: definition.name,
        required: definition.required ?? registered?.required ?? false,
      };
    });
  }, [items, registeredItems]);

  const activeName = controlled ? (item ?? null) : activeItem;
  const activeIndex = resolvedItems.findIndex((candidate) => candidate.name === activeName);
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeDefinition = resolvedItems[currentIndex] ?? null;
  const enabledItems = React.useMemo(() => resolvedItems.filter((candidate) => !candidate.disabled), [resolvedItems]);
  const enabledCurrentIndex = enabledItems.findIndex((candidate) => candidate.name === activeName);
  const current = enabledCurrentIndex >= 0 ? enabledCurrentIndex + 1 : 0;
  const hasPreviousEnabledItem = enabledCurrentIndex > 0;
  const hasNextEnabledItem = enabledCurrentIndex >= 0 && enabledCurrentIndex < enabledItems.length - 1;

  React.useEffect(() => {
    if (controlled || resolvedItems.length === 0) return;

    setActiveItem((previous) => {
      if (previous && resolvedItems.some((candidate) => candidate.name === previous && !candidate.disabled))
        return previous;
      if (defaultItem && resolvedItems.some((candidate) => candidate.name === defaultItem && !candidate.disabled)) {
        return defaultItem;
      }

      return resolvedItems.find((candidate) => !candidate.disabled)?.name ?? resolvedItems[0]?.name ?? null;
    });
  }, [controlled, defaultItem, resolvedItems]);

  React.useEffect(() => {
    if (!activeName) return;

    const element = resolvedItems.find((candidate) => candidate.name === activeName)?.element;
    if (!element) return;

    const frame = window.requestAnimationFrame(() => {
      const control = element.querySelector<HTMLInputElement>('input:not(:disabled)');
      (control ?? element).focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeName, resolvedItems]);

  const setCurrentItem = React.useCallback(
    (name: string) => {
      if (!controlled) setActiveItem(name);
      onItemChange?.(name);
      setInvalidName(null);
    },
    [controlled, onItemChange],
  );

  const answerFor = React.useCallback((name: string) => answers.get(name) ?? emptyAnswer, [answers]);

  const statusFor = React.useCallback(
    (name: string): QuestionnaireItemStatus => {
      const answer = answerFor(name);
      if (answer.choices.size > 0 || answer.input.trim()) return 'answered';
      if (skippedItems.has(name)) return 'skipped';

      return 'unanswered';
    },
    [answerFor, skippedItems],
  );

  const updateAnswer = React.useCallback((name: string, update: (answer: Answer) => Answer) => {
    setAnswers((previous) => {
      const current = previous.get(name) ?? emptyAnswer;
      const updated = update(current);
      if (answersEqual(current, updated)) return previous;
      const next = new Map(previous);
      next.set(name, updated);
      return next;
    });
    setSkippedItems((previous) => {
      if (!previous.has(name)) return previous;
      const next = new Set(previous);
      next.delete(name);
      return next;
    });
    setInvalidName((previous) => (previous === name ? null : previous));
  }, []);

  const setChoice = React.useCallback(
    (name: string, value: string, selected: boolean, multiple: boolean) => {
      updateAnswer(name, (answer) => {
        const choices = new Set(answer.choices);
        if (selected) {
          if (!multiple) choices.clear();
          choices.add(value);
        } else choices.delete(value);

        return { choices, input: selected ? '' : answer.input };
      });
    },
    [updateAnswer],
  );

  const setInput = React.useCallback(
    (name: string, value: string) => {
      updateAnswer(name, (answer) => ({ choices: value ? new Set() : answer.choices, input: value }));
    },
    [updateAnswer],
  );

  const requiredFor = React.useCallback(
    (name: string, fallback: boolean) =>
      resolvedItems.find((candidate) => candidate.name === name)?.required ?? fallback,
    [resolvedItems],
  );

  const disabledFor = React.useCallback(
    (name: string, fallback: boolean) =>
      resolvedItems.find((candidate) => candidate.name === name)?.disabled ?? fallback,
    [resolvedItems],
  );

  const choiceDisabledFor = React.useCallback(
    (name: string, value: string, fallback: boolean) =>
      items?.find((candidate) => candidate.name === name)?.choices?.find((choice) => choice.value === value)
        ?.disabled ?? fallback,
    [items],
  );

  const shortcutFor = React.useCallback(
    (name: string, value: string) => {
      if (!shortcuts) return null;
      const index =
        items?.find((candidate) => candidate.name === name)?.choices?.findIndex((choice) => choice.value === value) ??
        -1;

      return index >= 0 ? formatShortcut(shortcuts, index) : null;
    },
    [items, shortcuts],
  );

  const validateCurrent = React.useCallback(() => {
    if (!activeDefinition || !activeName || !activeDefinition.required) return true;
    if (statusFor(activeName) === 'answered') return true;

    setInvalidName(activeName);
    activeDefinition.element?.focus();
    return false;
  }, [activeDefinition, activeName, statusFor]);

  const validateRequiredItems = React.useCallback(() => {
    const incomplete = enabledItems.find((candidate) => candidate.required && statusFor(candidate.name) !== 'answered');
    if (!incomplete) return true;

    if (incomplete.name === activeName) incomplete.element?.focus();
    else setCurrentItem(incomplete.name);
    setInvalidName(incomplete.name);
    return false;
  }, [activeName, enabledItems, setCurrentItem, statusFor]);

  const goNext = React.useCallback(() => {
    if (!validateCurrent()) return;

    const next = resolvedItems.slice(currentIndex + 1).find((candidate) => !candidate.disabled);
    if (next) setCurrentItem(next.name);
  }, [currentIndex, resolvedItems, setCurrentItem, validateCurrent]);

  const goPrevious = React.useCallback(() => {
    const previous = [...resolvedItems.slice(0, currentIndex)].reverse().find((candidate) => !candidate.disabled);
    if (previous) setCurrentItem(previous.name);
  }, [currentIndex, resolvedItems, setCurrentItem]);

  const skipCurrent = React.useCallback(() => {
    if (!activeDefinition || activeDefinition.required || !activeName) return;

    setAnswers((previous) => {
      const current = previous.get(activeName) ?? emptyAnswer;
      if (answersEqual(current, emptyAnswer)) return previous;
      const next = new Map(previous);
      next.set(activeName, emptyAnswer);
      return next;
    });
    setSkippedItems((previous) => new Set(previous).add(activeName));
    setInvalidName((previous) => (previous === activeName ? null : previous));
    const next = resolvedItems.slice(currentIndex + 1).find((candidate) => !candidate.disabled);
    if (next) setCurrentItem(next.name);
  }, [activeDefinition, activeName, currentIndex, resolvedItems, setCurrentItem]);

  const registerItem = React.useCallback((registration: RegisteredItem) => {
    setRegisteredItems((previous) => {
      const index = previous.findIndex((candidate) => candidate.name === registration.name);
      if (index < 0) return [...previous, registration];
      const next = [...previous];
      next[index] = registration;
      return next;
    });

    return () => {
      setRegisteredItems((previous) => previous.filter((candidate) => candidate.name !== registration.name));
    };
  }, []);

  const context = React.useMemo<QuestionnaireContextValue>(
    () => ({
      activeName,
      answerFor,
      choiceDisabledFor,
      current,
      disabledFor,
      goNext,
      goPrevious,
      invalidName,
      isFirst: !hasPreviousEnabledItem,
      isLast: !hasNextEnabledItem,
      registerItem,
      requiredFor,
      setChoice,
      setInput,
      shortcutFor,
      shortcuts,
      skipCurrent,
      statusFor,
      total: enabledItems.length,
    }),
    [
      activeName,
      answerFor,
      choiceDisabledFor,
      current,
      disabledFor,
      enabledItems.length,
      goNext,
      goPrevious,
      invalidName,
      hasNextEnabledItem,
      hasPreviousEnabledItem,
      registerItem,
      requiredFor,
      setChoice,
      setInput,
      shortcutFor,
      shortcuts,
      skipCurrent,
      statusFor,
    ],
  );

  return (
    <QuestionnaireContext.Provider value={context}>
      <form
        data-slot="questionnaire"
        className={cn('flex w-full min-w-0 flex-col gap-4', className)}
        noValidate={noValidate}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || !shortcuts || !activeName) return;

          const target = event.target as HTMLElement;
          if (target.matches('input:not([type="radio"]):not([type="checkbox"])')) return;

          const choice = items
            ?.find((candidate) => candidate.name === activeName)
            ?.choices?.find(
              (candidate, index) => formatShortcut(shortcuts, index)?.toLowerCase() === event.key.toLowerCase(),
            );
          if (!choice || choice.disabled) return;

          event.preventDefault();
          const control = Array.from(
            activeDefinition?.element?.querySelectorAll<HTMLInputElement>(
              'input[type="radio"], input[type="checkbox"]',
            ) ?? [],
          ).find((candidate) => candidate.value === choice.value && !candidate.disabled);

          if (control) control.click();
          else setChoice(activeName, choice.value, true, activeDefinition?.multiple ?? false);
        }}
        onSubmit={(event) => {
          if (!validateCurrent()) {
            event.preventDefault();
            return;
          }

          if (hasNextEnabledItem) {
            event.preventDefault();
            goNext();
            return;
          }

          if (!validateRequiredItems()) {
            event.preventDefault();
            return;
          }

          onSubmit?.(event);
        }}
        {...props}
      >
        {children}
      </form>
    </QuestionnaireContext.Provider>
  );
}

type QuestionnaireItemProps = Omit<React.ComponentProps<'fieldset'>, 'name'> & {
  invalid?: boolean;
  multiple?: boolean;
  name: string;
  onStatusChange?: (status: QuestionnaireItemStatus) => void;
  required?: boolean;
};

function QuestionnaireItem({
  'aria-describedby': ariaDescribedBy,
  children,
  className,
  disabled = false,
  invalid: invalidProp = false,
  multiple = false,
  name,
  onStatusChange,
  required = false,
  ...props
}: QuestionnaireItemProps) {
  const questionnaire = useQuestionnaire('QuestionnaireItem');
  const registerItem = questionnaire.registerItem;
  const setQuestionnaireChoice = questionnaire.setChoice;
  const setQuestionnaireInput = questionnaire.setInput;
  const getQuestionnaireChoiceDisabled = questionnaire.choiceDisabledFor;
  const getQuestionnaireShortcut = questionnaire.shortcutFor;
  const ref = React.useRef<HTMLFieldSetElement>(null);
  const [descriptionId, setDescriptionId] = React.useState<string>();
  const [errorId, setErrorId] = React.useState<string>();
  const active = questionnaire.activeName === name;
  const itemRequired = questionnaire.requiredFor(name, required);
  const itemDisabled = questionnaire.disabledFor(name, disabled);
  const answer = questionnaire.answerFor(name);
  const status = questionnaire.statusFor(name);
  const skipped = status === 'skipped';
  const invalid = invalidProp || questionnaire.invalidName === name;

  React.useLayoutEffect(
    () => registerItem({ disabled: itemDisabled, element: ref.current, multiple, name, required: itemRequired }),
    [itemDisabled, itemRequired, multiple, name, registerItem],
  );

  React.useEffect(() => onStatusChange?.(status), [onStatusChange, status]);

  const setChoice = React.useCallback(
    (value: string, selected: boolean) => setQuestionnaireChoice(name, value, selected, multiple),
    [multiple, name, setQuestionnaireChoice],
  );
  const setInput = React.useCallback(
    (value: string) => setQuestionnaireInput(name, value),
    [name, setQuestionnaireInput],
  );
  const shortcutFor = React.useCallback(
    (value: string) => getQuestionnaireShortcut(name, value),
    [getQuestionnaireShortcut, name],
  );
  const choiceDisabledFor = React.useCallback(
    (value: string, fallback: boolean) => getQuestionnaireChoiceDisabled(name, value, fallback),
    [getQuestionnaireChoiceDisabled, name],
  );

  const context = React.useMemo<QuestionnaireItemContextValue>(
    () => ({
      active,
      answer,
      choiceDisabledFor,
      invalid,
      multiple,
      name,
      required: itemRequired,
      skipped,
      setChoice,
      setDescriptionId,
      setErrorId,
      setInput,
      shortcutFor,
      shortcuts: questionnaire.shortcuts,
    }),
    [
      active,
      answer,
      choiceDisabledFor,
      invalid,
      itemRequired,
      multiple,
      name,
      questionnaire.shortcuts,
      setChoice,
      setInput,
      skipped,
      shortcutFor,
    ],
  );

  return (
    <QuestionnaireItemContext.Provider value={context}>
      <fieldset
        ref={ref}
        data-slot="questionnaire-item"
        data-active={active ? '' : undefined}
        data-status={status}
        aria-describedby={
          [ariaDescribedBy, descriptionId, invalid ? errorId : undefined].filter(Boolean).join(' ') || undefined
        }
        aria-invalid={invalid || undefined}
        className={cn('min-w-0 border-0 p-0 outline-none', className)}
        disabled={itemDisabled}
        hidden={!active}
        inert={!active}
        tabIndex={-1}
        {...props}
      >
        {children}
      </fieldset>
    </QuestionnaireItemContext.Provider>
  );
}

function QuestionnaireProgress({ children, className, ...props }: React.ComponentProps<'div'>) {
  const { current, total } = useQuestionnaire('QuestionnaireProgress');
  const label = total ? `Question ${current} of ${total}` : undefined;

  return (
    <div
      data-slot="questionnaire-progress"
      aria-label="Questionnaire progress"
      aria-live="polite"
      aria-valuemax={total || undefined}
      aria-valuemin={total ? 1 : undefined}
      aria-valuenow={current || undefined}
      aria-valuetext={label}
      className={cn('min-h-lh w-fit min-w-[14ch] font-medium text-muted-foreground tabular-nums', className)}
      role="progressbar"
      {...props}
    >
      {children ?? label}
    </div>
  );
}

function QuestionnaireTitle({ className, ...props }: React.ComponentProps<'legend'>) {
  return <legend data-slot="questionnaire-title" className={cn('font-semibold text-pretty', className)} {...props} />;
}

function QuestionnaireDescription({ id, className, ...props }: React.ComponentProps<'p'>) {
  const { setDescriptionId } = useQuestionnaireItem('QuestionnaireDescription');
  const generatedId = React.useId();
  const descriptionId = id ?? generatedId;

  React.useEffect(() => {
    setDescriptionId(descriptionId);
    return () => setDescriptionId(undefined);
  }, [descriptionId, setDescriptionId]);

  return (
    <p
      id={descriptionId}
      data-slot="questionnaire-description"
      className={cn('text-pretty text-muted-foreground', className)}
      {...props}
    />
  );
}

function QuestionnaireChoices({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="questionnaire-choices" className={cn('grid min-w-0 gap-2', className)} {...props} />;
}

type QuestionnaireChoiceProps = Omit<React.ComponentProps<'label'>, 'onChange'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
};

function QuestionnaireChoice({
  checked,
  children,
  className,
  defaultChecked = false,
  disabled = false,
  onChange,
  value,
  ...props
}: QuestionnaireChoiceProps) {
  const item = useQuestionnaireItem('QuestionnaireChoice');
  const setChoice = item.setChoice;
  const inputId = React.useId();
  const selected = checked ?? item.answer.choices.has(value);
  const choiceDisabled = item.choiceDisabledFor(value, disabled);
  const type = item.multiple ? 'checkbox' : 'radio';
  const shortcut = item.shortcutFor(value);

  React.useEffect(() => {
    if (choiceDisabled) {
      setChoice(value, false);
      return;
    }
    if (checked !== undefined) setChoice(value, checked);
    else if (defaultChecked) setChoice(value, true);
  }, [checked, choiceDisabled, defaultChecked, setChoice, value]);

  return (
    <label
      data-slot="questionnaire-choice"
      data-checked={selected ? '' : undefined}
      data-disabled={choiceDisabled ? '' : undefined}
      data-shortcut={shortcut ?? undefined}
      data-type={type}
      className={cn(
        `
          group relative flex min-h-11 cursor-pointer items-start gap-3 rounded-md border
          border-(--glass-edge) bg-card/50 p-3 text-start transition-colors select-none
          focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 hover:bg-accent/30
          data-checked:border-primary/50 data-checked:bg-primary/10
          data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50
        `,
        className,
      )}
      {...props}
    >
      <input
        id={inputId}
        data-slot="questionnaire-choice-input"
        aria-invalid={item.invalid || undefined}
        checked={selected}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
        disabled={choiceDisabled}
        name={item.skipped ? undefined : item.name}
        required={item.required && !item.multiple}
        type={type}
        value={value}
        onChange={(event) => {
          item.setChoice(value, event.target.checked);
          onChange?.(event);
        }}
      />
      <span
        aria-hidden="true"
        className={cn(
          `
            pointer-events-none mt-0.5 flex size-4 shrink-0 items-center justify-center border border-input
            bg-background/60 text-primary transition-colors
          `,
          type === 'radio' ? 'rounded-full' : 'rounded-[4px]',
          selected && 'border-primary bg-primary text-primary-foreground',
        )}
      >
        {selected ? (
          type === 'radio' ? (
            <span className="size-1.5 rounded-full bg-current" />
          ) : (
            <span className="text-xs leading-none">✓</span>
          )
        ) : null}
      </span>
      <span data-slot="questionnaire-choice-label" className="flex min-w-0 flex-1 flex-col leading-snug">
        {children}
      </span>
      {shortcut ? (
        <span aria-hidden="true" className="ml-auto shrink-0 text-xs text-muted-foreground">
          {shortcut}
        </span>
      ) : null}
    </label>
  );
}

function QuestionnaireChoiceDescription({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

type QuestionnaireInputProps = Omit<React.ComponentProps<'input'>, 'name' | 'type'> & {
  type?: React.HTMLInputTypeAttribute;
};

function QuestionnaireInput({
  className,
  defaultValue,
  onChange,
  type = 'text',
  value,
  ...props
}: QuestionnaireInputProps) {
  const item = useQuestionnaireItem('QuestionnaireInput');
  const setInput = item.setInput;
  const initialValue = typeof defaultValue === 'string' || typeof defaultValue === 'number' ? String(defaultValue) : '';
  const controlledValue = value === undefined || value === null ? undefined : String(value);
  const disabled = Boolean(props.disabled);
  const fileInput = type === 'file';

  React.useEffect(() => {
    if (disabled || fileInput) {
      setInput('');
      return;
    }
    if (controlledValue !== undefined) setInput(controlledValue);
    else if (initialValue) setInput(initialValue);
  }, [controlledValue, disabled, fileInput, initialValue, setInput]);

  return (
    <input
      data-slot="questionnaire-input"
      aria-invalid={item.invalid || undefined}
      className={cn(
        `
          input-glass flex h-11 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1
          text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary
          selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring
          focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed
          disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm
          dark:aria-invalid:ring-destructive/40
        `,
        className,
      )}
      disabled={disabled}
      name={item.skipped || item.answer.choices.size > 0 ? undefined : item.name}
      type={type}
      value={fileInput ? undefined : (value ?? item.answer.input)}
      onChange={(event) => {
        item.setInput(fileInput && event.target.files?.length ? 'file' : event.target.value);
        onChange?.(event);
      }}
      {...props}
    />
  );
}

function QuestionnaireError({ children, className, id, ...props }: React.ComponentProps<'p'>) {
  const { invalid, required, setErrorId } = useQuestionnaireItem('QuestionnaireError');
  const generatedId = React.useId();
  const errorId = id ?? generatedId;

  React.useEffect(() => {
    setErrorId(errorId);
    return () => setErrorId(undefined);
  }, [errorId, setErrorId]);

  return (
    <p
      id={errorId}
      data-slot="questionnaire-error"
      className={cn('text-sm text-destructive', className)}
      hidden={!invalid}
      role={invalid ? 'alert' : undefined}
      {...props}
    >
      {children ?? (required ? 'Choose an answer to continue.' : 'Choose an answer or skip this question.')}
    </p>
  );
}

function QuestionnaireActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn('grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2', className)}
      {...props}
    />
  );
}

type QuestionnaireNavigationProps = React.ComponentProps<typeof Button>;

function QuestionnairePrevious({ children, className, onClick, ...props }: QuestionnaireNavigationProps) {
  const questionnaire = useQuestionnaire('QuestionnairePrevious');
  const visible = questionnaire.total > 1 && !questionnaire.isFirst;

  return (
    <Button
      data-slot="questionnaire-previous"
      variant="outline"
      type="button"
      className={cn('col-start-1 row-start-1 min-h-11 justify-self-start', className)}
      hidden={!visible}
      inert={!visible}
      tabIndex={visible ? props.tabIndex : -1}
      aria-hidden={!visible || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) questionnaire.goPrevious();
      }}
      {...props}
    >
      {children ?? 'Previous'}
    </Button>
  );
}

function QuestionnaireSkip({ children, className, onClick, ...props }: QuestionnaireNavigationProps) {
  const questionnaire = useQuestionnaire('QuestionnaireSkip');
  const visible = questionnaire.total > 0 && !questionnaire.requiredFor(questionnaire.activeName ?? '', false);

  return (
    <Button
      data-slot="questionnaire-skip"
      variant="outline"
      type="button"
      className={cn('col-start-2 row-start-1 min-h-11 justify-self-end', className)}
      hidden={!visible}
      inert={!visible}
      tabIndex={visible ? props.tabIndex : -1}
      aria-hidden={!visible || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) questionnaire.skipCurrent();
      }}
      {...props}
    >
      {children ?? 'Skip'}
    </Button>
  );
}

function QuestionnaireNext({ children, className, onClick, ...props }: QuestionnaireNavigationProps) {
  const questionnaire = useQuestionnaire('QuestionnaireNext');
  const visible = questionnaire.total > 1 && !questionnaire.isLast;

  return (
    <Button
      data-slot="questionnaire-next"
      type="button"
      className={cn('col-start-3 row-start-1 min-h-11 justify-self-end', className)}
      hidden={!visible}
      inert={!visible}
      tabIndex={visible ? props.tabIndex : -1}
      aria-hidden={!visible || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) questionnaire.goNext();
      }}
      {...props}
    >
      {children ?? 'Next'}
    </Button>
  );
}

function QuestionnaireSubmit({ children, className, ...props }: QuestionnaireNavigationProps) {
  const questionnaire = useQuestionnaire('QuestionnaireSubmit');
  const visible = questionnaire.total > 0 && questionnaire.isLast;

  return (
    <Button
      data-slot="questionnaire-submit"
      type="submit"
      className={cn('col-start-3 row-start-1 min-h-11 justify-self-end', className)}
      hidden={!visible}
      inert={!visible}
      tabIndex={visible ? props.tabIndex : -1}
      aria-hidden={!visible || undefined}
      {...props}
    >
      {children ?? 'Submit'}
    </Button>
  );
}

function formatShortcut(mode: QuestionnaireShortcutMode, index: number) {
  if (mode === 'letters') return index < 26 ? String.fromCharCode(65 + index) : null;

  return index < 9 ? String(index + 1) : null;
}

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
};

export type {
  QuestionnaireChoiceDefinition,
  QuestionnaireItemDefinition,
  QuestionnaireItemStatus,
  QuestionnaireProps,
  QuestionnaireShortcutMode,
};
