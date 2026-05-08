/// File
import * as base from './base';
import * as Model from './model';

/**
 * Delete file
 */
export const deleteFile = base.createJsonRequest<Model.DeleteFileRequest>((req) => ({
  url: `/file/${req.id}`,
  method: 'DELETE',
}));

/**
 * Get file
 */
export const getFile = base.createJsonRequest<Model.GetFileRequest, string>((req) => ({
  url: `/file/${req.id}`,
  method: 'GET',
}));

/**
 * Upload file
 */
export const uploadFile = base.createJsonRequest<Model.UploadFileRequest, string>((data) => {
  const { onUploadProgress, ...rest } = data;
  return {
    url: `/file/upload`,
    method: 'POST',
    data: rest,
    onUploadProgress,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
});
