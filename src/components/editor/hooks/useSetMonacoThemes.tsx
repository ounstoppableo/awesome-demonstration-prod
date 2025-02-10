import { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import monacoThemes from '@/monaco-themes/Night Owl.json';

export default function useSetMonacoThemes() {
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
  }
  return { handleEditorWillMount, handleEditorDidMount };
}
