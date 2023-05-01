export interface Entity {
  name: string;
  profileId: number;
  createdAt: string;
  updatedAt: string;
  id: number;
}

export interface Index {
  Data: Entity[];
}

export interface Show {
  Data: Entity;
}

export interface Store {
  Data: Entity;
  Payload: Pick<Entity, "name">;
}

export interface Update {
  Data: Entity;
  Payload: Partial<Pick<Entity, "name">>;
}
