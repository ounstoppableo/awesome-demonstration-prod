import { getFileContent } from '@/api/componentInfo';
import { assign, cloneDeep, merge } from 'lodash';
import { defineStore } from 'pinia';

type ViewInfo = {
  id: string;
  entryFile: string;
  relaventPackages: string[];
  currentFile: string;
  fileContentsMap: { [key: string]: string };
};

export const useViewInfoStoreStore = defineStore('viewInfoStore', {
  state: (): ViewInfo => ({
    id: '',
    entryFile: '',
    relaventPackages: [],
    currentFile: '',
    fileContentsMap: {},
  }),
  getters: {
    getRootContent(): string {
      if (this.entryFile) {
        return this.fileContentsMap[this.entryFile];
      } else {
        return '';
      }
    },
    getRelaventPackages(): string[] {
      return this.relaventPackages;
    },
  },
  actions: {
    setViewInfo(data: Partial<ViewInfo>) {
      this.$state = merge(cloneDeep(this.$state), data);
    },
    async getFileContent(fileName: string): Promise<string> {
      if (this.fileContentsMap[fileName]) {
        return this.fileContentsMap[fileName];
      } else {
        const fileContent = (await getFileContent(this.id, fileName)).data;
        return fileContent;
      }
    },
  },
});
