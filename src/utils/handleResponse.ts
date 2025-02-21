import { NextRequest } from 'next/server';

const handleResponse = async (
  req: NextRequest,
  cb: (
    req: NextRequest,
    handleCompleted: (params: ResponseBody) => any,
    handleError: (params: string) => any,
    ...params: any
  ) => any,
) => {
  try {
    const responseBody: ResponseBody = await new Promise((resolve, reject) => {
      cb(req, resolve, reject);
    });
    return Response.json({
      code: 200,
      msg: responseBody.msg,
      data: responseBody.data,
    });
  } catch (err: any) {
    return Response.json({
      code: ResponseCode[getResponseMsgKeyByValue(err)],
      msg: err,
    });
  }
};
export default handleResponse;

type ResponseMsgType = {
  serverError: string;
  paramsError: string;
  fileError: string;
};

export const ResponseMsg: ResponseMsgType = {
  serverError: '服务器错误!',
  paramsError: '参数不完整或格式错误！',
  fileError: '文件不存在!',
};

const getResponseMsgKeyByValue = (value: string): any => {
  return Object.keys(ResponseMsg).find(
    (key: any) => ResponseMsg[key as keyof ResponseMsgType] === value,
  );
};
export type ResponseBody = {
  msg: string;
  data?: any;
};

export enum ResponseCode {
  serverError = 500,
  paramsError = 405,
  fileError = 406,
}
