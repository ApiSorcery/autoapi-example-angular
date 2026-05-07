import type { AxiosResponse } from 'axios';
import type { BlobResp, Result } from '../types/axios';

export default {
  onFulfilled: async (res: AxiosResponse<Result>) => {
    if (res.data.status === 0) {
      return res.data.data;
    }

    // Return blob format for file download
    if (res.data instanceof Blob) {
      return <BlobResp>{
        data: res.data,
        type: res.headers['content-type'],
        name: decodeURIComponent(
          res.headers['content-disposition'].substring(
            res.headers['content-disposition'].indexOf('=') + 1
          )
        ),
      };
    }

    let dataErrMsg = res.data.message || 'Request failed, please try again later...';
    return Promise.reject(new Error(dataErrMsg));
  },
  onRejected: async (error: any) => {
    let errMsg =
      error.message || (error.response && error.response.data.message) || 'Network error...';
    if (errMsg.indexOf('timeout') > -1) {
      errMsg = 'Request timeout, please try again later...';
    }
    return Promise.reject(error);
  },
};
