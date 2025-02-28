import { useAppSelector } from '@/store/hooks';
import { selectTheme } from '@/store/theme/theme-slice';
import { useEffect, useState } from 'react';

export default function useParentInfo(props: any) {
  const { iframeRef, componentInfoForParent, getServerAddr, setShowLoading } =
    props;
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
  }, [componentInfoForParent.currentFramework]);

  useEffect(() => {
    if (frameworkReady) {
      setShowLoading(true);
      const messageData = {
        type: 'updateViewer',
        viewInfo: componentInfoForParent,
      };
      iframeRef.current?.contentWindow.postMessage(
        messageData,
        getServerAddr(componentInfoForParent.currentFramework),
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
        getServerAddr(componentInfoForParent.currentFramework),
      );
    }
  }, [frameworkReady]);

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
      getServerAddr(componentInfoForParent.currentFramework),
    );
  }, [theme]);

  return {
    framework: componentInfoForParent.currentFramework,
  };
}
