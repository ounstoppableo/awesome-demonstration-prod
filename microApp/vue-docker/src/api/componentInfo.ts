import request from '@/utils/fetch';

export const getComponentInfo = async (id: string) => {
  return await request(`/api/componentInfo?id=${id}`);
};
export const getRelevantPackages = async (id: string) => {
  const res = await request(`/api/componentInfo?id=${id}`);
  if (res.code === 200) {
    return res.relevantPackages;
  } else {
    return [];
  }
};
export const getFileContent = async (scope: string, fileName: string) => {
  return await request(`/api/fileContent?scope=${scope}&fileName=${fileName}`);
};
