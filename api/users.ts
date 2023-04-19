export interface Entity {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt: null;
}

export interface Show {
  Data: Omit<Entity, "password">;
}

export interface Store {
  Data: Omit<Entity, "password">;
  Payload: Pick<Entity, "email" | "firstName" | "lastName" | "password">;
}

export interface Update {
  Data: Omit<Entity, "password">;
  Payload: Partial<
    Pick<Entity, "email" | "firstName" | "lastName" | "password">
  >;
}