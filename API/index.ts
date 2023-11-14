import axios from "axios";
import { AuthenticateParams } from "enums/auth";
import { IRequestHeader, IServerError } from "interfaces/authentication";

const { API_URL } = process.env;

export const api = axios.create({
  baseURL: API_URL,
});

export function auth(): IRequestHeader {
  if (typeof window === "undefined") {
    return {};
  }

  const headers = { Authorization: "" };
  const accessToken =
    localStorage.getItem(AuthenticateParams.ACCESS_TOKEN) || "";
  headers.Authorization = `Bearer ${accessToken}`;

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
  localStorage.setItem(AuthenticateParams.ACCESS_TOKEN, "");
  //TODO: enable when integrate login feature
  //Router.replace(routes.home.value)
}
