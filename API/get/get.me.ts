import { api } from "API";
import { errorHandler, refreshToken } from "API/helpers";
import { IUser } from "interfaces/user";
import { CommonError } from "types";

export async function getCurrentUser(): Promise<IUser> {
  try {
    let response = await api.get(`/auth/me`);
    const data: IUser = response?.data ?? {};
    return data;
  } catch (err) {
    // // @ts-ignore
    // if (err?.response?.status === 401) {
    //   try {
    //     await refreshToken();
    //     let response = await api.get(`/auth/me`);
    //     const data: IUser = response?.data ?? {};
    //     return data;
    //   } catch (error) {}
    // }
    const error = (<CommonError>err)?.response?.data?.error;
    errorHandler(error);
    return {} as IUser;
  }
}
