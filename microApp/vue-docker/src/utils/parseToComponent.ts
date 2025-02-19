import * as Vue from 'vue';
import { loadModule } from 'vue3-sfc-loader';
import packagesData from '@/packagesData';
import * as acorn from 'acorn';
import ts from 'typescript';
import { parseImportContent } from './parseImportTools';
import { checkIsLegalPackage } from './importPackageValidate';
import { useViewInfoStoreStore } from '@/store/viewInfoStore';

export async function parseToComponent(
  sfcString: any,
  name: string,
  rootApp?: any,
) {
  const app: any = rootApp ? rootApp : Vue.inject('app');
  const viewInfoStoreState = useViewInfoStoreStore();
  const options = {
    moduleCache: { vue: Vue },
    async getFile(url?: any) {
      // 正则表达式来提取所有 import 语句
      const importRegex = /import\s+[^'"]*['"][^'"]+['"];?/g;
      const allImports = sfcString.match(importRegex) || [];

      // 过滤出不是从 'vue' 导入的 import 语句
      const nonVueImports = allImports.filter(
        (importStatement: any) =>
          !importStatement.includes("'vue'") &&
          !importStatement.includes('"vue"'),
      );

      for (let i = 0; i < nonVueImports.length; i++) {
        const regex =
          /import\s+[^'"]*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
        const match = regex.exec(nonVueImports[i]);
        const fileName = match ? match[1] || match[2] : '';
        await checkIsLegalPackage(fileName);
      }

      let globalImport = `<script>`;
      for (let i = 0; i < nonVueImports.length; i++) {
        sfcString = sfcString.replace(nonVueImports[i], '');
        const ast = acorn.parse(nonVueImports[i], {
          sourceType: 'module',
          ecmaVersion: 'latest',
        });

        if ((ast.body[0] as any).source.value?.endsWith('.vue')) {
          const fileName = (ast.body[0] as any).source.value;
          const name = (ast.body[0] as any).specifiers[0].local.name;
          const sfcString = await viewInfoStoreState.getFileContent(fileName);
          parseToComponent(sfcString, name, app);
          continue;
        }

        const importContent = await parseImportContent(nonVueImports[i]);

        globalImport += importContent;
      }
      globalImport += '</script>';

      return Promise.resolve(globalImport + sfcString);
    },
    addStyle(styleString: any) {
      let style = document.getElementById(name);
      if (!style) {
        style = document.createElement('style');
        style.setAttribute('id', name);
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
      }
      style.textContent = styleString;
    },
  };
  try {
    const component = await loadModule(`${name}.vue`, options);
    app.component(name, component);
  } catch (error) {
    console.error('Vue 语法错误:', error);
  }
}
