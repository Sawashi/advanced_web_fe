import {
  ILoginDataReq,
  ILoginDataRes,
  IForgotPasswordRequest,
  ISignUpData,
  IServerError,
  IResetPasswordRequest,
} from "interfaces/authentication";
import { IUser, IVerifyTokenResponse } from "interfaces/user";
import { CommonError } from "types";
import { api, auth, errorHandler } from ".";

export async function login(
  loginData: ILoginDataReq
): Promise<ILoginDataRes | IServerError> {
  try {
    const response = await api.post(`/auth/login`, loginData);
    return response.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}


export async function resetPassword(data: IResetPasswordRequest) {
  try {
    const response = await api.post(`/auth/reset-password`, data, {
      headers: auth(),
    });
    return response.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}
export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<void | IServerError> {
  try {
    const passwords = {
      oldPassword,
      newPassword,
    };
    await api.patch(`/auth/change-password`, passwords, {
      headers: auth(),
    });
    return undefined;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}

export async function signUp(
  userData: Omit<ISignUpData, "id">
): Promise<IServerError> {
  try {
    const response = await api.post(`/auth/sign-up`, userData);
    return response?.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}

export async function getCurrentUser(): Promise<IUser> {
  try {
    const response = await api.get(`/auth/me`, {
      headers: auth(),
    });
    const data: IUser = response?.data ?? {};
    return data;
  } catch (err) {
    const error = (<CommonError>err)?.response?.data?.error;
    errorHandler(error);
    return {} as IUser;
  }
}

export async function verifyToken(
  token: string
): Promise<IVerifyTokenResponse> {
  try {
    const response = await api.post(
      `/auth/verify-token`,
      JSON.stringify(token),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data: IVerifyTokenResponse = response?.data ?? {};
    return data;
  } catch (err) {
    const error = (<CommonError>err)?.response?.data?.error;
    errorHandler(error);
    return {} as IVerifyTokenResponse;
  }
}
