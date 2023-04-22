export interface Entity {
  id: number;
  profileId: number;
  title: string;
  description: string;
  location: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
  ownedIntellectualResources: string;
  ownedMaterialResources: string;
  requiredMaterialResources: string;
  requiredIntellectualResources: string;
  profitability: string;
  ownedMoneyAmount: number;
  requiredMoneyAmount: number;
  stage: string;
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
    | "title"
    | "description"
    | "profileId"
    | "location"
    | "industry"
    | "ownedIntellectualResources"
    | "ownedMaterialResources"
    | "requiredMaterialResources"
    | "requiredIntellectualResources"
    | "profitability"
    | "ownedMoneyAmount"
    | "requiredMoneyAmount"
    | "stage"
  >;
}

export interface Update {
  Data: Entity;
  Payload: Partial<
    Pick<
      Entity,
      | "title"
      | "description"
      | "location"
      | "industry"
      | "ownedIntellectualResources"
      | "ownedMaterialResources"
      | "requiredMaterialResources"
      | "requiredIntellectualResources"
      | "profitability"
      | "ownedMoneyAmount"
      | "requiredMoneyAmount"
      | "stage"
    >
  >;
}
