import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

interface IPatchMapStudentBody {
  studentId: string;
  userId: string;
}

export const patchMapStudent = async ({
  userId,
  studentId,
  classId,
}: {
  userId: string;
  studentId: string;
  classId: string;
}) => {
  const response = await api.patch<IPatchMapStudentBody, IResponseData<{}>>(
    ClassesApiRouters.patch.map_student.value(classId),
    {
      userId,
      studentId,
    }
  );

  return response;
};

export const usePatchMapStudent = (classId: string) => {
  return useMutation<
    IResponseData<{}>,
    Error,
    { userId: string; studentId: string; classId: string }
  >({
    mutationFn: patchMapStudent,
    mutationKey: [ClassesApiRouters.patch.map_student.value(classId)],
  });
};
