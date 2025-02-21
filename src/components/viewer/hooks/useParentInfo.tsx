import { useAppSelector } from '@/store/hooks';
import { selectTheme } from '@/store/theme/theme-slice';
import { useEffect, useState } from 'react';

export default function useParentInfo(props: any) {
  const { iframeRef, componentInfoForParent } = props;
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
      const messageData = {
        type: 'updateViewer',
        viewInfo: componentInfoForParent,
      };
      iframeRef.current?.contentWindow.postMessage(
        messageData,
        location.protocol + '//' + location.hostname + ':11451',
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
        location.protocol + '//' + location.hostname + ':11451',
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
      location.protocol + '//' + location.hostname + ':11451',
    );
  }, [theme]);

  return {
    framework: componentInfoForParent.currentFramework,
  };
}
