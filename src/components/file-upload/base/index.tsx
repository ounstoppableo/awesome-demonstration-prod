import { cn } from '@/lib/utils';
import request from '@/utils/fetch';
import * as React from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/react/lib/Dashboard';
import Xhr from '@uppy/xhr-upload';
import { useState } from 'react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { CircleX } from 'lucide-react';

function createUppy() {
  return new Uppy().use(Xhr, { endpoint: '/api/fileUpload' });
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    action: string;
    multiple?: boolean;
    value: string;
    onBeforUpload?: (files: File[]) => boolean;
    onUploadSuccess?: (res: any) => any;
  }
>(
  (
    {
      className,
      action,
      accept,
      value,
      type = 'file',
      multiple = false,
      onBeforUpload,
      onUploadSuccess,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef(null);
    const [_value, setValue] = useState(value);
    const handleChange = async (e: React.ChangeEvent) => {
      const files = Array.from((e.target as any).files) as File[];
      if (files.length === 0) return;
      handleUploadFiles(files);
    };

    const handleUploadFiles = (files: File[]) => {
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
        setValue(res.map((item) => item.data?.filePath).join(','));
        inputRef.current &&
          toClientResult.data.length === 0 &&
          ((inputRef.current as any).value = '');
        onUploadSuccess && onUploadSuccess(toClientResult);
      });
    };
    React.useEffect(() => {
      ref = inputRef;
    }, []);
    return (
      <div className="relative">
        <input
          type="file"
          className={cn(
            'cursor-pointer flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          accept={accept}
          ref={inputRef}
          onChange={handleChange}
          {...props}
          multiple={multiple}
        />
        <div className="select-none text-sm absolute right-0 top-0 h-full w-full bg-background justify-center items-center border rounded-lg overflow-hidden flex">
          <div
            onClick={() => (inputRef.current as any)?.click()}
            className="cursor-pointer text-foreground not-italic font-medium bg-transparent border-input border-solid border-r h-full flex justify-center items-center px-3 py-2"
          >
            Select File
          </div>
          <div
            className="flex-1 px-3 py-2 text-muted-foreground/70 truncate"
            title={_value}
          >
            {_value ? _value : 'No file have been selected'}
          </div>
          {_value ? (
            <div
              className="absolute text-sm text-muted-foreground/70 right-2 cursor-pointer"
              onClick={() => handleUploadFiles([])}
            >
              <CircleX size={16} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
