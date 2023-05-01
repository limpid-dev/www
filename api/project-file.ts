import * as Files from "./files";

type ProjectFileFormData = FormData & { __type: "ProjectFileFormData" };

export const buildFormData = (file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);

  return formData as ProjectFileFormData;
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
  Payload: ProjectFileFormData;
}

export interface Show {
  Data: Entity;
}
