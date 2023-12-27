import { IStudent } from "interfaces/classes";
import React, { useState, useMemo } from "react";
import { useStores } from "hooks/useStores";
import { checkValidArray, getValidArray } from "utils/common";
import { useGetClassGradeStudents } from "API/get/get.class.students";
import { useGetClassAttendees } from "API/get/get.class.attendees";
import { EClassRole } from "enums/classes";
import { Props } from ".";

const useViewModel = ({ details }: Props) => {
  const { settingStore, classStore, authStore } = useStores();
  const { isStudentOfClass } = classStore;
  const [orderBy, setOrderBy] = useState<number>(1);
  const [sort, setSort] = useState<string>("id");
  const [studentsList, setStudentsList] = useState<IStudent[]>();

  const {
    data: dataClassStudents,
    isLoading: isClassStudentsLoading,
    refetch: refetchClassStudents,
  } = useGetClassGradeStudents(details?.id ?? "", {
    sortBy: `${sort}:${orderBy === 1 ? "ASC" : "DESC"}`,
  });

  const {
    data: attendees,
    isLoading: isAttendeesLoading,
    refetch: refetchAttendees,
  } = useGetClassAttendees(details?.id ?? "", !isStudentOfClass);

  const unMappedAttendeeStudentList = useMemo(() => {
    const studentAttendees = getValidArray(attendees?.data)?.filter(
      (attendee) => attendee?.role === EClassRole.STUDENT
    );
    console.log(studentAttendees);

    return getValidArray(studentAttendees)?.filter((attendee) => {
      const isMapped = getValidArray(studentsList)?.some(
        (student) => student?.user?.id === attendee?.user?.id
      );
      return !isMapped;
    });
  }, [attendees?.data, studentsList]);

  const isAssignable = useMemo(() => {
    if (!isStudentOfClass) return true;
    const isUserMapped = studentsList?.some(
      (item) => item?.user?.id === authStore?.user?.id
    );
    return !isUserMapped;
  }, [studentsList, authStore?.user, isStudentOfClass]);

  const onUnmappingStudent = async (userId: string) => {};

  const onMappingStudent = async (userId: string, studentId: string) => {};

  settingStore?.setHeaderLoading(isClassStudentsLoading || isAttendeesLoading);

  React.useEffect(() => {
    if (checkValidArray(dataClassStudents?.data)) {
      setStudentsList(getValidArray(dataClassStudents?.data));
    }
  }, [dataClassStudents]);

  return {
    studentsList,
    isStudentOfClass,
    isAssignable,
    onMappingStudent,
    onUnmappingStudent,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    unMappedAttendeeStudentList,
  };
};

export default useViewModel;
