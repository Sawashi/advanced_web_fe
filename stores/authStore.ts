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
      const { accessToken, refreshToken } = response as ILoginDataRes;
      this.rootStore.cookiesStore.setItem(
        AuthenticateParams.ACCESS_TOKEN,
        accessToken
      );
      this.rootStore.cookiesStore.setItem(
        AuthenticateParams.REFRESH_TOKEN,
        refreshToken
      );
    } catch (error) {
      this.isLoading = false;
      console.error(error);
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
}

export default AuthStore;
