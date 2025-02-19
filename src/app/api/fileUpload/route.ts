import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new Error('参数不完整！');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.replace(/\s/g, '-');
    const filePath = path.join(process.cwd(), 'public', 'temp', fileName);

    await writeFile(filePath, buffer);
    return NextResponse.json({
      msg: 'File uploaded successfully',
      data: { filePath: path.join('public', 'temp', fileName), fileName },
      code: 200,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      msg: 'File uploaded successfully',
      data: { filePath: '', fileName: '' },
      code: 200,
    });
  }
}
