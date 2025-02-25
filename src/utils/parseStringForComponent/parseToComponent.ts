import { checkIsLegalPackage } from './importPackageValidate';
import * as acorn from 'acorn';
import {
  clearExportKeyWords,
  getDeclarationFromContent,
  getFunctionAndReturn,
  handleGetFileContent,
  parseImportContent,
  tsxTransJsx,
} from './parseImportTools';
//@ts-ignore
import * as Babel from '@babel/standalone';

(window as any)._components = {};

const parseToComponent = async (
  componentString: string,
  name: string,
  componentInfo: any,
) => {
  const importRegex = /import\s+[^'"]*['"][^'"]+['"];?/g;
  const allImports = componentString.match(importRegex) || [];

  // 过滤外部包
  const nonVueImports = allImports.filter(
    (importStatement: any) =>
      !importStatement.includes("'react'") &&
      !importStatement.includes('"react"'),
  );

  for (let i = 0; i < nonVueImports.length; i++) {
    const regex =
      /import\s+[^'"]*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    const match = regex.exec(nonVueImports[i]);
    const fileName = match ? match[1] || match[2] : '';
    await checkIsLegalPackage(fileName, componentInfo);
  }

  let preDefinitionContext = '';
  for (let i = 0; i < nonVueImports.length; i++) {
    componentString = componentString.replace(nonVueImports[i], '');
    const ast = acorn.parse(nonVueImports[i], {
      sourceType: 'module',
      ecmaVersion: 'latest',
    });
    if (
      (ast.body[0] as any).source.value?.endsWith('.tsx') ||
      (ast.body[0] as any).source.value?.endsWith('.jsx')
    ) {
      const fileName = (ast.body[0] as any).source.value;
      const fileContent = await handleGetFileContent(fileName, componentInfo);
      const components = await parseToComponent(
        fileContent,
        fileName,
        componentInfo,
      );
      preDefinitionContext += `
      ${Object.keys(components).map((component: any) => {
        return `
            const ${component} = ${components[component]}
        `;
      })}
      `;
      continue;
    }

    const importContent = await parseImportContent(
      nonVueImports[i],
      componentInfo,
    );
    preDefinitionContext += importContent;
  }

  componentString = preDefinitionContext + componentString;

  componentString = Babel.transform(
    clearExportKeyWords(tsxTransJsx(componentString)),
    {
      presets: ['react'],
    },
  ).code;

  const components = getFunctionAndReturn(componentString)
    .filter((item: any) => item.returnValue === '<component>')
    .map((item: any) => item.functionName);

  componentString += `
    if(!window._components['${name}']) window._components['${name}'] = {};
          ${components
            .map((component: any) => {
              return `
            window._components['${name}']['${component}'] = ${component};
            `;
            })
            .join(';')}
      `;
  eval(componentString);

  const result: any = {};

  components.forEach((component: any) => {
    result[component] = (window as any)._components[name][component];
  });

  return result;
};
export default parseToComponent;
