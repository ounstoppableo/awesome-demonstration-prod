import {
  ComponentInfoForViewerType,
  ComponentInfoFromBackend,
} from './addComponentFormDataFormat';

const formatDataToViewerAdaptor = (
  data: ComponentInfoFromBackend,
): ComponentInfoForViewerType => {
  console.log(data);
  return {
    id: data.id,
    entryFile: data[
      `${data.framework[0]}EntryFileName` as keyof ComponentInfoFromBackend
    ] as any,
    relevantPackages: [
      data[
        `${data.framework[0]}EntryFileName` as keyof ComponentInfoFromBackend
      ] as any,
      ...(data[
        `${data.framework[0]}RelevantFiles` as keyof ComponentInfoFromBackend
      ] as any),
    ],
    externalFiles: data[
      `${data.framework[0]}ExternalFiles` as keyof ComponentInfoFromBackend
    ] as any,
    currentFile: data[
      `${data.framework[0]}EntryFileName` as keyof ComponentInfoFromBackend
    ] as any,
    fileContentsMap: {},
    framework: data.framework,
    currentFramework: data.framework[0],
  };
};
export default formatDataToViewerAdaptor;
