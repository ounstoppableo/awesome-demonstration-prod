'use client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/tabs/tabs';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { getFileContent } from '@/app/lib/data';
import { useDispatch } from 'react-redux';
import {
  selectComponentInfo,
  setComponentInfo,
} from '@/store/component-info/component-info-slice';
import { useAppSelector } from '@/store/hooks';
import useCustomMonaco from './hooks/useCustomMonaco';

export default function Editor() {
  const componentInfo = useAppSelector(selectComponentInfo);
  const dispatch = useDispatch();

  const {
    handleEditorWillMount,
    handleEditorDidMount,
    handleModelContentChange,
    editorContent,
    monacoInstance,
  } = useCustomMonaco();

  useEffect(() => {
    dispatch(
      setComponentInfo({
        fileContentsMap: { [componentInfo.currentFile]: editorContent },
      }),
    );
  }, [editorContent]);

  useEffect(() => {
    if (!componentInfo.currentFile) return;
    const currentFileContent =
      componentInfo.fileContentsMap[componentInfo.currentFile];
    if (currentFileContent) {
      monacoInstance?.setValue(currentFileContent);
    } else {
      getFileContent({
        id: componentInfo.id,
        fileName: componentInfo.currentFile,
      }).then((res) => {
        if (res.code === 200) {
          dispatch(
            setComponentInfo({
              fileContentsMap: {
                [componentInfo.currentFile]: res.data.fileContent,
              },
            }),
          );
        }
      });
    }
  }, [monacoInstance, componentInfo.currentFile]);

  const handleTabsChange = (e: any) => {
    dispatch(
      setComponentInfo({
        currentFile: e,
      }),
    );
  };

  return componentInfo.id ? (
    <Tabs value={componentInfo.currentFile} className="flex flex-col h-full">
      <TabsList className="relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border justify-start pl-0.5 pt-0.5">
        {componentInfo.relevantPackages.map((item: string, index) => {
          return (
            <TabsTrigger
              value={item}
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
              key={item + index}
              handleChange={handleTabsChange}
            >
              {item}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {componentInfo.relevantPackages.map((item, index) => {
        return (
          <TabsContent
            key={item + index}
            value={item}
            className="p-0.5 flex-1 m-0"
          >
            {!!componentInfo.fileContentsMap[item] ? (
              <MonacoEditor
                defaultValue={componentInfo.fileContentsMap[item]}
                className="h-full"
                loading={<div></div>}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                onChange={handleModelContentChange}
                theme="customTheme"
              />
            ) : (
              <></>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  ) : (
    <></>
  );
}
