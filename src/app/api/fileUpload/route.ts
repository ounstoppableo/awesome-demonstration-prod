import handleResponse, { ResponseMsg } from '@/utils/handleResponse';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  return await handleResponse(
    req,
    async (req, handleCompleted, handleError) => {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return handleError(ResponseMsg.paramsError);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const extname = path.extname(file.name);
      const fileName = uuidv4() + extname;
      const filePath = path.join(process.cwd(), 'public', 'temp', fileName);

      await writeFile(filePath, buffer);
      handleCompleted({
        msg: 'File uploaded successfully',
        data: { filePath: path.join('public', 'temp', fileName), fileName },
      });
    },
  );
}
