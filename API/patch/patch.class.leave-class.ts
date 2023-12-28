import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

interface IPatchLeaveClassBody {}

export const patchLeaveClass = async ({ classId }: { classId: string }) => {
  const response = await api.patch<IPatchLeaveClassBody, IResponseData<{}>>(
    ClassesApiRouters.patch.leave_class.value(classId),
    {}
  );

  return response;
};

export const usePatchLeaveClass = (classId: string) => {
  return useMutation<IResponseData<{}>, Error>({
    mutationFn: () => patchLeaveClass({ classId }),
    mutationKey: [ClassesApiRouters.patch.leave_class.value(classId)],
  });
};
