import * as Files from "./files";

export type Entity = Omit<
  Files.Entity,
  "userId" | "certificateId" | "profileId"
>;

export interface Index {
  Data: Entity[];
}

export interface Store {
  Data: Entity;
  Payload: FormData;
}

export interface Show {
  Data: Entity;
}
