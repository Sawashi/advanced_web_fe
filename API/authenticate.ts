import {
  ILoginDataReq,
  ILoginDataRes,
  IServerError,
  IResetPasswordRequest,
  IRefreshTokenResponse,
  IForgotPasswordRequest,
} from "interfaces/authentication";
import { IUser, IVerifyTokenResponse } from "interfaces/user";
import { CommonError } from "types";
import { api, auth, errorHandler } from ".";
import { IRegisterSchema } from "constants/validation/auth";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { AuthenticateParams } from "enums/auth";

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
  console.log("Sent reset password request: "+JSON.stringify(data));
  try {
    const response = await api.post(`/auth/reset-password`, data, {
      headers: auth(),
    });
    console.log("Reset password response: "+JSON.stringify(response.data));
    return response.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}
export async function forgotPassword(data: IForgotPasswordRequest) {
  console.log("Sent forgot password request: "+JSON.stringify(data));
  try {
    const response = await api.post(`/auth/forgot-password`, data, {
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
  userData: IRegisterSchema
): Promise<IServerError | IUser> {
  try {
    const response = await api.post<
      {},
      {
        data: IUser;
      }
    >(`/auth/register`, userData);
    return response?.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}

export async function getCurrentUser(): Promise<IUser> {
  try {
    let response = await api.get(`/auth/me`);
    const data: IUser = response?.data ?? {};
    return data;
  } catch (err) {
    // @ts-ignore
    if (err?.response?.status === 401) {
      await refreshToken();
      let response = await api.get(`/auth/me`, {
        headers: auth(),
      });
      const data: IUser = response?.data ?? {};
      return data;
    }
    const error = (<CommonError>err)?.response?.data?.error;
    errorHandler(error);
    return {} as IUser;
  }
}

export async function editProfile(userData: Partial<IUser>): Promise<IUser> {
  try {
    const response = await api.patch(
      `/auth/me`,
      {
        ...userData,
      },
      {
        headers: auth(),
      }
    );
    const data: IUser = response?.data ?? {};
    return data;
  } catch (err) {
    const error = (<CommonError>err)?.response?.data?.error;
    errorHandler(error);
    return {} as IUser;
  }
}

export async function refreshToken() {
  const refreshToken = getCookie(AuthenticateParams.REFRESH_TOKEN);
  try {
    const response = await api.post(
      `/auth/refresh`,
      {
        refresh: refreshToken,
      },
      {
        headers: auth(),
      }
    );
    const data: IRefreshTokenResponse = response?.data ?? {};
    setCookie(AuthenticateParams.ACCESS_TOKEN, data?.accessToken);
    return data;
  } catch (err) {
    deleteCookie(AuthenticateParams.ACCESS_TOKEN);
    deleteCookie(AuthenticateParams.REFRESH_TOKEN);
    return {} as ILoginDataRes;
  }
}
