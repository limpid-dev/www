import * as Files from "./files";

type TenderFileFormData = FormData & { __type: "TenderFileFormData" };

export const buildFormData = (file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);

  return formData as TenderFileFormData;
};

export type Entity = Omit<
  Files.Entity,
  "userId" | "certificateId" | "projectId" | "auctionId"
>;

export interface Index {
  Data: Entity[];
}

export interface Store {
  Data: Entity;
  Payload: TenderFileFormData;
}

export interface Show {
  Data: Entity;
}
