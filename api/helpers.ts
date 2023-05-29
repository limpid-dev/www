import { NonUndefined } from "react-hook-form";

export interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  previous_page_url: string | null;
}

export const buildQueryParamsUrl = (
  url: string | URL,
  query: Record<string, string | number | boolean>
) => {
  const _url = new URL(url);

  Object.entries(query).forEach(([key, value]) => {
    _url.searchParams.append(key, value.toString());
  });

  return _url;
};

export type FetchRequestInit = NonUndefined<Parameters<typeof fetch>[1]>;
