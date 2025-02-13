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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BubbleText from '@/components/bubble-text';
import { getComponentInfo, getFileContent } from '../lib/data';
import { useDispatch } from 'react-redux';
import { setComponentInfo } from '@/store/component-info/component-info-slice';

export default function EditorContainer() {
  const [selectedValue, setSelectedValue] = useState('html');
  const router = useRouter();
  const dispatch = useDispatch();
  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };
  useEffect(() => {
    getComponentInfo({ id: 'test' }).then(async (res) => {
      if (res.code === 200) {
        const fileContentRes = await getFileContent({
          id: res.data.id,
          fileName: res.data.entryFile,
        });
        if (fileContentRes.code === 200) {
          dispatch(
            setComponentInfo({
              ...res.data,
              currentFile: res.data.entryFile,
              fileContentsMap: { [res.data.entryFile]: fileContentRes.data },
            }),
          );
        }
      }
    });
  }, []);
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
        <div className="group h-10 flex items-center overflow-hidden w-10 hover:w-36 relative box-content cursor-pointer border transition-all duration-200 rounded-[9999px] origin-right after:bg-gradient-to-r after:from-[0%] after:from-[transparent] after:via-[70%] after:via-[#83a4d4] after:to-[#b6fbff] after:to-[100%] after:absolute after:inset-0 after:left-[50%] after:origin-left after:-z-10 after:animate-rotate">
          <div className="flex items-center h-10 reactive w-36 group-hover:p-1 after:absolute after:rounded-[2.5rem] after:h-9 after:inset-x-0.5 after:bg-background">
            <div className="hover:rotate-[360deg] transition-all duration-200 rounded-[9999px] reactive z-10 w-10 h-10 group-hover:w-9 group-hover:h-9">
              <div className="transition-all duration-200 bg-[url(https://www.unstoppable840.cn/assets/avatar.jpeg)] bg-blend-lighten bg-[#0ff] bg-center bg-contain w-full h-full rounded-[100%] relative after:absolute after:w-full after:h-full after:bg-[url(https://www.unstoppable840.cn/assets/avatar.jpeg)] after:bg-blend-lighten after:bg-[#f00] after:bg-center after:bg-contain after:rounded-[100%] after:mix-blend-darken after:animate-shake"></div>
            </div>
            <div className="font-semibold absolute left-10 w-24 flex justify-center items-center select-none z-10 gradiant-text animate-gradientMove">
              To Blog!
            </div>
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
          <Viewer framwork={selectedValue}></Viewer>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
