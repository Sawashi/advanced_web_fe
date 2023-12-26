import { api, auth } from "API";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { AuthenticateParams } from "enums/auth";
import {
  ILoginDataRes,
  IRefreshTokenResponse,
  IServerError,
} from "interfaces/authentication";
import routes from "routes";

export const errorHandler = (error: IServerError): void => {
  switch (error?.statusCode) {
    case 401:
      redirectLogin();
      break;
  }
};

function redirectLogin(): void {
  setCookie(AuthenticateParams.ACCESS_TOKEN, "");
  setCookie(AuthenticateParams.REFRESH_TOKEN, "");
  window.location.href = routes.auth.login.value;
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
    setCookie(AuthenticateParams.ACCESS_TOKEN, data?.accessToken, {
      maxAge: 60 * 60 * 24 * 7,
      expires: new Date(Date.now() + data?.accessTokenExpiresIn),
    });
    return data;
  } catch (err) {
    deleteCookie(AuthenticateParams.ACCESS_TOKEN);
    deleteCookie(AuthenticateParams.REFRESH_TOKEN);
    return {} as ILoginDataRes;
  }
}
