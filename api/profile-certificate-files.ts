import * as Files from "./files";

type CertificationFileFormData = FormData & {
  __type: "CertificationFileFormData";
};

export const buildFormData = (file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);

  return formData as CertificationFileFormData;
};

export type Entity = Omit<
  Files.Entity,
  "userId" | "certificateId" | "profileId"
>;

export interface Index {
  Data: Entity[];
}

export interface Store {
  Data: Entity;
  Payload: CertificationFileFormData;
}

export interface Show {
  Data: Entity;
}
