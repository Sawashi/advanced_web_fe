import { api } from "API";
import { CompositionsApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IGradeComposition } from "interfaces/classes";
import { useMutation } from "react-query";

export type TPostCreateCompositionBody = {
  name: string;
  percentage: number;
  classId: string;
};

export const postCreateComposition = async (
  payload: TPostCreateCompositionBody
) => {
  const response = await api.post<
    TPostCreateCompositionBody,
    IResponseData<IGradeComposition>
  >(CompositionsApiRouters.post.create_a_composition.value, payload);
  return response;
};

export const usePostCreateComposition = () => {
  return useMutation<
    IResponseData<IGradeComposition>,
    Error,
    TPostCreateCompositionBody,
    { previousClassId: string }
  >({
    mutationFn: postCreateComposition,
    mutationKey: [CompositionsApiRouters.post.create_a_composition.value],
  });
};
