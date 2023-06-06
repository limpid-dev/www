declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_API_URL: string;
    readonly IRON_SESSION_PASSWORD: string;
  }
}
