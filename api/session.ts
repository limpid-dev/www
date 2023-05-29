import * as Users from "./users";

export interface Show {
  Data: Users.Show["Data"];
}

export interface Store {
  Payload: {
    email: string;
    password: string;
  };
  Data: {
    type: "bearer";
    token: string;
  };
}
