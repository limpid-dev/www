export interface Entity {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: "EMAIL" | "MOBILE" | "URL";
  name: string;
  value: string;
  profileId: number;
}

export interface Index {
  Data: Entity[];
}

export interface Show {
  Data: Entity;
}

export interface Store {
  Data: Entity;
  Payload: Pick<Entity, "type" | "name" | "value">;
}

export interface Update {
  Data: Entity;
  Payload: Pick<Entity, "type" | "name" | "value">;
}
