import { IStudent } from "interfaces/classes";
import React, { useState, useMemo } from "react";
import { useStores } from "hooks/useStores";
import { checkValidArray, getValidArray } from "utils/common";
import { useGetClassGradeStudents } from "API/get/get.class.students";
import { useGetClassAttendees } from "API/get/get.class.attendees";
import { EClassRole } from "enums/classes";
import { Props } from ".";
import { usePatchMapStudent } from "API/patch/patch.class.map-student";
import { useToast } from "@chakra-ui/react";
import { usePatchUnMapStudent } from "API/patch/patch.class.unmap-student";
import { useUploadClassStudentList } from "API/post/post.class.upload-student-list";
import { useDeleteStudentList } from "API/delete/delete.class.students-list";

const useViewModel = ({ details }: Props) => {
  const { settingStore, classStore, authStore } = useStores();
  const toast = useToast();
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

  const { mutateAsync: mapStudent, isLoading: isMappingStudentLoading } =
    usePatchMapStudent(details?.id ?? "");

  const { mutateAsync: unMapStudent, isLoading: isUnMappingStudentLoading } =
    usePatchUnMapStudent(details?.id ?? "");

  const { mutateAsync: uploadStudentList, isLoading: isUploadingStudentList } =
    useUploadClassStudentList();

  const { mutateAsync: deleteStudentList, isLoading: isDeletingStudentList } =
    useDeleteStudentList(details?.id ?? "");

  const unMappedAttendeeStudentList = useMemo(() => {
    const studentAttendees = getValidArray(attendees?.data)?.filter(
      (attendee) => attendee?.role === EClassRole.STUDENT
    );

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

  const refresh = async () => {
    await Promise.all([refetchClassStudents(), refetchAttendees()]);
  };

  const onUnmappingStudent = async (userId: string) => {
    try {
      const response = await unMapStudent({
        userId,
        classId: details?.id ?? "",
      });
      if (response?.data) {
        toast({
          title: "Success",
          description: "Student unmapped successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Student unmapped failed",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      refresh();
    }
  };

  const onMappingStudent = async (userId: string, studentId: string) => {
    try {
      const response = await mapStudent({
        userId,
        studentId,
        classId: details?.id ?? "",
      });
      if (response?.data) {
        toast({
          title: "Success",
          description: "Student mapped successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Student mapped failed",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      refresh();
    }
  };

  const onUploadingStudentList = async (file: File) => {
    if (file) {
      if (file.type === "text/csv") {
        try {
          const response = await uploadStudentList({
            classId: details?.id ?? "",
            file,
          });
          if (response) {
            toast({
              title: "Success",
              description: "Upload student list successfully",
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Upload student list failed",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        } finally {
          refresh();
        }
      } else {
        toast({
          title: "Error",
          description: "File type must be csv",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const onDeleteStudentList = async () => {
    try {
      const response = await deleteStudentList();
      if (response) {
        toast({
          title: "Success",
          description: "Delete student list successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Delete student list failed",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      refresh();
    }
  };

  settingStore?.setHeaderLoading(
    isClassStudentsLoading ||
      isAttendeesLoading ||
      isMappingStudentLoading ||
      isUnMappingStudentLoading ||
      isUploadingStudentList ||
      isDeletingStudentList
  );

  React.useEffect(() => {
    if (checkValidArray(dataClassStudents?.data)) {
      setStudentsList(getValidArray(dataClassStudents?.data));
    } else {
      setStudentsList([]);
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
    onUploadingStudentList,
    onDeleteStudentList,
    isClassStudentsLoading,
  };
};

export default useViewModel;
