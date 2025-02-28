'use client';

import { useEffect, useRef, useState } from 'react';
import useStoreInfo from './hooks/useStoreInfo';
import useParentInfo from './hooks/useParentInfo';
import { ComponentInfoForViewerType } from '@/utils/addComponentFormDataFormat';
import { selectTheme } from '@/store/theme/theme-slice';
import { useAppSelector } from '@/store/hooks';
import Loading from '../loading';

export default function Viewer(props: {
  componentInfoForParent?: ComponentInfoForViewerType;
}) {
  const { componentInfoForParent } = props;
  const [showLoading, setShowLoading] = useState(true);
  const iframeRef = useRef<any>(null);
  let framework: any;
  const getServerAddr = (framework: 'vue' | 'html' | 'react') => {
    return framework === 'vue'
      ? location.protocol + '//' + location.hostname + ':11451'
      : framework === 'html'
        ? location.protocol +
          '//' +
          location.hostname +
          ':7777/' +
          'htmlViewerServer.html'
        : framework === 'react'
          ? location.protocol + '//' + location.hostname + ':7777/' + 'viewer'
          : '';
  };

  if (!!componentInfoForParent) {
    framework = useParentInfo({
      iframeRef,
      componentInfoForParent,
      setShowLoading,
      getServerAddr: getServerAddr,
    }).framework;
  } else {
    framework = useStoreInfo({
      iframeRef,
      setShowLoading,
      getServerAddr: getServerAddr,
    }).framework;
  }

  useEffect(() => {
    const _cb = (e: any) => {
      if (
        e.data.type === 'componentLoadCompleted' ||
        e.data.type === 'handleCompileError'
      ) {
        setShowLoading(false);
      }
    };
    window.addEventListener('message', _cb);
    return () => {
      window.removeEventListener('message', _cb);
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      {framework === 'vue' ? (
        <iframe
          ref={iframeRef}
          src={location.protocol + '//' + location.hostname + ':11451'}
          className="w-full h-full"
        ></iframe>
      ) : framework === 'html' ? (
        <iframe
          ref={iframeRef}
          src={
            location.protocol +
            '//' +
            location.hostname +
            ':7777/' +
            'htmlViewerServer.html'
          }
          className="w-full h-full"
        ></iframe>
      ) : framework === 'react' ? (
        <iframe
          ref={iframeRef}
          src={
            location.protocol + '//' + location.hostname + ':7777/' + 'viewer'
          }
          className="w-full h-full"
        ></iframe>
      ) : (
        <></>
      )}
      <Loading showLoading={showLoading} cubeSize={80}></Loading>
    </div>
  );
}
