export interface Entity {
  id: number;
  userId: number;
  title: string;
  description: string;
  location: string;
  industry: string;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Index {
  Data: Entity[];
}

export interface Show {
  Data: Entity;
}

export interface Store {
  Data: Entity;
  Payload: Pick<Entity, "title" | "description" | "location" | "industry">;
}

export interface Update {
  Data: Entity;
  Payload: Partial<
    Pick<Entity, "title" | "description" | "location" | "industry">
  >;
}
