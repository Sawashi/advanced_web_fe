import { api } from "API";
import { CompositionsApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

export interface IUpdateGradePayload {
  compositionId: string;
  studentId: string;
  grade?: number
}

export interface IUpdateGradeResponse {}

export const patchUpdateGrade = async ({
  compositionId,
  studentId,
  grade,
}: IUpdateGradePayload) => {
  const response = await api.patch<IUpdateGradePayload, IResponseData<IUpdateGradeResponse>>(
    CompositionsApiRouters.patch.update_grade.value(compositionId, studentId), {
      grade,
    }
  );
  return response;
};
export const usePatchUpdateGrade = (payload: IUpdateGradePayload) => {
  return useMutation<IResponseData<IUpdateGradeResponse>, Error, IUpdateGradePayload>({
    mutationFn: patchUpdateGrade,
    mutationKey: [
      CompositionsApiRouters.patch.update_grade.value(
        payload.compositionId,
        payload.studentId
      ),
    ],
  });
};
