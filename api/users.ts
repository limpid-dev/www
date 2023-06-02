import * as File from "./files";

export interface Entity {
  id: number;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  createdAt: string;
  updatedAt: string;
  patronymic: string;
  email_verified_at: null;
  selected_profile_id?: number | null;
  fileId: number | null;
  file: File.Entity;
}

export interface Show {
  Data: Omit<Entity, "password">;
}

export interface Store {
  Data: Omit<Entity, "password">;
  Payload: Pick<
    Entity,
    "email" | "first_name" | "last_name" | "password" | "selected_profile_id"
  >;
}

export interface Update {
  Data: Omit<Entity, "password">;
  Payload: Partial<
    Pick<
      Entity,
      "email" | "first_name" | "last_name" | "password" | "selected_profile_id"
    >
  >;
}
