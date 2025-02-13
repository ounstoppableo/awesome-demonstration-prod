'use client';

import { getComponentInfo, getFileContent } from '@/app/lib/data';
import { selectComponentInfo } from '@/store/component-info/component-info-slice';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useRef, useState } from 'react';

export default function Viewer(props: any) {
  const { framwork } = props;
  const iframeRef = useRef<any>(null);
  const componentInfo = useAppSelector(selectComponentInfo);
  const [frameworkReady, setFrameworkReady] = useState(false);

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
  }, [framwork]);

  useEffect(() => {
    if (frameworkReady) {
      const messageData = {
        type: 'updateViewer',
        viewInfo: componentInfo,
      };
      iframeRef.current?.contentWindow.postMessage(
        messageData,
        location.protocol + '//' + location.hostname + ':11451',
      );
    }
  }, [
    frameworkReady,
    componentInfo.fileContentsMap,
    componentInfo.fileContentsMap[componentInfo.currentFile],
  ]);

  return (
    <div className="h-full dark:bg-[#1a1a1a]">
      {framwork === 'vue' ? (
        <iframe
          ref={iframeRef}
          src={location.protocol + '//' + location.hostname + ':11451'}
          className="w-full h-full"
        ></iframe>
      ) : (
        <></>
      )}
    </div>
  );
}
