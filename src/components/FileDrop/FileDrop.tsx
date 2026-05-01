'use client';

import * as React from 'react';
import { XCircle } from 'lucide-react';
import {
  useDropzone,
  type DropzoneOptions,
  type DropzoneState,
  type FileError,
  type FileWithPath,
} from 'react-dropzone';

import { cn, formatBytes } from '@/lib/utils';

import { createContextScope, Scope } from '../../lib/createContext';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '../Item';

export interface FileWithServerId extends FileWithPath {
  id?: string;
}

export interface DropFileInfo {
  file: FileWithServerId;
  key: string;
  errors?: FileError[];
}

/**
 * File Drop
 */
const FILEDROP_NAME = 'FileDrop';
type ScopedProps<P> = P & { __scopeFileDrop?: Scope };
const [createFileDropContext, createFileDropScope] = createContextScope(FILEDROP_NAME);

type FileDropProps = React.PropsWithChildren<
  DropzoneOptions & {
    className?: string;
    files: FileWithServerId[];
    onChange: (files: FileWithServerId[]) => void;
  }
>;
type FileDropContextValue = DropzoneState & {
  files: DropFileInfo[];
  add: (files: File[]) => void;
  remove: (file: DropFileInfo) => void;
  disabled?: boolean;
};

const [FileDropProvider, useFileDropContext] = createFileDropContext<FileDropContextValue>(FILEDROP_NAME);

const getFileKey = (file: FileWithServerId, index: number) =>
  file.id ?? `${file.name}-${file.size}-${file.lastModified}-${index}`;

const toDropFileInfo = (files: FileWithServerId[]): DropFileInfo[] => {
  return files.map((file, index) => ({ file, key: getFileKey(file, index) }));
};

const appendFiles = (files: FileWithServerId[], nextFiles: File[]) => [...files, ...(nextFiles as FileWithServerId[])];

function FileDrop({ ...props }: ScopedProps<FileDropProps>) {
  const {
    __scopeFileDrop,
    className,
    children,
    files,
    onChange,
    disabled,
    onDrop,
    onDropAccepted,
    onDropRejected,
    ...dropzoneOptions
  } = props;

  const add = React.useCallback(
    (nextFiles: File[]) => {
      if (disabled) return;
      onChange(appendFiles(files, nextFiles));
    },
    [disabled, files, onChange],
  );

  const remove = React.useCallback(
    (dropFile: DropFileInfo) => {
      if (disabled) return;
      onChange(files.filter((file, index) => getFileKey(file, index) !== dropFile.key));
    },
    [disabled, files, onChange],
  );

  const dropzoneProps = useDropzone({
    ...dropzoneOptions,
    disabled,
    onDrop: (acceptedFiles, fileRejections, event) => {
      onDrop?.(acceptedFiles, fileRejections, event);
    },
    onDropAccepted: (acceptedFiles, event) => {
      onDropAccepted?.(acceptedFiles, event);
      add(acceptedFiles);
    },
    onDropRejected: (fileRejections, event) => {
      onDropRejected?.(fileRejections, event);
    },
  });

  return (
    <FileDropProvider
      {...dropzoneProps}
      disabled={disabled}
      remove={remove}
      add={add}
      files={toDropFileInfo(files)}
      scope={__scopeFileDrop}
    >
      <div data-slot="file-drop" className={cn('flex w-full flex-col gap-3', className)}>
        {children}
      </div>
    </FileDropProvider>
  );
}

/**
 * File Drop Area Content
 */
const FILE_DROP_AREA_NAME = 'FileDropArea';

type FileDropAreaProps = React.ComponentProps<'div'>;

function FileDropArea({ ...props }: ScopedProps<FileDropAreaProps>) {
  const { children, className, __scopeFileDrop, ...areaProps } = props;
  const context = useFileDropContext(FILE_DROP_AREA_NAME, __scopeFileDrop);
  const { getInputProps, getRootProps, isDragAccept, isFocused, isDragReject, isDragActive, disabled } = context;

  const rootClassName = cn(
    `
      glass-card flex w-full flex-col items-center rounded-2xl border p-6
      transition-[background-color,border-color,box-shadow,opacity] duration-200 ease-in-out
    `,
    isDragAccept && 'shadow-frost-glow border-primary/40 bg-primary/10',
    isFocused && 'ring-[3px] ring-ring/50',
    isDragReject && 'border-destructive/40 bg-destructive/10',
    isDragActive && !isDragAccept && !isDragReject && 'bg-accent/10',
    disabled && 'cursor-not-allowed opacity-50',
    className,
  );

  const rootProps = getRootProps({
    ...areaProps,
    'aria-disabled': disabled || undefined,
    className: rootClassName,
    'data-disabled': disabled || undefined,
  });

  return (
    <div data-slot="file-drop-area" {...rootProps}>
      <input data-slot="file-drop-input" {...getInputProps()} />
      {children}
    </div>
  );
}

/**
 * File Drop Area Text Content
 */
