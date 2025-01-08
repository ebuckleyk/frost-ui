import * as React from 'react';
import { XCircle } from 'lucide-react';
import { DropzoneState, FileWithPath, useDropzone, type DropzoneOptions, type FileError } from 'react-dropzone';

import { createContextScope, Scope } from '@/lib/createContext';
import { cn, formatBytes } from '@/lib/utils';

import { Card } from '../Card';

export interface FileWithServerId extends FileWithPath {
  id?: string;
}

export interface DropFileInfo {
  file: FileWithServerId;
  errors?: FileError[];
  _index?: number;
}

/**
 * File Drop
 */
const FILEDROP_NAME = 'FileDrop';
type ScopedProps<P> = P & { __scopeFileDrop?: Scope };
const [createFileDropContext, createFileDropScope] = createContextScope(FILEDROP_NAME);

type FileDropProps = React.PropsWithChildren<DropzoneOptions & { files?: FileWithServerId[] }> &
  Pick<React.HtmlHTMLAttributes<HTMLDivElement>, 'className' | 'children'> & {
    files?: FileWithServerId[] | undefined;
    onChange?: (files: FileWithServerId[]) => void;
  };
type FileDropElement = React.ElementRef<'div'>;
type FileDropContextValue = DropzoneState & {
  files?: DropFileInfo[] | undefined;
  remove?: (file: DropFileInfo) => void;
  add: (files: File[]) => void;
  disabled?: boolean;
};
type FileDropState = {
  stateFiles?: DropFileInfo[] | undefined;
};

const [FileDropProvider, useFileDropContext] = createFileDropContext<FileDropContextValue>(FILEDROP_NAME);

const fileToDropFile = (files?: FileWithServerId[] | undefined, indexStart = 0): DropFileInfo[] | undefined => {
  return files?.map((f, idx) => ({ file: f, _index: idx + indexStart }));
};

const FileDrop = React.forwardRef<FileDropElement, FileDropProps>((props: ScopedProps<FileDropProps>, forwardRef) => {
  const { __scopeFileDrop, className, children, files, disabled, onChange } = props;
  const [fileDropState, setFileDropState] = React.useState<FileDropState>({
    stateFiles: fileToDropFile(files),
  });
  const dropzoneProps = useDropzone(props);
  const providerProps = React.useMemo(() => dropzoneProps, [dropzoneProps]);
  const { stateFiles } = fileDropState;

  const remove = React.useCallback((dropFile: DropFileInfo) => {
    setFileDropState((prevState) => ({
      ...prevState,
      stateFiles: prevState.stateFiles?.filter((x) => dropFile._index !== x._index),
    }));
  }, []);

  const add = React.useCallback((files: File[]) => {
    setFileDropState((prevState) => {
      const nextIndex = prevState.stateFiles?.length ?? 0;
      const dropFiles = fileToDropFile(files, nextIndex);
      return {
        ...prevState,
        stateFiles: [...(prevState.stateFiles ?? []), ...(dropFiles || [])],
      };
    });
  }, []);

  React.useEffect(() => {
    if (onChange) {
      onChange(stateFiles?.map((x) => x.file) ?? []);
    }
  }, [onChange, stateFiles]);

  return (
    <FileDropProvider
      {...providerProps}
      disabled={disabled}
      remove={remove}
      add={add}
      files={fileDropState.stateFiles}
      scope={__scopeFileDrop}
    >
      <div ref={forwardRef} className={cn(className)} children={children} />
    </FileDropProvider>
  );
});

FileDrop.displayName = FILEDROP_NAME;

/**
 * File Drop Area Content
 */
const FILE_DROP_AREA_NAME = 'FileDropArea';

type FileDropAreaProps = Partial<DropzoneState> & React.PropsWithChildren & React.HtmlHTMLAttributes<HTMLDivElement>;
type FileDropAreaElement = React.ElementRef<'div'>;

const FileDropArea = React.forwardRef<FileDropAreaElement, FileDropAreaProps>(
  (props: ScopedProps<FileDropAreaProps>, forwardRef) => {
    const { children, __scopeFileDrop } = props;
    const context = useFileDropContext(FILE_DROP_AREA_NAME, __scopeFileDrop);
    const { getInputProps, getRootProps, isDragAccept, isFocused, isDragReject, isDragActive, acceptedFiles, add } =
      context;

    const style = React.useMemo(
      () =>
        `${isDragAccept ? 'border-primary/40 bg-primary/30' : ''} ${isFocused ? 'border-input' : ''} ${
          isDragReject ? 'border-destructive/40 bg-destructive/30' : ''
        }`,
      [isFocused, isDragAccept, isDragReject],
    );

    const dragOpacity = React.useMemo(() => (isDragActive ? '' : '/30'), [isDragActive]);

    React.useEffect(() => {
      add(acceptedFiles as FileWithPath[]); //look into
    }, [acceptedFiles, add]);

    return (
      <div
        className={cn(
          `bg-primary-foreground${dragOpacity} flex-col items-center border-2 border-dashed border-primary-foreground${dragOpacity} rounded transition .24s ease-in-out flex p-5 ${style}`,
          props.className,
        )}
        ref={forwardRef}
        {...getRootProps(props)}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    );
  },
);

