import { CamelCasedProperties } from "type-fest";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  verified_at: null;
}

export interface Show {
  Data: User;
  Payload: never;
}

export interface Store {
  Data: User;
  Payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
}

export interface Update {
  Data: User;
  Payload: Partial<CamelCasedProperties<Omit<User, "verified_at">>>;
}
