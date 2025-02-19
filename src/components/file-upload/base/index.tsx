import { cn } from '@/lib/utils';
import request from '@/utils/fetch';
import * as React from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/react/lib/Dashboard';
import Xhr from '@uppy/xhr-upload';
import { useState } from 'react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

function createUppy() {
  return new Uppy().use(Xhr, { endpoint: '/api/fileUpload' });
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    action: string;
    multiple?: boolean;
    onBeforUpload?: (files: File[]) => boolean;
    onUploadSuccess?: (res: any) => any;
  }
>(
  (
    {
      className,
      action,
      accept,
      type = 'file',
      multiple = false,
      onBeforUpload,
      onUploadSuccess,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef(null);
    const handleChange = async (e: React.ChangeEvent) => {
      const files = Array.from((e.target as any).files) as File[];
      Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          if (onBeforUpload && !onBeforUpload(files)) return;
          const res = await request('/api/fileUpload', {
            method: 'POST',
            body: formData,
          });
          return res;
        }),
      ).then((res) => {
        const toClientResult = {
          code: 200,
          msg: 'File Upload Success',
          data: res.map((item) => ({
            fileName: item.data?.fileName,
            filePath: item.data?.filePath,
          })),
        };
        onUploadSuccess && onUploadSuccess(toClientResult);
      });
    };
    React.useEffect(() => {
      ref = inputRef;
    }, []);
    return (
      <input
        type="file"
        className={cn(
          'cursor-pointer flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50',
          type === 'search' &&
            '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
          type === 'file' &&
            'p-0 pr-3 italic file:cursor-pointer  text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground',
          className,
        )}
        accept={accept}
        ref={inputRef}
        onChange={handleChange}
        {...props}
        multiple={multiple}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
