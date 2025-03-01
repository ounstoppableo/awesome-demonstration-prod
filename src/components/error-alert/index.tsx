import { Dialog } from 'radix-ui';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { TriangleAlert } from 'lucide-react';

export default function ErrorAlert(props: any) {
  const { title, content } = props;
  return (
    <div className="absolute shadow-lg p-8 flex flex-col gap-2 bg-background text-foreground left-1/2  top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl w-1/2 h-fit max-w-[50%] max-h-[60%]">
      <div className="flex flex-col">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50">
          <TriangleAlert className="size-5 text-red-600" />
        </div>
        <div className="text-lg font-semibold text-center">{title}</div>
      </div>
      <div className="w-full flex overflow-auto text-sm text-muted-foreground text-center break-all justify-center items-center">
        {content}
      </div>
    </div>
  );
}
