'use client';
import { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import monacoThemesDark from '@/monaco-themes/Night Owl.json';
import { useAppSelector } from '@/store/hooks';
import { selectComponentInfo } from '@/store/component-info/component-info-slice';
import { selectTheme } from '@/store/theme/theme-slice';

export default function useCustomMonaco(props?: any) {
  const [monacoEditorInstance, setMonacoEditorIntance] = useState<any>(null);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');
  const componentInfo = useAppSelector(selectComponentInfo);
  const theme = useAppSelector(selectTheme);
  const worker = useRef<{
    postMessage?: any;
    terminate?: any;
    addEventListener: any;
  } | null>(null);
  const setReactModelCb = ({ data }: any) => {
    const { classifications, version } = data;
    const model = monacoEditorInstance.getModel();

    if (model && model.getVersionId() !== version) {
      return;
    }

    const decorations = classifications.map((classification: any) => ({
      range: new monacoInstance.Range(
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
    model.decorations = monacoEditorInstance.deltaDecorations(
      model.decorations || [],
      decorations,
    );
  };
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

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      diagnosticCodesToIgnore: [2307, 2304],
    });

    let model;
    if (
      componentInfo.currentFile.endsWith('.vue') ||
      componentInfo.currentFile.endsWith('.html')
    ) {
      model = monaco.editor.createModel('', 'html');
    }
    if (
      componentInfo.currentFile.endsWith('.ts') ||
      componentInfo.currentFile.endsWith('.js')
    ) {
      model = monaco.editor.createModel('', 'typescript');
    }
    if (componentInfo.currentFile.endsWith('.css')) {
      model = monaco.editor.createModel('', 'css');
    }
    if (
      componentInfo.currentFile.endsWith('.sass') ||
      componentInfo.currentFile.endsWith('.scss')
    ) {
      model = monaco.editor.createModel('', 'scss');
    }
    if (componentInfo.currentFile.endsWith('.less')) {
      model = monaco.editor.createModel('', 'less');
    }
    if (
      componentInfo.currentFile.endsWith('.tsx') ||
      componentInfo.currentFile.endsWith('.jsx')
    ) {
      model = monaco.editor.createModel(
        '',
        'typescript',
        monaco.Uri.parse('file:///main.tsx'),
      );

      if (worker.current) {
        (worker.current as any).terminate();
      }

      worker.current = new Worker(
        new URL('@/workers/syntax-highlighter.worker.js', import.meta.url),
      );
      worker.current.addEventListener('message', setReactModelCb);
    }
    editor.setModel(model);

    setMonacoEditorIntance(editor);
    setMonacoInstance(monaco);
    return () => {
      worker.current?.terminate();
    };
  }
  function handleModelContentChange(event: any) {
    const codeContent = monacoEditorInstance?.getValue();
    setEditorContent(codeContent);
    worker.current?.postMessage({
      code: codeContent,
      version: monacoEditorInstance?.getModel().getVersionId(),
      title: 'test',
    });
  }

  return {
    handleEditorWillMount,
    handleEditorDidMount,
    handleModelContentChange,
    editorContent,
    monacoEditorInstance,
    worker,
  };
}
