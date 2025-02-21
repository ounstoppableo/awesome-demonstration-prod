import pool from '@/app/lib/db';
import handleResponse, { ResponseMsg } from '@/utils/handleResponse';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return await handleResponse(
    req,
    async (req, handleCompleted, handleError) => {
      const searchParams = req.nextUrl.searchParams;
      const scope = searchParams.get('scope') as string;
      const fileName = searchParams.get('fileName') as string;
      if (!scope || !fileName) handleError(ResponseMsg.paramsError);
      const [rows, fields] = await pool.query(
        'select fileContent from fileMap where scope=? and fileName=?',
        [scope, fileName],
      );
      handleCompleted({
        msg: '查询成功!',
        data: (rows as any)[0],
      });
    },
  );
}
