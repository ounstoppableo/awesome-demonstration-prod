import { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import monacoThemes from '@/monaco-themes/Night Owl.json';

export default function useCustomMonaco() {
  const [monacoInstance, setMonacoIntance] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');
  function handleEditorWillMount(monaco: any) {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      module: monaco.languages.typescript.ModuleKind.ES2015,
      allowNonTsExtensions: true,
      lib: ['es2018'],
    });
  }
  function handleEditorDidMount(editor: any, monaco: any) {
    monaco.editor.defineTheme('customTheme', monacoThemes as any);
    monaco.editor.setTheme('customTheme');
    setMonacoIntance(editor);
  }
  function handleModelContentChange(event: any) {
    setEditorContent(monacoInstance?.getValue());
  }
  return {
    handleEditorWillMount,
    handleEditorDidMount,
    handleModelContentChange,
    editorContent,
    monacoInstance,
  };
}
