import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

interface IPatchMapStudentBody {
  userId: string;
}

export const patchUnMapStudent = async ({
  userId,
  classId,
}: {
  userId: string;
  classId: string;
}) => {
  const response = await api.patch<IPatchMapStudentBody, IResponseData<{}>>(
    ClassesApiRouters.patch.unmap_student.value(classId),
    {
      userId,
    }
  );

  return response;
};

export const usePatchUnMapStudent = (classId: string) => {
  return useMutation<
    IResponseData<{}>,
    Error,
    { userId: string; classId: string }
  >({
    mutationFn: patchUnMapStudent,
    mutationKey: [ClassesApiRouters.patch.unmap_student.value(classId)],
  });
};
