import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { makePersistable } from "mobx-persist-store";

class SettingStore {
  isLoading?: boolean | undefined = undefined;
  isHeaderLoading?: boolean | undefined = undefined;
  isSideBarExpanded: boolean = true;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    makePersistable(this, {
      name: "SettingStore",
      properties: ["isSideBarExpanded"],
    });
  }

  showLoading(): void {
    this.isLoading = true;
  }

  hideLoading(): void {
    this.isLoading = false;
  }

  showHeaderLoading(): void {
    this.isHeaderLoading = true;
  }

  setHeaderLoading(isLoading: boolean): void {
    this.isHeaderLoading = isLoading;
  }

  hideHeaderLoading(): void {
    this.isHeaderLoading = false;
  }

  setSideBarExpanded = (isExpanded: boolean) => {
    this.isSideBarExpanded = isExpanded;
  };

  getSideBarExpanded(): boolean {
    return this.isSideBarExpanded || false;
  }
}
export default SettingStore;
