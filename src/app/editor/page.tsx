'use client';
import Editor from '@/components/editor';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/resizable';
import Viewer from '@/components/viewer';

export default function EditorContainer() {
  return (
    <div className="h-[100vh] w-[100vw]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Editor></Editor>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Viewer></Viewer>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
