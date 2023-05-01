export interface Entity {
  title: string;
  description: string;
  institution: string;
  startedAt: string;
  finishedAt: string;
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
  Payload: Pick<
    Entity,
    "title" | "description" | "institution" | "startedAt" | "finishedAt"
  >;
}

export interface Update {
  Data: Entity;
  Payload: Partial<
    Pick<
      Entity,
      "title" | "description" | "institution" | "startedAt" | "finishedAt"
    >
  >;
}