function FileDropAreaText({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="file-drop-area-text" className={cn(className)} {...props} />;
}

/**
 * File Drop File Area Content
 */
type FileDropFileAreaChildProps = {
  files: DropFileInfo[];
};
type FileDropFilesAreaProps = {
  renderRows?: (props: FileDropFileAreaChildProps) => React.ReactNode;
};

function FileDropFileArea({ ...props }: ScopedProps<FileDropFilesAreaProps>) {
  const context = useFileDropContext(FILE_DROP_AREA_NAME, props.__scopeFileDrop);
  const { files } = context;
  const { renderRows } = props;

  const params = { files } satisfies FileDropFileAreaChildProps;
  const list = files?.map((file) => (
    <FileDropFileItem key={file.key} fileInfo={file}>
      <FileDropFileItemContent />
      <FileDropFileItemRemove />
    </FileDropFileItem>
  ));
  return renderRows ? renderRows(params) : <ItemGroup className="w-full gap-2">{list}</ItemGroup>;
}

/**
 * File Drop File Item
 */
const FILE_DROP_FILE_ITEM_NAME = 'FileDropFileItem';
type FileDropFileItemContextValue = {
  disabled?: boolean;
  fileInfo: DropFileInfo;
};
const [FileDropFileItemProvider, useFileDropFileItemContext] =
  createFileDropContext<FileDropFileItemContextValue>(FILE_DROP_FILE_ITEM_NAME);

type FileDropFileItemProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  fileInfo: DropFileInfo;
};
function FileDropFileItem({ ...props }: ScopedProps<FileDropFileItemProps>) {
  const { __scopeFileDrop, className, children, fileInfo, ...fileItemProps } = props;
  return (
    <FileDropFileItemProvider fileInfo={fileInfo} scope={__scopeFileDrop}>
      <Item
        {...fileItemProps}
        variant="outline"
        size="sm"
        className={cn(
          `
            glass-control-muted w-full flex-nowrap items-center
          `,
          className,
        )}
      >
        {children}
      </Item>
    </FileDropFileItemProvider>
  );
}

/**
 * FileDropFileItemRemove
 */
const FILE_DROP_FILE_ITEM_REMOVE_NAME = 'FileDropFileItemRemove';
type FileDropFileItemRemoveProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onRemove?: (file: FileWithServerId | DropFileInfo) => void;
};
function FileDropFileItemRemove({ ...props }: ScopedProps<FileDropFileItemRemoveProps>) {
  const { className, onClick, onRemove, disabled: buttonDisabled, __scopeFileDrop, ...buttonProps } = props;
  const { remove, disabled } = useFileDropContext(FILE_DROP_FILE_ITEM_REMOVE_NAME, props.__scopeFileDrop);
  const { fileInfo } = useFileDropFileItemContext(FILE_DROP_FILE_ITEM_REMOVE_NAME, __scopeFileDrop);
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClick?.(event);
      if (event.defaultPrevented || disabled || buttonDisabled) return;
      if (onRemove) {
        onRemove(fileInfo);
        return;
      }
      remove(fileInfo);
    },
    [buttonDisabled, disabled, fileInfo, onClick, onRemove, remove],
  );

  return (
    <ItemActions className="ml-auto shrink-0">
      <button
        {...buttonProps}
        aria-label={`Remove ${fileInfo.file.name}`}
        className={cn(
          `
            inline-flex size-7 items-center justify-center rounded-md
            text-destructive/90 transition-colors hover:text-destructive
            disabled:pointer-events-none disabled:opacity-50
          `,
          className,
        )}
        data-slot="file-drop-remove"
        disabled={disabled || buttonDisabled}
        onClick={handleClick}
        type="button"
      >
        <XCircle aria-hidden="true" className="size-4" />
      </button>
    </ItemActions>
  );
}

/**
 *
 */
const FILE_DROP_FILE_ITEM_CONTENT_NAME = 'FileDropFileItemContent';
type FileDropFileItemContentProps = React.HtmlHTMLAttributes<HTMLDivElement>;

function FileDropFileItemContent({ className, __scopeFileDrop, ...props }: ScopedProps<FileDropFileItemContentProps>) {
  const { fileInfo } = useFileDropFileItemContext(FILE_DROP_FILE_ITEM_CONTENT_NAME, __scopeFileDrop);
  const file = fileInfo.file;
  const details = [formatBytes(file.size, 0), file.type].filter(Boolean).join(' • ');
  return (
    <ItemContent className={cn('min-w-0 gap-0.5', className)} {...props}>
      <ItemTitle className="w-full min-w-0 truncate text-sm font-medium">{file.name}</ItemTitle>
      <ItemDescription className="line-clamp-1 text-xs text-muted-foreground/70">{details}</ItemDescription>
    </ItemContent>
  );
}

/**
 * Export
 */
export {
  FileDrop,
  FileDropArea,
  FileDropAreaText,
  FileDropFileArea,
  FileDropFileItem,
  FileDropFileItemRemove,
  FileDropFileItemContent,
  createFileDropScope,
};
