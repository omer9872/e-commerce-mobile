export interface IPaginationProps<T> {
  page: number;
  limit: number;
  sort?: {
    [key in keyof T]?: 1 | -1;
  };
}

export interface ISearchProps {
  search: string | undefined;
}

export interface IPaginatedResponsePayload<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export interface ILocation {
  longitude: number;
  latitude: number;
}
