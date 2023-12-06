import { action, makeObservable, observable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";

import {
  editProfile,
  getCurrentUser,
  login as loginAPI,
  resendVerificationEmail,
} from "API/authenticate";
import { AuthenticateParams, ErrorMessageEnum } from "enums/auth";
import { ILoginDataReq, ILoginDataRes } from "interfaces/authentication";
import { IUser } from "interfaces/user";
import { RootStore } from "stores";
import { CommonError } from "types";

class AuthStore {
  rootStore: RootStore;
  public accessToken: string = "";
  public isLoading: boolean = false;
  public user: IUser = {
    email: "",
  };
  public forgotPasswordEmail: string = "";
  public errorSSO: string = "";

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      isLoading: observable,
      user: observable,
      accessToken: observable,
      login: action,
      fetchCurrentUser: action,
      logout: action,
    });

    makePersistable(this, {
      name: "authStore",
      properties: ["user"],
    });
  }

  public async login(loginData: ILoginDataReq): Promise<void> {
    this.isLoading = true;
    try {
      const response = await loginAPI(loginData);
      const {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
      } = response as ILoginDataRes;
      this.rootStore.cookiesStore.setItem(
        AuthenticateParams.ACCESS_TOKEN,
        accessToken,
        {
          expiresIn: accessTokenExpiresIn,
        }
      );
      this.rootStore.cookiesStore.setItem(
        AuthenticateParams.REFRESH_TOKEN,
        refreshToken,
        {
          expiresIn: refreshTokenExpiresIn,
        }
      );
      await this.fetchCurrentUser();
    } catch (error) {
      this.isLoading = false;
      throw new Error((<CommonError>error)?.message);
    }
  }

  public async fetchCurrentUser() {
    runInAction(async () => {
      this.isLoading = true;
      const accessToken = this.rootStore.cookiesStore.getItem(
        AuthenticateParams.ACCESS_TOKEN
      );
      this.accessToken = accessToken || "";
      this.user = await getCurrentUser();
      this.isLoading = false;
    });
  }

  public logout() {
    this.user = {} as IUser;
    this.accessToken = "";
    this.isLoading = false;
    this.rootStore.cookiesStore.removeItem(AuthenticateParams.ACCESS_TOKEN);
    this.rootStore.cookiesStore.removeItem(AuthenticateParams.REFRESH_TOKEN);
  }

  public setForgotPasswordEmail(email: string) {
    this.forgotPasswordEmail = email;
  }

  public checkAccessToken(): boolean {
    if (typeof window !== "undefined") {
      return this.rootStore.cookiesStore.hasItem(
        AuthenticateParams.ACCESS_TOKEN
      );
    }
    return false;
  }

  public async editProfile(data: Partial<IUser>) {
    const res = await editProfile(data);
    if (res) {
      this.user = {
        ...this.user,
        ...res,
      };
    }
  }

  public async resendActivationEmail(email: string) {
    try {
      await resendVerificationEmail({ email });
    } catch (error) {
      throw new Error((<CommonError>error)?.message);
    }
  }

  public setSSOError(error: string) {
    this.errorSSO = error;
  }

  public getSSOError() {
    return this?.errorSSO;
  }
}

export default AuthStore;
