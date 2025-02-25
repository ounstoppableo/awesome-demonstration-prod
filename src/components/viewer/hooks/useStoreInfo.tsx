import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { getComponentInfo, getFileContent } from '@/app/lib/data';
import { selectComponentInfo } from '@/store/component-info/component-info-slice';
import { selectTheme } from '@/store/theme/theme-slice';

export default function useStoreInfo(props: any) {
  const { iframeRef, getServerAddr } = props;
  const componentInfo = useAppSelector(selectComponentInfo);
  const [frameworkReady, setFrameworkReady] = useState(false);
  const theme = useAppSelector(selectTheme);
  useEffect(() => {
    setFrameworkReady(false);
    const msgCb = (e: any) => {
      if (e.data.type === 'frameworkReady') {
        setFrameworkReady(true);
      }
    };
    window.addEventListener('message', msgCb);
    return () => {
      window.removeEventListener('message', msgCb);
    };
  }, [componentInfo.currentFramework]);

  useEffect(() => {
    if (frameworkReady) {
      const messageData = {
        type: 'updateViewer',
        viewInfo: componentInfo,
      };
      iframeRef.current?.contentWindow.postMessage(
        messageData,
        getServerAddr(componentInfo.currentFramework),
      );
      iframeRef.current?.contentWindow.postMessage(
        {
          type: 'setStyle',
          style: {
            body: {
              background: theme === 'dark' ? 'transparent' : 'transparent',
            },
          },
        },
        getServerAddr(componentInfo.currentFramework),
      );
    }
  }, [
    frameworkReady,
    componentInfo.fileContentsMap,
    componentInfo.fileContentsMap[componentInfo.currentFile],
  ]);

  useEffect(() => {
    iframeRef.current?.contentWindow.postMessage(
      {
        type: 'setStyle',
        style: {
          body: {
            background: theme === 'dark' ? 'transparent' : 'transparent',
          },
        },
      },
      getServerAddr(componentInfo.currentFramework),
    );
  }, [theme]);

  return { framework: componentInfo.currentFramework };
}
