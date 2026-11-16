import { request, API_BASE_URL } from './client';

export interface FileUploadResponse {
  fileName: string;
  fileUrl: string;
}

export const fileApi = {
  uploadCv: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return request<FileUploadResponse>('/files/upload-cv', {
      method: 'POST',
      body: formData,
    });
  },

  getDownloadUrl: (fileName: string): string => {
    return `${API_BASE_URL}/files/download/${encodeURIComponent(fileName)}`;
  },
};

