import { action, makeObservable, observable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { resendVerificationEmail } from "API/post/post.auth.resend-email";
import { AuthenticateParams } from "enums/auth";
import { ILoginDataReq, ILoginDataRes } from "interfaces/authentication";
import { IUser } from "interfaces/user";
import { RootStore } from "stores";
import { CommonError } from "types";
import { getCurrentUser } from "API/get/get.me";
import { postLogin } from "API/post/post.auth.login";
import { editProfile } from "API/patch/patch.auth.profile";

class AuthStore {
  rootStore: RootStore;
  public accessToken: string = "";
  public isLoading: boolean = false;
  public isAuthenticated: boolean = false;
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
      const response = await postLogin(loginData);
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
    } finally {
      this.isLoading = false;
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
      this.isAuthenticated = !!this.user?.id;
    });
  }

  public logout() {
    this.user = {} as IUser;
    this.accessToken = "";
    this.isLoading = false;
    this.isAuthenticated = false;
    this.rootStore.classStore.reset();
    this.rootStore.cookiesStore.removeItem(AuthenticateParams.ACCESS_TOKEN);
    this.rootStore.cookiesStore.removeItem(AuthenticateParams.REFRESH_TOKEN);
    this.rootStore.queryClient?.clear();
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
