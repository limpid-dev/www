import * as Users from "./users";

export interface Show {
  Data: Users.Show["Data"];
}

export interface Store<M extends "api" | "web"> {
  Payload: {
    email: string;
    password: string;
    mode: M;
  };
  Data: M extends "api"
    ? {
        type: "bearer";
        token: string;
      }
    : never;
}
