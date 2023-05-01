export interface Entity {
  id: number;
  createdAt: string;
  url: string;
  updatedAt: string;
  name: string;
  size: number;
  mimeType: string;
  extname: string;
  userId?: number;
  certificateId?: number;
  profileId?: number;
  projectId?: number;
  auctionId?: number;
  tenderId?: number;
}

export function buildFormData(file: File | Blob) {
  const formData = new FormData();

  formData.append("file", file);

  return formData;
}
