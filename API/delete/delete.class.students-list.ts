import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { useMutation } from "react-query";

export const deleteStudentList = async (classId: string) => {
  const response = await api.delete<{}, {}>(
    ClassesApiRouters.delete.delete_students_list.value(classId)
  );
  return response;
};

export const useDeleteStudentList = (classId: string) => {
  return useMutation({
    mutationFn: () => deleteStudentList(classId),
    mutationKey: [ClassesApiRouters.delete.delete_students_list.value(classId)],
  });
};
