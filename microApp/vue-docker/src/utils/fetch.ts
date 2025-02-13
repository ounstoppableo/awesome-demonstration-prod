'use client';
class FetchInterceptor {
  baseURL: string;
  defaultOptions: any;
  constructor(baseURL = '', defaultOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = defaultOptions;
  }

  async request(url: string, options: any = {}) {
    // 合并默认配置和传入的配置
    const finalOptions = { ...this.defaultOptions, ...options };
    finalOptions.headers = {
      ...this.defaultOptions.headers,
      ...options.headers,
    };

    // 请求拦截处理（比如添加认证 token）
    if (!finalOptions.headers['Authorization']) {
      const token = localStorage.getItem('token');
      if (token) {
        finalOptions.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(this.baseURL + url, finalOptions);
      return this.responseHandler(response);
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  async responseHandler(response: any) {
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`,
      );
    }
    return response.json();
  }

  errorHandler(error: any) {
    console.error('Fetch error:', error);
    return Promise.reject(error);
  }
}
const fetchInterceptor = new FetchInterceptor(location.origin, {
  headers: {
    'Content-Type': 'application/json',
  },
});
const request = fetchInterceptor.request.bind(fetchInterceptor);

export default request;
