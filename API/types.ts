import { IServerError } from "interfaces/authentication";

export interface IResponseData<T extends {}> {
  data: T & IServerError;
}
