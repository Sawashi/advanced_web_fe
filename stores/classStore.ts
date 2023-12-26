import { getClassDetails } from "API/get/get.class.details";
import { EClassRole } from "enums/classes";
import { IClass } from "interfaces/classes";
import { makeObservable, observable } from "mobx";
import { RootStore } from "stores";

class ClassStore {
  rootStore: RootStore;
  currentClass: IClass | null = null;
  isStudentOfClass = true;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      currentClass: observable,
      isStudentOfClass: observable,
    });
  }

  setCurrentClass(classData: IClass | null) {
    this.currentClass = classData;
    this.isStudentOfClass = classData?.role === EClassRole.STUDENT;
  }

  async fetchCurrentClass() {
    try {
      if (this.currentClass?.id) {
        const classData = await getClassDetails(this.currentClass.id);
        this.setCurrentClass(classData);
      }
    } catch (error) {
      console.log(error);
    }
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
