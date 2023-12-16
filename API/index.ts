import axios from "axios";
import { AuthenticateParams } from "enums/auth";
import { IRequestHeader } from "interfaces/authentication";
import { getCookie } from "cookies-next";

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

api.interceptors.request.use(
  (config) => {
    config.headers = auth();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
