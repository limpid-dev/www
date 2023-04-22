export interface Entity {
  id: number;
  profileId: number;
  title: string;
  description: string;
  organization: string;
  startedAt: string;
  finishedAt: string;
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
  Payload: Pick<
    Entity,
    "title" | "description" | "organization" | "startedAt" | "finishedAt"
  >;
}

export interface Update {
  Data: Entity;
  Payload: Partial<
    Pick<
      Entity,
      "title" | "description" | "organization" | "startedAt" | "finishedAt"
    >
  >;
}
