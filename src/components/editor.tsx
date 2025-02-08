import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import {
  Editor as MonacoEditor,
  DiffEditor,
  useMonaco,
  loader,
} from '@monaco-editor/react';
export default function Editor() {
  return (
    <Tabs defaultValue="tab-1" className="flex flex-col h-full">
      <TabsList className="relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border justify-start pl-0.5 pt-0.5">
        <TabsTrigger
          value="tab-1"
          className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
        >
          test.tsx
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
        >
          app.tsx
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
        >
          demo.tsx
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1" className="p-0.5 flex-1 m-0">
        <MonacoEditor
          defaultLanguage="javascript"
          theme="vs-dark"
          defaultValue="// some comment"
          className="h-full"
        />
      </TabsContent>
    </Tabs>
  );
}
