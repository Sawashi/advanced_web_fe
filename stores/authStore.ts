import { action, makeObservable, observable, runInAction } from "mobx";
import { getCurrentUser, login as loginAPI } from "API/authenticate";
import { AuthenticateParams, ErrorMessageEnum } from "enums/auth";
import { ILoginDataReq, ILoginDataRes } from "interfaces/authentication";
import { IUser } from "interfaces/user";
import { RootStore } from "stores";
import { CommonError } from "types";

class AuthStore {
  rootStore: RootStore;

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
  }

  public accessToken: string = "";
  public isLoading: boolean = false;
  public user: IUser = {
    email: "",
  };
  public forgotPasswordEmail: string = "";

  public async login(loginData: ILoginDataReq): Promise<void> {
    this.isLoading = true;

    try {
      const response = await loginAPI(loginData);
      const { token, isInactive } = response as ILoginDataRes;

      if (isInactive) {
        this.isLoading = false;
        throw new Error(ErrorMessageEnum.ACCOUNT_DISABLED_PLEASE_CONTACT_ADMIN);
      }

      if (typeof token === "string") {
        localStorage.setItem(AuthenticateParams.ACCESS_TOKEN, token);
        this.accessToken = token;
        await this.fetchCurrentUser();
        this.isLoading = false;
      }
    } catch (error) {
      this.isLoading = false;
      console.error(error);
      throw new Error((<CommonError>error)?.message);
    }
  }

  public async fetchCurrentUser() {
    runInAction(async () => {
      this.isLoading = true;
      this.accessToken = localStorage.getItem(
        AuthenticateParams.ACCESS_TOKEN
      ) as string;
      this.user = await getCurrentUser();
      this.isLoading = false;
    });
  }

  public logout() {
    this.user = {} as IUser;
    this.accessToken = "";
    this.isLoading = false;
    localStorage.setItem(AuthenticateParams.ACCESS_TOKEN, "");
  }

  public setForgotPasswordEmail(email: string) {
    this.forgotPasswordEmail = email;
  }

  public getLocalStorageAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AuthenticateParams.ACCESS_TOKEN);
    }
    return null;
  }
}

export default AuthStore;
