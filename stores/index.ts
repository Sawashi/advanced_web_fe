import AuthStore from "stores/authStore";
import TestStore from "stores/testStore";
import CookiesStore from "./cookiesStore";

export class RootStore {
  testStore: TestStore;
  authStore: AuthStore;
  cookiesStore: CookiesStore;

  constructor() {
    this.testStore = new TestStore(this);
    this.authStore = new AuthStore(this);
    this.cookiesStore = new CookiesStore(this);
  }
}

export const rootStore = new RootStore();
