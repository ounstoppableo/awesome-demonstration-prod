'use client';
import { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import monacoThemes from '@/monaco-themes/Night Owl.json';

export default function useCustomMonaco(props: any) {
  const { language } = props;
  const [monacoInstance, setMonacoIntance] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');
  const worker = useRef<any>(null);
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
    monaco.editor.defineTheme('customTheme', monacoThemes as any);
    monaco.editor.setTheme('customTheme');
    let model;
    if (language === 'vue') {
      model = monaco.editor.createModel('', 'html');
    }
    if (language === 'react') {
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
