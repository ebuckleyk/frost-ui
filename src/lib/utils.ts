import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

//import type { Config } from 'tailwindcss';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @see https://gist.github.com/zentala/1e6f72438796d74531803cc3833c039c
 * @param bytes
 * @param decimals
 * @returns
 */
export const formatBytes = (bytes: number, decimals: number): string => {
  if (bytes == 0) return '0 Bytes';
  const k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// export const useBreakpoint<K extends BreakpointKey>

export const getInitials = (text: string): string => {
  if (!text) return '';
  return (
    text
      .match(/(\b\S)?/g)
      ?.join('')
      .match(/(^\S|\S$)?/g)
      ?.join('') ?? ''
  );
};
