import { selectComponentInfo } from '@/store/component-info/component-info-slice';
import { useAppSelector } from '@/store/hooks';

const checkPackageExtendLegal = (fileName: string) => {
  fileName = fileName.split(';')[0].trim();
  if (
    !fileName.endsWith('.ts') &&
    !fileName.endsWith('.tsx') &&
    !fileName.endsWith('.jsx') &&
    !fileName.endsWith('.js')
  ) {
    throw new Error('错误的包拓展名！');
  }
};

const checkPackageNotFromOuter = async (
  fileName: string,
  componentInfo: any,
) => {
  const relaventImports = componentInfo.relevantPackages;
  if (!relaventImports.includes(fileName))
    throw new Error('不要在编辑器中引入外部包！');
};

export const checkIsLegalPackage = async (
  fileName: string,
  componentInfo: any,
) => {
  checkPackageExtendLegal(fileName);
  await Promise.all([checkPackageNotFromOuter(fileName, componentInfo)]);
};
