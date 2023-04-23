export interface Entity {
  id: number;
  profileId: number;
  title: string;
  description: string;
  duration: number;
  startingPrice: number | null;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
  finishedAt: string | null;
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
    "profileId" | "title" | "description" | "duration" | "startingPrice"
  >;
}
