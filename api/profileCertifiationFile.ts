export interface Entity {
  size: number;
  mimeType: string;
  extname: string;
  name: string;
  certificateId: number;
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
  Payload: Pick<Entity, "name" | "certificateId" | "mimeType">;
}

export interface Update {
  Data: Entity;
  Payload: Partial<Pick<Entity, "name" | "certificateId" | "mimeType">>;
}
