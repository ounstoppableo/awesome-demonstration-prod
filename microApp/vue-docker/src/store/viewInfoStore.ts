import { getFileContent } from '@/api/componentInfo';
import { assign, cloneDeep, merge } from 'lodash';
import { defineStore } from 'pinia';

type ViewInfo = {
  id: string;
  entryFile: string;
  relevantPackages: string[];
  currentFile: string;
  fileContentsMap: { [key: string]: string };
};

export const useViewInfoStoreStore = defineStore('viewInfoStore', {
  state: (): ViewInfo => ({
    id: '',
    entryFile: '',
    relevantPackages: [],
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
    getRelevantPackages(): string[] {
      return this.relevantPackages;
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
        const fileContent = (await getFileContent(this.id, fileName)).data
          .fileContent;
        return fileContent;
      }
    },
  },
});
