import { EClassRole } from "enums/classes";
import { IClass } from "interfaces/classes";
import { makeObservable } from "mobx";
import { RootStore } from "stores";

class ClassStore {
  rootStore: RootStore;
  currentClass: IClass | null = null;
  isStudentOfClass = true;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {});
  }

  setCurrentClass(classData: IClass | null) {
    this.currentClass = classData;
    this.isStudentOfClass = classData?.role === EClassRole.STUDENT;
  }

  resetCurrentClass() {
    this.currentClass = null;
    this.isStudentOfClass = true;
  }

  reset() {
    this.resetCurrentClass();
  }
}

export default ClassStore;
