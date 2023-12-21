import {
  ILoginDataReq,
  ILoginDataRes,
  IServerError,
  IResetPasswordRequest,
  IRefreshTokenResponse,
  IForgotPasswordRequest,
  IResendVerificationDataReq,
  IResendVerificationDataRes,
} from "interfaces/authentication";
import { IUser } from "interfaces/user";
import { CommonError } from "types";
import { api, auth } from ".";
import { IRegisterSchema } from "constants/validation/auth";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { AuthenticateParams } from "enums/auth";
import { errorHandler } from "./helpers";

export async function login(
  loginData: ILoginDataReq
): Promise<ILoginDataRes | IServerError> {
  try {
    const response = await api.post(`/auth/login`, loginData);
    return response.data;
  } catch (err) {
    throw new Error((<CommonError>err)?.response?.data?.error);
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
export async function forgotPassword(data: IForgotPasswordRequest) {
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
export async function verifyToken(token: string) {
  try {
    const response = await api.post(
      `/auth/verify-email`,
      { token },
      {
        headers: auth(),
      }
    );
    return response.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<boolean | IServerError> {
  try {
    const payload = {
      oldPassword,
      newPassword,
    };
    const result = await api.post(`/auth/me/change-password`, payload, {
      headers: auth(),
    });

    if (result.status !== 200) {
      return false;
    }

    return true;

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

export async function resendVerificationEmail(
  loginData: IResendVerificationDataReq
): Promise<IResendVerificationDataRes | IServerError> {
  try {
    const response = await api.post(
      `/auth/resend-verification-email`,
      loginData
    );
    return response.data;
  } catch (err) {
    throw new Error((<CommonError>err)?.response?.data?.error);
  }
}
