import { api } from "API";
import { UsersApiRouters } from "API/router.api";
import {
  ILoginDataReq,
  ILoginDataRes,
  IServerError,
} from "interfaces/authentication";
import { CommonError } from "types";

export async function postLogin(
  loginData: ILoginDataReq
): Promise<ILoginDataRes | IServerError> {
  try {
    const response = await api.post(`/auth/login`, loginData);
    return response.data;
  } catch (err) {
    throw new Error((<CommonError>err)?.response?.data?.error);
  }
}
