import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import { makePersistable } from "mobx-persist-store";
import { IClass } from "interfaces/classes";

type TSettingSidebar = {
  enrolledClasses?: IClass[];
  teachingClasses?: IClass[];
  ownedClasses?: IClass[];
};

class SettingStore {
  isLoading?: boolean | undefined = undefined;
  isHeaderLoading?: boolean | undefined = undefined;
  isSideBarExpanded: boolean = true;
  rootStore: RootStore;
  settingSidebar: TSettingSidebar | undefined = undefined;

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
    runInAction(() => {
      this.isHeaderLoading = isLoading;
    });
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

  setSettingSidebar = (settingSidebar: TSettingSidebar) => {
    this.settingSidebar = settingSidebar;
  };
}
export default SettingStore;
