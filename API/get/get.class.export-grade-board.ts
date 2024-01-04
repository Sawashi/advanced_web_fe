import { api } from "API";
import { ClassesApiRouters, GlobalApiRouters } from "API/router.api";
import { IGetGradeBoardPayload } from "./get.class.grade-boards";
import { useMutation } from "react-query";

export const getClassGradeBoard = async ({
  classId,
}: IGetGradeBoardPayload) => {
  const res = await api.get(
    ClassesApiRouters.get.export_grade_board.value(classId)
  );
  return res?.data;
};

export const useGetClassGradeBoard = (classId: string) => {
  return useMutation({
    mutationKey: ClassesApiRouters.get.export_grade_board.value(classId),
    mutationFn: () => getClassGradeBoard({ classId }),
  });
};