FileDropArea.displayName = FILE_DROP_AREA_NAME;

/**
 * File Drop Area Text Content
 */
const FILE_DROP_AREA_TEXT_NAME = 'FileDropAreaText';

const FileDropAreaText = React.forwardRef<HTMLParagraphElement, React.ParamHTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn(className)} {...props} />;
  },
);

FileDropAreaText.displayName = FILE_DROP_AREA_TEXT_NAME;

/**
 * File Drop File Area Content
 */
const FILE_DROP_FILES_AREA_NAME = 'FileDropFileArea';
type FileDropFileAreaChildProps = {
  files: DropFileInfo[] | undefined;
};
type FileDropFilesAreaProps = {
  renderRows?: (props: FileDropFileAreaChildProps) => React.ReactNode;
};

const FileDropFileArea: React.FC<FileDropFilesAreaProps> = (props: ScopedProps<FileDropFilesAreaProps>) => {
  const context = useFileDropContext(FILE_DROP_AREA_NAME, props.__scopeFileDrop);
  const { files } = context;
  const { renderRows } = props;

  const params = { files } satisfies FileDropFileAreaChildProps;
  const list = files?.map((file) => (
    <FileDropFileItem key={file._index} fileInfo={file}>
      <FileDropFileItemContent />
      <FileDropFileItemRemove />
    </FileDropFileItem>
  ));
  return renderRows ? renderRows(params) : list;
};
FileDropFileArea.displayName = FILE_DROP_FILES_AREA_NAME;

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
const FileDropFileItem: React.FC<FileDropFileItemProps> = (props: ScopedProps<FileDropFileItemProps>) => {
  const { __scopeFileDrop, className, children, fileInfo, ...fileItemProps } = props;
  return (
    <FileDropFileItemProvider fileInfo={fileInfo} scope={__scopeFileDrop}>
      <Card
        {...fileItemProps}
        className={cn(
          'flex flex-row border-primary/40 bg-opacity-90 mt-1 items-center border h-[45px] w-full rounded p-1',
          className,
        )}
        children={children}
      />
    </FileDropFileItemProvider>
  );
};

FileDropFileItem.displayName = FILE_DROP_FILE_ITEM_NAME;

/**
 * FileDropFileItemRemove
 */
const FILE_DROP_FILE_ITEM_REMOVE_NAME = 'FileDropFileItemRemove';
type FileDropFileItemRemoveProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  onRemove?: (file: FileWithServerId | DropFileInfo) => void;
};
const FileDropFileItemRemove: React.FC<FileDropFileItemRemoveProps> = (
  props: ScopedProps<FileDropFileItemRemoveProps>,
) => {
  const { className, __scopeFileDrop } = props;
  const { remove, disabled } = useFileDropContext(FILE_DROP_FILE_ITEM_REMOVE_NAME, props.__scopeFileDrop);
  const { fileInfo } = useFileDropFileItemContext(FILE_DROP_FILE_ITEM_REMOVE_NAME, __scopeFileDrop);
  const onRemove = React.useCallback(() => {
    if (disabled) return;
    props.onRemove ? props.onRemove(fileInfo) : remove && remove(fileInfo);
  }, [fileInfo, props, remove, disabled]);

  const styles = React.useMemo(() => (disabled ? 'opacity-0' : 'hover:cursor-pointer'), [disabled]);

  return (
    <XCircle className={cn(`flex-auto mr-1 h-6 w-1/6 text-destructive/90 ${styles}`, className)} onClick={onRemove} />
  );
};

FileDropFileItemRemove.displayName = FILE_DROP_FILE_ITEM_REMOVE_NAME;

/**
 *
 */
const FILE_DROP_FILE_ITEM_CONTENT_NAME = 'FileDropFileItemContent';
type FileDropFileItemContentProps = React.HtmlHTMLAttributes<HTMLDivElement>;
const FileDropFileItemContent: React.FC<FileDropFileItemContentProps> = (
  props: ScopedProps<FileDropFileItemContentProps>,
) => {
  const { className, __scopeFileDrop } = props;
  const { fileInfo } = useFileDropFileItemContext(FILE_DROP_FILE_ITEM_CONTENT_NAME, __scopeFileDrop);
  const file = fileInfo.file;
  return (
    <div
      className={cn('flex flex-col flex-3 w-5/6 break-words truncate overflow-hidden hover:cursor-pointer', className)}
    >
      <p className="text-sm">{file.name}</p>
      <div className="flex flex-row space-x-1 text-xs opacity-50">
        <p>{formatBytes(file.size, 0)}</p>
        <p>{file.type}</p>
      </div>
    </div>
  );
};

FileDropFileItemContent.displayName = FILE_DROP_FILE_ITEM_CONTENT_NAME;

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
