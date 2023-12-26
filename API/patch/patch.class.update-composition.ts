import { api } from "API";
import { CompositionsApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IGradeComposition } from "interfaces/classes";
import { useMutation } from "react-query";

export type TUpdateCompositionBody = {
  name: string;
  percentage: number;
  compositionId: string;
};

export const patchUpdateComposition = async ({
  name,
  percentage,
  compositionId,
}: TUpdateCompositionBody) => {
  const response = await api.patch<
    TUpdateCompositionBody,
    IResponseData<IGradeComposition>
  >(CompositionsApiRouters.patch.update_a_composition.value(compositionId), {
    name,
    percentage,
  });
  return response;
};

export const usePatchUpdateComposition = (compositionId: string) => {
  return useMutation<
    IResponseData<IGradeComposition>,
    Error,
    TUpdateCompositionBody,
    { previousCompositionId: string }
  >({
    mutationFn: patchUpdateComposition,
    mutationKey: [
      CompositionsApiRouters.patch.update_a_composition.value(compositionId),
    ],
  });
};
