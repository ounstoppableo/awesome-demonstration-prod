'use client';

import { useEffect, useRef, useState } from 'react';
import useStoreInfo from './hooks/useStoreInfo';
import useParentInfo from './hooks/useParentInfo';
import { ComponentInfoForViewerType } from '@/utils/addComponentFormDataFormat';
import { selectTheme } from '@/store/theme/theme-slice';
import { useAppSelector } from '@/store/hooks';

export default function Viewer(props: {
  componentInfoForParent?: ComponentInfoForViewerType;
}) {
  const { componentInfoForParent } = props;
  const iframeRef = useRef<any>(null);
  let framework: any;

  if (!!componentInfoForParent) {
    framework = useParentInfo({
      iframeRef,
      componentInfoForParent,
    }).framework;
  } else {
    framework = useStoreInfo({ iframeRef }).framework;
  }

  return (
    <div className="h-full w-full">
      {framework === 'vue' ? (
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
