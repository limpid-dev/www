export interface Entity {
  id: number;
  profile_id: number;
  title: string;
  description: string;
  location: string;
  industry: string;
  stage: string;
  createdAt: string;
  updatedAt: string;
  required_money_amount: number;
  owned_money_amount: number;
  required_intellectual_resources: string;
  owned_intellectual_resources: string;
  required_material_resources: string;
  owned_material_resources: string;
  profitability: string;
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
    | "location"
    | "industry"
    | "owned_intellectual_resources"
    | "owned_material_resources"
    | "required_material_resources"
    | "required_intellectual_resources"
    | "profitability"
    | "owned_money_amount"
    | "required_money_amount"
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
      | "owned_intellectual_resources"
      | "owned_material_resources"
      | "required_material_resources"
      | "required_intellectual_resources"
      | "profitability"
      | "owned_money_amount"
      | "required_money_amount"
      | "stage"
    >
  >;
}
