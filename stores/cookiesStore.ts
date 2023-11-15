import { makeObservable } from "mobx";
import { RootStore } from "stores";
import { setCookie, getCookie, hasCookie } from "cookies-next";

class CookiesStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {});
  }

  setItem(key: string, value: string) {
    setCookie(key, value, {
      maxAge: 3 * 24 * 60 * 60,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });
  }

  getItem(key: string) {
    return getCookie(key);
  }

  removeItem(key: string) {
    setCookie(key, "", {
      maxAge: -1,
      expires: new Date(Date.now() - 1),
    });
  }

  hasItem(key: string): boolean {
    return hasCookie(key);
  }
}

export default CookiesStore;
