import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/tabs/tabs';
import {
  Editor as MonacoEditor,
  DiffEditor,
  useMonaco,
  loader,
} from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import useSetMonacoThemes from './hooks/useSetMonacoThemes';

export default function Editor() {
  const [currentTab, setCurrentTab] = useState('tab-1');
  const demoValue = `
import * as React from 'react';
import { StandardProps } from '..';
import { TypographyProps } from '../Typography';

export interface ListItemTextProps
  extends StandardProps<React.HTMLAttributes<HTMLDivElement>, ListItemTextClassKey> {
  disableTypography?: boolean;
  inset?: boolean;
  primary?: React.ReactNode;
  primaryTypographyProps?: Partial<TypographyProps>;
  secondary?: React.ReactNode;
  secondaryTypographyProps?: Partial<TypographyProps>;
}

export type ListItemTextClassKey =
  | 'root'
  | 'multiline'
  | 'dense'
  | 'inset'
  | 'primary'
  | 'secondary';

declare const ListItemText: React.ComponentType<ListItemTextProps>;

export default ListItemText;
`;
  const language = 'typescript';

  const { handleEditorWillMount, handleEditorDidMount } = useSetMonacoThemes();
  return (
    <Tabs defaultValue={currentTab} className="flex flex-col h-full">
      <TabsList className="relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border justify-start pl-0.5 pt-0.5">
        <TabsTrigger
          value="tab-1"
          className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          handleChange={(e) => {
            setCurrentTab(e);
          }}
        >
          test.tsx
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          handleChange={(e) => {
            setCurrentTab(e);
          }}
        >
          app.tsx
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          handleChange={(e) => {
            setCurrentTab(e);
          }}
        >
          demo.tsx
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1" className="p-0.5 flex-1 m-0">
        <MonacoEditor
          defaultLanguage={language}
          path={language}
          defaultValue={demoValue}
          className="h-full"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          theme="customTheme"
        />
      </TabsContent>
      <TabsContent value="tab-2" className="p-0.5 flex-1 m-0">
        <MonacoEditor
          defaultLanguage={language}
          path={language}
          defaultValue={demoValue}
          className="h-full"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          theme="customTheme"
        />
      </TabsContent>
      <TabsContent value="tab-3" className="p-0.5 flex-1 m-0">
        <MonacoEditor
          defaultLanguage={language}
          path={language}
          defaultValue={demoValue}
          className="h-full"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          theme="customTheme"
        />
      </TabsContent>
    </Tabs>
  );
}
