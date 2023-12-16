import AuthStore from "stores/authStore";
import CookiesStore from "./cookiesStore";
import SettingStore from "./settingStore";

export class RootStore {
  authStore: AuthStore;
  cookiesStore: CookiesStore;
  settingStore: SettingStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.cookiesStore = new CookiesStore(this);
    this.settingStore = new SettingStore(this);
  }
}

export const rootStore = new RootStore();
