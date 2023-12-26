import { getClassDetails } from "API/get/get.class.details";
import { EClassRole } from "enums/classes";
import { IClass, IGradeComposition } from "interfaces/classes";
import { makeObservable, observable } from "mobx";
import { RootStore } from "stores";
import { getValidArray } from "utils/common";

class ClassStore {
  rootStore: RootStore;
  currentClass: IClass | null = null;
  compositions: IGradeComposition[] = [];
  isStudentOfClass = true;
  isOwnerOfClass = false;
  totalPercentage = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      currentClass: observable,
      isStudentOfClass: observable,
      isOwnerOfClass: observable,
    });
  }

  setCurrentClass(classData: IClass | null) {
    this.currentClass = classData;
    this.isStudentOfClass = classData?.role === EClassRole.STUDENT;
    this.isOwnerOfClass =
      classData?.owner?.id === this.rootStore?.authStore?.user?.id;
  }

  setCompositions(compositions: IGradeComposition[]) {
    this.compositions = compositions;
    this.totalPercentage = getValidArray(compositions).reduce(
      (acc, cur) => acc + (cur?.percentage ?? 0),
      0
    );
  }

  async fetchCurrentClass() {
    try {
      if (this.currentClass?.id) {
        const classData = await getClassDetails(this.currentClass.id);
        this.setCurrentClass(classData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  reset() {
    this.currentClass = null;
    this.isStudentOfClass = true;
    this.isOwnerOfClass = false;
    this.compositions = [];
    this.totalPercentage = 0;
  }
}

export default ClassStore;
