import { z } from 'zod';

export const formSchema = z.object({
  componentName: z.string().nonempty({ message: '' }),
  framework: z.array(z.string()).nonempty({ message: '' }),
  editComponentId: z.string().nonempty({ message: '' }),
  addOrEdit: z.string(),
  files: z
    .object({
      html: z
        .object({
          entryFile: z.object({
            fileName: z.string().nonempty({ message: '' }),
            filePath: z.string().nonempty({ message: '' }),
          }),
          relevantFiles: z.array(
            z.object({
              fileName: z.string().nonempty({ message: '' }),
              filePath: z.string().nonempty({ message: '' }),
              external: z.boolean(),
            }),
          ),
        })
        .nullable(),
      vue: z
        .object({
          entryFile: z.object({
            fileName: z.string().nonempty({ message: '' }),
            filePath: z.string().nonempty({ message: '' }),
          }),
          relevantFiles: z.array(
            z.object({
              fileName: z.string().nonempty({ message: '' }),
              filePath: z.string().nonempty({ message: '' }),
              external: z.boolean(),
            }),
          ),
        })
        .nullable(),
      react: z
        .object({
          entryFile: z.object({
            fileName: z.string().nonempty({ message: '' }),
            filePath: z.string().nonempty({ message: '' }),
          }),
          relevantFiles: z.array(
            z.object({
              fileName: z.string().nonempty({ message: '' }),
              filePath: z.string().nonempty({ message: '' }),
              external: z.boolean(),
            }),
          ),
        })
        .nullable(),
    })
    .nullable(),
});

export type ComponentInfoFormType = z.infer<typeof formSchema>;

export type ComponentInfoFromBackend = {
  id: string;
  name: string;
  framework: string[];
  htmlEntryFileName: string | null;
  htmlExternalFiles: { fileName: string; filePath: string }[] | null;
  htmlRelevantFiles: string[] | null;
  reactEntryFileName: string;
  reactExternalFiles: { fileName: string; filePath: string }[] | null;
  reactRelevantFiles: string[] | null;
  vueEntryFileName: string;
  vueExternalFiles: { fileName: string; filePath: string }[] | null;
  vueRelevantFiles: string[] | null;
};

export type ComponentInfoForViewerType = {
  id: string;
  entryFile: string;
  relevantPackages: string[];
  externalFiles: { fileName: string; filePath: string }[];
  currentFile: string;
  fileContentsMap: { [key: string]: string };
  framework: string[];
  currentFramework: string;
};
