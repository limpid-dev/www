export interface Entity {
  id: number;
  profileId: number | null;
  organizationId: number | null;
  projectId: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt: string;
  message?: string;
}

export interface Index {
  Data: Entity[];
}

export interface Store {
  Data: Entity;
  Payload: Pick<Entity, "profileId" | "message">;
}

export interface Update {
  Data: Entity;
  Payload: Partial<Pick<Entity, "profileId">>;
}
