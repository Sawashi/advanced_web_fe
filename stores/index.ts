import { QueryClient } from "react-query";
import AuthStore from "stores/authStore";
import CookiesStore from "./cookiesStore";
import SettingStore from "./settingStore";

export class RootStore {
  authStore: AuthStore;
  cookiesStore: CookiesStore;
  settingStore: SettingStore;
  queryClient: QueryClient | null = null;

  constructor() {
    this.authStore = new AuthStore(this);
    this.cookiesStore = new CookiesStore(this);
    this.settingStore = new SettingStore(this);
    this.queryClient = null;
  }

  setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }
}

export const rootStore = new RootStore();
