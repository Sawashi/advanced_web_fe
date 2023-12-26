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

export async function auth(): Promise<IRequestHeader> {
  if (typeof window === "undefined") {
    return {};
  }

  const headers = { Authorization: "", "Content-Type": "" };
  let accessToken = getCookie(AuthenticateParams.ACCESS_TOKEN);
  const refreshToken = getCookie(AuthenticateParams.REFRESH_TOKEN);

  if (!accessToken && refreshToken) {
    try {
      const { data } = await api.post<IRefreshTokenResponse>("/auth/refresh", {
        refreshToken,
      });
      setCookie(AuthenticateParams.ACCESS_TOKEN, data?.accessToken, {
        expires: new Date(Date.now() + data?.accessTokenExpiresIn),
      });

      accessToken = data?.accessToken;
    } catch (e) {
      console.error("auth", e);
    }
  }

  headers.Authorization = `Bearer ${accessToken}`;
  headers["Content-Type"] = "application/json";
  return headers;
}

api.interceptors.request.use(
  async (config) => {
    config.headers = await auth();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
