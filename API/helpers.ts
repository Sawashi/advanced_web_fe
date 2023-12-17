import { setCookie } from "cookies-next";
import { AuthenticateParams } from "enums/auth";
import { IServerError } from "interfaces/authentication";
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
