'use client';
import Editor from '@/components/editor/editor';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/resizable/resizable';
import Viewer from '@/components/viewer/viewer';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/selector/selector';
import { Button } from '@/components/buttons/button-two/index';
import { House, Boxes } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorContainer() {
  const [selectedValue, setSelectedValue] = useState('html');
  const router = useRouter();
  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col">
      <div className="py-2 px-0.5 flex justify-between border items-center relative">
        <Button
          onClick={(e) => {
            router.push('/');
          }}
          icon={<House />}
          direction="left"
        >
          Home
        </Button>
        <div className="flex items-center overflow-hidden w-10 relative h-10 box-content cursor-pointer dark:bg-[hsl(var(--background))] border hover:w-36 transition-all duration-200 rounded-[9999px] origin-right">
          <div className="hover:rotate-[360deg] transition-all duration-200 ">
            <div className="bg-[url(https://www.unstoppable840.cn/assets/avatar.jpeg)] bg-blend-lighten bg-[#0ff] bg-center bg-contain w-10 h-10 rounded-[100%] relative after:absolute after:w-10 after:h-10 after:bg-[url(https://www.unstoppable840.cn/assets/avatar.jpeg)] after:bg-blend-lighten after:bg-[#f00] after:bg-center after:bg-contain after:rounded-[100%] after:mix-blend-darken after:animate-shake"></div>
          </div>
          <div className="font-semibold absolute left-10 w-24 flex justify-center items-center select-none">
            Click Me!
          </div>
        </div>
        <Select defaultValue={selectedValue} onValueChange={handleValueChange}>
          <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80 w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
            <SelectGroup>
              <SelectItem value="html">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-HTML"></use>
                </svg>
                <span className="truncate">HTML</span>
              </SelectItem>
              <SelectItem value="vue">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-Vue"></use>
                </svg>
                <span className="truncate">Vue</span>
              </SelectItem>
              <SelectItem value="react">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-react"></use>
                </svg>
                <span className="truncate">React</span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Editor></Editor>
        </ResizablePanel>
        <ResizableHandle withHandle={true} />
        <ResizablePanel>
          <Viewer></Viewer>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
