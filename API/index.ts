import axios from "axios";
import { AuthenticateParams } from "enums/auth";
import { IRequestHeader, IServerError } from "interfaces/authentication";
import { getCookie, setCookie } from "cookies-next";

export const api = axios.create({
  baseURL: process.env.API_URL || "",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function auth(): IRequestHeader {
  if (typeof window === "undefined") {
    return {};
  }

  const headers = { Authorization: "", "Content-Type": "" };
  const accessToken = getCookie(AuthenticateParams.ACCESS_TOKEN);
  headers.Authorization = `Bearer ${accessToken}`;
  headers["Content-Type"] = "application/json";
  return headers;
}

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
