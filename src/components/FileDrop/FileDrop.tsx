import * as React from 'react';
import Dropzone, { DropzoneOptions, DropzoneRootProps, useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils';

// export interface FileDropProps extends DropzoneProps {}

// export interface ServerFile extends FileWithPath {
//   id?: string;
// }

const FILEDROP_NAME = 'FileDrop';

export type FileDropProps = React.ComponentPropsWithoutRef<typeof Dropzone> & DropzoneOptions & DropzoneRootProps;

const FileDrop = React.forwardRef<HTMLDivElement, FileDropProps>(({ className, children, ...props }, ref) => {
  const { getRootProps, isDragAccept, isFocused, isDragReject } = useDropzone(props);
  const style = React.useMemo(
    () =>
      `${isDragAccept ? 'border-green-400/30' : ''} ${isFocused ? 'border-input' : ''} ${
        isDragReject ? 'border-red-400/30' : ''
      }`,
    [isFocused, isDragAccept, isDragReject],
  );

  const dragOpacity = React.useMemo(() => (isDragAccept ? '' : '/30'), [isDragAccept]);

  return <div {...getRootProps(props)} ref={ref} children={children} />;
  return (
    <div>
      <div
        ref={ref}
        className={cn(
          `bg-primary-foreground${dragOpacity} flex-col items-center border-2 border-dashed border-primary-foreground${dragOpacity} rounded transition .24s ease-in-out flex p-5 ${style}`,
          className,
        )}
        {...getRootProps(props)}
        children={children}
      />
    </div>
  );
});

FileDrop.displayName = 'FileDrop';

const FileDropArea = React.forwardRef<HTMLDivElement, DropzoneOptions & React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }) => {
    const { getInputProps, isDragAccept, isFocused, isDragReject } = useDropzone(props);

    const style = React.useMemo(
      () =>
        `${isDragAccept ? 'border-green-400/30' : ''} ${isFocused ? 'border-input' : ''} ${
          isDragReject ? 'border-red-400/30' : ''
        }`,
      [isFocused, isDragAccept, isDragReject],
    );

    const dragOpacity = React.useMemo(() => (isDragAccept ? '' : '/30'), [isDragAccept]);
    console.log('rendered');
    return (
      <div
        className={cn(
          `bg-primary-foreground${dragOpacity} flex-col items-center border-2 border-dashed border-primary-foreground${dragOpacity} rounded transition .24s ease-in-out flex p-5 ${style}`,
          className,
        )}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    );
  },
);

FileDropArea.displayName = 'FileDropArea';

const FileDropAreaText = React.forwardRef<HTMLParagraphElement, React.ParamHTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn(className)} {...props} />;
  },
);

FileDropAreaText.displayName = 'FileDropAreaText';

export { FileDrop, FileDropArea, FileDropAreaText };
