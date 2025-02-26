import { getFileContent } from '@/app/lib/data';
import ParseStringToComponent, {
  commonParseTools,
} from './parseStringToComponent';
//@ts-ignore
import * as Babel from '@babel/standalone';
import React from 'react';
import { ComponentInfoForViewerType } from '../addComponentFormDataFormat';

export function Register(target: typeof ParseStringToComponent) {
  class RegisteredParseStringComponent extends target {
    static _legalExtension = ['.ts', '.tsx', 'jsx', 'js'];
    static _parseLanguage = 'react';
    static handleInstallDependence(): void {
      if (typeof window !== 'undefined') {
        (window as any).React = React;
      }
    }
    constructor(componentInfo: ComponentInfoForViewerType) {
      target._legalExtension = RegisteredParseStringComponent._legalExtension;
      target._parseLanguage = RegisteredParseStringComponent._parseLanguage;

      RegisteredParseStringComponent.handleInstallDependence();
      super(componentInfo);
    }
    async handleGetFileContent(fileName: string): Promise<any> {
      if (this.componentInfo.fileContentsMap[fileName]) {
        return this.componentInfo.fileContentsMap[fileName];
      } else {
        const fileContent = (
          await getFileContent({ id: this.componentInfo.id, fileName })
        ).data.fileContent;
        return fileContent;
      }
    }
    async handleDisposeImportReactComponent(fileName: string): Promise<string> {
      const fileContent = await this.handleGetFileContent(fileName);
      const components = await this.parseToComponent(fileContent, fileName);
      return `
      ${Object.keys(components).map((component: any) => {
        return `
            const ${component} = ${components[component]}
        `;
      })}
      `;
    }
    async handleStringToComponent(componentString: string, name: string) {
      componentString = Babel.transform(
        commonParseTools.clearExportKeyWords(
          commonParseTools.tsxTransJsx(componentString),
        ),
        {
          presets: ['react'],
        },
      ).code;

      const components = commonParseTools
        .getFunctionAndReturn(componentString)
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
    }
  }

  return RegisteredParseStringComponent;
}
