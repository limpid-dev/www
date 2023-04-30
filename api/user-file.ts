import * as Files from "./files";

type UserFileFormData = FormData & { __type: "UserFileFormData" };

export const buildFormData = (file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);

  return formData as UserFileFormData;
};

export type Entity = Omit<Files.Entity, "userId">;

export interface Index {
  Data: Entity[];
}

export interface Store {
  Data: Entity;
  Payload: UserFileFormData;
}

export interface Show {
  Data: Entity;
}
