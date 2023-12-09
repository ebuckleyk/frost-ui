import * as React from 'react';
import Dropzone, { DropzoneOptions, DropzoneRootProps, DropzoneState, useDropzone } from 'react-dropzone';

import { createContextScope, Scope } from '@/lib/createContext';
import { cn } from '@/lib/utils';

// export interface FileDropProps extends DropzoneProps {}

// export interface ServerFile extends FileWithPath {
//   id?: string;
// }

const FILEDROP_NAME = 'FileDrop';
type ScopedProps<P> = P & { __scopeFileDrop?: Scope };
const [createFileDropContext, createFileDropScope] = createContextScope(FILEDROP_NAME);

export type FileDropProps = React.ComponentPropsWithoutRef<typeof Dropzone> & DropzoneOptions & DropzoneRootProps;

type FileDropContextValue = DropzoneState;

const [FileDropProvider, useFileDropContext] = createFileDropContext<FileDropContextValue>(FILEDROP_NAME);

const FileDrop = React.forwardRef<HTMLDivElement, FileDropProps>((props: ScopedProps<FileDropProps>, forwardRef) => {
  const { __scopeFileDrop, className, children } = props;

  const dropzoneProps = useDropzone(props);
  const providerProps = React.useMemo(() => dropzoneProps, [dropzoneProps]);

  return (
    <FileDropProvider {...providerProps} scope={__scopeFileDrop}>
      <div ref={forwardRef} {...providerProps.getRootProps(props)} className={cn(className)} children={children} />
    </FileDropProvider>
  );
});

FileDrop.displayName = FILEDROP_NAME;

const FILE_DROP_AREA_NAME = 'FileDropArea';

type FileDropAreaProps = Partial<DropzoneState> & React.PropsWithChildren & React.HtmlHTMLAttributes<HTMLDivElement>;
type FileDropAreaElement = React.ElementRef<'div'>;

const FileDropArea = React.forwardRef<FileDropAreaElement, FileDropAreaProps>(
  (props: ScopedProps<FileDropAreaProps>, forwardRef) => {
    const context = useFileDropContext(FILE_DROP_AREA_NAME, props.__scopeFileDrop);
    const { getInputProps, isDragAccept, isFocused, isDragReject, isDragActive } = context;

    const style = React.useMemo(
      () =>
        `${isDragAccept ? 'border-primary/40 bg-primary/30' : ''} ${isFocused ? 'border-input' : ''} ${
          isDragReject ? 'border-destructive/40 bg-destructive/30' : ''
        }`,
      [isFocused, isDragAccept, isDragReject],
    );

    const dragOpacity = React.useMemo(() => (isDragActive ? '' : '/30'), [isDragActive]);

    return (
      <div
        className={cn(
          `bg-primary-foreground${dragOpacity} flex-col items-center border-2 border-dashed border-primary-foreground${dragOpacity} rounded transition .24s ease-in-out flex p-5 ${style}`,
          props.className,
        )}
        ref={forwardRef}
      >
        <input {...getInputProps()} />
        {props.children}
      </div>
    );
  },
);

FileDropArea.displayName = FILE_DROP_AREA_NAME;

const FILE_DROP_AREA_TEXT_NAME = 'FileDropAreaText';
const FileDropAreaText = React.forwardRef<HTMLParagraphElement, React.ParamHTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn(className)} {...props} />;
  },
);

FileDropAreaText.displayName = FILE_DROP_AREA_TEXT_NAME;

export { FileDrop, FileDropArea, FileDropAreaText, createFileDropScope };
