import type { AxiosRequestConfig } from 'axios';

const removeEmptyProperty = function (
  obj: Record<string, any> | null | undefined
): Record<string, any> {
  if (obj === null || obj === undefined) {
    return {};
  } else {
    for (const prop in obj) {
      if (obj[prop] === '' || obj[prop] === undefined || obj[prop] === null) {
        delete obj[prop];
      }
    }
  }

  return obj;
};

export default {
  onFulfilled: (config: AxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = {};
    }

    if (config.method === 'get') {
      // Clear empty parameters
      config.params = { ...removeEmptyProperty(config.params) };
      // Add timestamp parameter to GET requests to avoid getting data from cache
      config.params = Object.assign(config.params || {}, { _t: new Date().getTime() });
    }

    config.headers['Authorization'] =
      `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk5OTk5OTk5OSwiY29kZSI6ImFkbWluIiwicGFzc3dvcmQiOiIxMjM0NTY3OCIsImJpbmRLZXkiOiJiZmQxYTY3Ny03ZjU3LTRlMmMtYTNmZC1hZTI4OTIwMjk4ZTAiLCJjYXB0Y2hhIjoiYnp2TyIsImlhdCI6MTc1MTQxNzY2N30.3sWN16PUEhsy2rISAmdOCZ_M9tesoR6wnFUjSQFDW9Q`;

    return config;
  },
  onRejected: (error: any) => {
    console.log('request interceptor onRejected', error);
    return Promise.reject(error);
  },
};
