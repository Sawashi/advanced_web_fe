import { api } from "API";
import { CompositionsApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IGradeComposition } from "interfaces/classes";
import { useMutation } from "react-query";

export type TUpdateCompositionOrderBody = {
  order: number;
  compositionId: string;
};

export const patchUpdateCompositionOrder = async ({
  order,
  compositionId,
}: TUpdateCompositionOrderBody) => {
  const response = await api.patch<
    TUpdateCompositionOrderBody,
    IResponseData<IGradeComposition>
  >(
    CompositionsApiRouters.patch.update_composition_order.value(compositionId),
    {
      order,
    }
  );
  return response;
};

export const usePatchUpdateCompositionOrder = (compositionId: string) => {
  return useMutation<
    IResponseData<IGradeComposition>,
    Error,
    TUpdateCompositionOrderBody,
    { previousCompositionId: string }
  >({
    mutationFn: patchUpdateCompositionOrder,
    mutationKey: [
      CompositionsApiRouters.patch.update_composition_order.value(
        compositionId
      ),
    ],
  });
};
