import pool from '@/app/lib/db';
import handleResponse, { ResponseMsg } from '@/utils/handleResponse';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import useAuth from './hooks/useAuth';

export async function GET(req: NextRequest) {
  return await handleResponse(
    req,
    async (req, handleCompleted, handleError) => {
      const headersList = await headers();
      const Authorization = headersList.get('Authorization');

      try {
        const authRes = await (
          await fetch(process.env.AUTH_ADDR as string, {
            headers: {
              token: Authorization,
              rejectUnauthorized: false,
            } as any,
          })
        ).json();
        if (authRes.code === 200) {
          handleCompleted({
            msg: '校验成功!',
            data: true,
          });
        } else {
          handleError(ResponseMsg.authError);
        }
      } catch (err) {
        handleError(ResponseMsg.serverError);
      }
    },
  );
}
