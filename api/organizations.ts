export interface Entity {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  bin: string;
  description: string;
  industry: string;
  type: string;
  ownedIntellectualResources: string;
  ownedMaterialResources: string;
  perfomance: string;
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
    | "name"
    | "bin"
    | "industry"
    | "type"
    | "perfomance"
    | "description"
    | "ownedIntellectualResources"
    | "ownedMaterialResources"
  >;
}

export interface Update {
  Data: Entity;
  Payload: Partial<
    Pick<
      Entity,
      | "name"
      | "bin"
      | "description"
      | "industry"
      | "ownedIntellectualResources"
      | "ownedMaterialResources"
      | "type"
      | "perfomance"
    >
  >;
}
