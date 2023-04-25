export interface Entity {
  id: number;
  tenderId: number;
  profileId: number;
  createdAt: string;
  updatedAt: string;
  wonAt: string | null;
  price: number;
}

export interface Index {
  Data: Entity[];
}

export interface Store {
  Data: Entity;
  Payload: Pick<Entity, "price" | "profileId">;
}

export interface Update {
  Data: Entity;
  Payload: Pick<Entity, "price">;
}
