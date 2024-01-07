import { IServerError } from "interfaces/authentication";

export interface IResponseData<T extends {}> extends IServerError {
  data: T & IServerError;
}

export type URLQueryType<T> = {
  sortBy?: string | number;
  limit?: string | number;
  exclude?: string | number | null;
  page?: string | number;
  filter?: Object;
} & T;

export type ID = string | number;