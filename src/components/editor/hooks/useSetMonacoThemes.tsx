import { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import monacoThemes from '@/monaco-themes/Night Owl.json';

export default function useSetMonacoThemes() {
  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('customTheme', monacoThemes as any);
      monaco.editor.setTheme('customTheme');
    }
  }, [monaco]);
}
