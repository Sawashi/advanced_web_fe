import { QueryClient } from "react-query";
import AuthStore from "stores/authStore";
import CookiesStore from "./cookiesStore";
import SettingStore from "./settingStore";
import ClassStore from "./classStore";

export class RootStore {
  authStore: AuthStore;
  cookiesStore: CookiesStore;
  settingStore: SettingStore;
  classStore: ClassStore;
  queryClient: QueryClient | null = null;

  constructor() {
    this.authStore = new AuthStore(this);
    this.cookiesStore = new CookiesStore(this);
    this.settingStore = new SettingStore(this);
    this.classStore = new ClassStore(this);
    this.queryClient = null;
  }

  setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }
}

export const rootStore = new RootStore();
