export interface Show {
  Data: {
    healthy: boolean;
    report: Record<
      string,
      {
        displayName: string;
        health: {
          healthy: boolean;
          message?: string;
        };
        meta?: unknown;
      }
    >;
  };
  Payload: never;
}
