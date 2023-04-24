import { NonUndefined } from "react-hook-form";

export interface Meta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface QueryParams<E> {
  page: number;
  perPage: number;
  filters?: Partial<E>;
  sort?: Record<keyof E, "asc" | "desc">;
  search?: string;
}

export const buildQueryParamsUrl = <E>(
  url: string | URL,
  { page, perPage, filters, sort, search }: QueryParams<E>
) => {
  const _url = new URL(url);

  _url.searchParams.append("page", page.toString());
  _url.searchParams.append("perPage", perPage.toString());

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      _url.searchParams.append(`filter[${key}]`, `${value}`);
    });
  }

  if (sort) {
    Object.entries(sort).forEach(([key, value]) => {
      _url.searchParams.append(`sort[]`, value === "asc" ? key : `-${key}`);
    });
  }

  if (search) {
    _url.searchParams.append("search", search);
  }

  return _url;
};

export type FetchRequestInit = NonUndefined<Parameters<typeof fetch>[1]>;
