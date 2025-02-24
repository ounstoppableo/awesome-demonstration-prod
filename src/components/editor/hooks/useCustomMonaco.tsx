'use client';
import { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import monacoThemesDark from '@/monaco-themes/Night Owl.json';
import { useAppSelector } from '@/store/hooks';
import { selectComponentInfo } from '@/store/component-info/component-info-slice';
import { selectTheme } from '@/store/theme/theme-slice';

export default function useCustomMonaco(props?: any) {
  const [monacoInstance, setMonacoIntance] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');
  const componentInfo = useAppSelector(selectComponentInfo);
  const theme = useAppSelector(selectTheme);
  const worker = useRef<any>({ postMessage: () => {}, terminal: () => {} });
  function handleEditorWillMount(monaco: any) {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      module: monaco.languages.typescript.ModuleKind.ES2022,
      allowNonTsExtensions: true,
      lib: ['es2022'],
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ['node_modules/@types'],
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'JSXAlone.createElement',
    });
  }
  function handleEditorDidMount(editor: any, monaco: any) {
    monaco.editor.defineTheme('customThemeDark', monacoThemesDark as any);
    if (theme === 'dark') {
      monaco.editor.setTheme('customThemeDark');
    } else {
      monaco.editor.setTheme('vs');
    }

    let model;
    if (componentInfo.currentFramework === 'vue') {
      model = monaco.editor.createModel('', 'html');
    }
    if (componentInfo.currentFramework === 'react') {
      model = monaco.editor.createModel(
        '',
        'typescript',
        monaco.Uri.parse('file:///main.tsx'),
      );

      worker.current = new Worker(
        new URL('@/workers/syntax-highlighter.worker.js', import.meta.url),
      );
      worker.current.addEventListener('message', ({ data }: any) => {
        const { classifications, version } = data;
        const model = editor.getModel();

        if (model && model.getVersionId() !== version) {
          return;
        }

        const decorations = classifications.map((classification: any) => ({
          range: new monaco.Range(
            classification.startLine,
            classification.start,
            classification.endLine,
            classification.end,
          ),
          options: {
            // Some class names to help us add some color to the JSX code
            inlineClassName: classification.type
              ? `${classification.kind} ${classification.type}-of-${
                  classification.parentKind
                }`
              : classification.kind,
          },
        }));
        model.decorations = editor.deltaDecorations(
          model.decorations || [],
          decorations,
        );
      });
    }
    editor.setModel(model);

    setMonacoIntance(editor);
    return () => {
      worker.current.terminate();
    };
  }
  function handleModelContentChange(event: any) {
    const codeContent = monacoInstance?.getValue();
    setEditorContent(codeContent);
    worker.current.postMessage({
      code: codeContent,
      version: monacoInstance?.getModel().getVersionId(),
      title: 'test',
    });
  }
  return {
    handleEditorWillMount,
    handleEditorDidMount,
    handleModelContentChange,
    editorContent,
    monacoInstance,
    worker,
  };
}
