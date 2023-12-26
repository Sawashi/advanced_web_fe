import axios from "axios";
import { AuthenticateParams } from "enums/auth";
import {
  IRefreshTokenResponse,
  IRequestHeader,
} from "interfaces/authentication";
import { getCookie, setCookie } from "cookies-next";

export const api = axios.create({
  baseURL: process.env.API_URL || "",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return status >= 200 && status < 500 && status !== 401;
  },
});

export function auth(): IRequestHeader {
  if (typeof window === "undefined") {
    return {};
  }

  const headers = { Authorization: "", "Content-Type": "" };
  const accessToken = getCookie(AuthenticateParams.ACCESS_TOKEN);
  const refreshToken = getCookie(AuthenticateParams.REFRESH_TOKEN);

  if (!accessToken && refreshToken) {
    api
      .post<IRefreshTokenResponse>("/auth/refresh", {
        refreshToken,
      })
      .then((response) => {
        const { accessToken, accessTokenExpiresIn } = response.data;
        setCookie(AuthenticateParams.ACCESS_TOKEN, accessToken, {
          expires: new Date(Date.now() + accessTokenExpiresIn),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  headers.Authorization = `Bearer ${accessToken}`;
  headers["Content-Type"] = "application/json";
  return headers;
}

api.interceptors.request.use(
  (config) => {
    config.headers = auth();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
