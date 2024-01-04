import { IServerError } from "interfaces/authentication";

export interface IResponseData<T extends {}> extends IServerError {
  data: T & IServerError;
}
