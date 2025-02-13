import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id') as string;
    return Response.json({
      code: 200,
      data: {
        id: id,
        relaventPackages: ['ccc.vue', 'bbb.vue'],
        entryFile: 'ccc.vue',
      },
    });
  } catch {}
}
