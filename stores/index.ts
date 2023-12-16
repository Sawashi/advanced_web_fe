import AuthStore from "stores/authStore";
import CookiesStore from "./cookiesStore";

export class RootStore {
  authStore: AuthStore;
  cookiesStore: CookiesStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.cookiesStore = new CookiesStore(this);
  }
}

export const rootStore = new RootStore();
