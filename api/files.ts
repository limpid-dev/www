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
  projectId?: number;
  auctionId?: number;
  tenderId?: number;
}
