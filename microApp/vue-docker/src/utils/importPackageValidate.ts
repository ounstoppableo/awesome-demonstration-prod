import { useViewInfoStoreStore } from '@/store/viewInfoStore';

const checkPackageExtendLegal = (fileName: string) => {
  fileName = fileName.split(';')[0].trim();
  if (
    !fileName.endsWith('.ts') &&
    !fileName.endsWith('.vue') &&
    !fileName.endsWith('.js')
  ) {
    throw new Error('错误的包拓展名！');
  }
};

const checkPackageNotFromOuter = async (fileName: string) => {
  const viewInfoStoreState = useViewInfoStoreStore();
  const relaventImports = viewInfoStoreState.getRelaventPackages;
  if (!relaventImports.includes(fileName))
    throw new Error('不要在编辑器中引入外部包！你可以通过fetch来获取。');
};

export const checkIsLegalPackage = async (fileName: string) => {
  checkPackageExtendLegal(fileName);
  await Promise.all([
    checkPackageNotFromOuter(fileName),
    checkVueLegal(fileName),
  ]);
};

export const checkVueLegal = async (fileName: any) => {
  if (fileName.endsWith('.vue')) {
    const viewInfoStoreState = useViewInfoStoreStore();
    const fileContent = await viewInfoStoreState.getFileContent(fileName);
    if (!fileContent.match('<script.*setup.*>')) {
      throw new Error('请使用函数式组件！');
    }
  }
};
