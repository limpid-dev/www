export interface Store {
  Payload: {
    email: string;
  };
}

export interface Update {
  Payload: {
    email: string;
    token: string;
  };
}
