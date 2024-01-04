import { getClassDetails } from "API/get/get.class.details";
import { getClassStudents } from "API/get/get.class.students";
import { EClassRole } from "enums/classes";
import {
  IAttendee,
  IClass,
  IGradeComposition,
  IStudent,
} from "interfaces/classes";
import { makeObservable, observable } from "mobx";
import { RootStore } from "stores";
import { getValidArray } from "utils/common";

class ClassStore {
  rootStore: RootStore;
  currentClass: IClass | null = null;
  compositions: IGradeComposition[] = [];
  attendeeStudents: IAttendee[] = [];
  isStudentOfClass = true;
  isTeacherOfClass = false;
  isOwnerOfClass = false;
  totalPercentage = 0;
  studentList: IStudent[] = [];

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
    this.isTeacherOfClass = classData?.role === EClassRole.TEACHER;
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

  setAttendeeStudents(students: IAttendee[]) {
    this.attendeeStudents = students;
  }

  setStudentList(students: IStudent[]) {
    this.studentList = students;
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

  async fetchClassStudents(id?: string) {
    try {
      const res = await getClassStudents(id ?? this.currentClass?.id ?? "");
      const { data: students } = res;
      this.setStudentList(students);
    } catch (error) {
      console.error(error);
    }
  }

  reset() {
    this.currentClass = null;
    this.isStudentOfClass = true;
    this.isOwnerOfClass = false;
    this.compositions = [];
    this.attendeeStudents = [];
    this.totalPercentage = 0;
    this.studentList = [];
  }
}

export default ClassStore;
