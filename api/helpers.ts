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
  filters?: Record<keyof E, string>;
  sort?: Record<keyof E, "asc" | "desc">;
  search?: string;
}
