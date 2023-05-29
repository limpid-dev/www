export interface Entity {
  profile: {
    id: number;
    user_id: number;
    display_name: string;
    description: string;
    location: string;
    industry: string;
    createdAt: string;
    updatedAt: string;
    ownedIntellectualResources: string;
    ownedMaterialResources: string;
  };
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
    Entity["profile"],
    | "display_name"
    | "description"
    | "location"
    | "industry"
    | "ownedIntellectualResources"
    | "ownedMaterialResources"
  >;
}

export interface Update {
  Data: Entity;
  Payload: Partial<
    Pick<
      Entity["profile"],
      | "display_name"
      | "description"
      | "location"
      | "industry"
      | "ownedIntellectualResources"
      | "ownedMaterialResources"
    >
  >;
}
