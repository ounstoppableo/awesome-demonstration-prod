import { NextRequest } from 'next/server';
import { string, z } from 'zod';
import pool from '@/app/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import handleResponse, { ResponseMsg } from '@/utils/handleResponse';

export async function GET(req: NextRequest) {
  return await handleResponse(
    req,
    async (req, handleCompleted, handleError) => {
      const searchParams = req.nextUrl.searchParams;
      const id = searchParams.get('id') as string;
      try {
        const [rows, fields] = await pool.query(
          'select * from componentInfo where id = ?',
          [id],
        );
        const result = (rows as any[]).map((item: componentInfo) => ({
          ...item,
          framework: JSON.parse(item.framework),
          htmlExternalFiles: item.htmlExternalFiles
            ? JSON.parse(item.htmlExternalFiles)
            : null,
          htmlRelevantFiles: item.htmlRelevantFiles
            ? JSON.parse(item.htmlRelevantFiles)
            : null,
          vueExternalFiles: item.vueExternalFiles
            ? JSON.parse(item.vueExternalFiles)
            : null,
          vueRelevantFiles: item.vueRelevantFiles
            ? JSON.parse(item.vueRelevantFiles)
            : null,
          reactExternalFiles: item.reactExternalFiles
            ? JSON.parse(item.reactExternalFiles)
            : null,
          reactRelevantFiles: item.reactRelevantFiles
            ? JSON.parse(item.reactRelevantFiles)
            : null,
        }));
        handleCompleted({
          msg: '查询成功!',
          data: result[0],
        });
      } catch (err) {
        console.error(err);
        handleError(ResponseMsg.serverError);
      }
    },
  );
}

export async function POST(req: NextRequest) {
  return await handleResponse(
    req,
    async (req, handleCompleted, handleError) => {
      const formSchema = z.object({
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
      const formContent: z.infer<typeof formSchema> = await req.json();

      try {
        formSchema.parse(formContent);
      } catch (err) {
        handleError(ResponseMsg.paramsError);
      }
      const storeSchema: any = {
        id: '',
        name: '',
        framework: '',
        vueEntryFileName: '',
        vueRelevantFiles: [] as any,
        vueExternalFiles: [] as any,
        htmlEntryFileName: '',
        htmlRelevantFiles: [] as any,
        htmlExternalFiles: [] as any,
        reactEntryFileName: '',
        reactRelevantFiles: [] as any,
        reactExternalFiles: [] as any,
      };
      storeSchema.id = uuidv4();
      storeSchema.name = formContent.componentName;
      storeSchema.framework = formContent.framework;
      storeSchema.vueEntryFileName = formContent.files?.vue?.entryFile
        .fileName as any;
      storeSchema.htmlEntryFileName = formContent.files?.html?.entryFile
        .fileName as any;
      storeSchema.reactEntryFileName = formContent.files?.react?.entryFile
        .fileName as any;
      storeSchema.vueRelevantFiles = formContent.files?.vue?.relevantFiles
        .filter((info) => !info.external)
        .map((info) => info.fileName);
      storeSchema.vueExternalFiles =
        formContent.files?.vue?.relevantFiles.filter((info) => info.external);
      storeSchema.htmlRelevantFiles = formContent.files?.html?.relevantFiles
        .filter((info) => !info.external)
        .map((info) => info.fileName);
      storeSchema.htmlExternalFiles =
        formContent.files?.html?.relevantFiles.filter((info) => info.external);
      storeSchema.reactRelevantFiles = formContent.files?.react?.relevantFiles
        .filter((info) => !info.external)
        .map((info) => info.fileName);
      storeSchema.reactExternalFiles =
        formContent.files?.react?.relevantFiles.filter((info) => info.external);

      const files = [
        formContent.files?.vue?.entryFile,
        formContent.files?.vue?.relevantFiles.filter((info) => !info.external),
        formContent.files?.html?.entryFile,
        formContent.files?.html?.relevantFiles.filter((info) => !info.external),
        formContent.files?.react?.entryFile,
        formContent.files?.react?.relevantFiles.filter(
          (info) => !info.external,
        ),
      ]
        .filter((info) => !!info)
        .flat()
        .map((info) => ({
          fileName: info!.fileName,
          filePath: info!.filePath,
        }));

      try {
        const res = await Promise.all(
          files.map((file) => {
            return new Promise(async (resolve) => {
              try {
                const data = await fs.readFile(file.filePath);
                fs.unlink(file.filePath);
                resolve({
                  fileName: file.fileName,
                  fileContent: data.toString(),
                });
              } catch {
                handleError(ResponseMsg.fileError);
              }
            });
          }),
        );
        await Promise.all(
          res.map(
            (item: any) =>
              new Promise((resolve) => {
                pool
                  .query(
                    'insert into `fileMap` (`fileName`, `fileContent`,`scope`) VALUES (?,?,?)',
                    [item.fileName, item.fileContent, storeSchema.id],
                  )
                  .then(() => {
                    resolve(1);
                  })
                  .catch((err) => {
                    console.log(err);
                    handleError(ResponseMsg.serverError);
                  });
              }),
          ),
        );
        for (let key in storeSchema) {
          if (typeof storeSchema[key] !== 'string') {
            storeSchema[key] = JSON.stringify(storeSchema[key]);
          }
        }

        await pool
          .query('INSERT INTO `componentInfo` set ?;', storeSchema)
          .catch((err) => {
            console.log(err);
            handleError(ResponseMsg.serverError);
          });

        handleCompleted({
          msg: '添加成功!',
        });
      } catch (err: any) {
        handleError(err);
      }
    },
  );
}

export type componentInfo = {
  id: string;
  name: string;
  framework: string;
  htmlEntryFileName: string | null;
  htmlExternalFiles: string | null;
  htmlRelevantFiles: string | null;
  reactEntryFileName: string;
  reactExternalFiles: string | null;
  reactRelevantFiles: string | null;
  vueEntryFileName: string;
  vueExternalFiles: string | null;
  vueRelevantFiles: string | null;
};
