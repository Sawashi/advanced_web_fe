import { api } from "API";
import { CompositionsApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

export interface IFinalizeCompositionPayload {
  compositionId: string;
}

export const patchFinalize = async ({compositionId}: IFinalizeCompositionPayload) => {
  const response = await api.patch<{}, IResponseData<{}>>(
    CompositionsApiRouters.patch.finalize.value(compositionId),
  );
  return response;
};


export const usePatchFinalizeComposition = (payload: IFinalizeCompositionPayload) => {
  return useMutation<IResponseData<{}>, Error, IFinalizeCompositionPayload>({
    mutationFn: patchFinalize,
    mutationKey: [
      CompositionsApiRouters.patch.finalize.value(
        payload.compositionId,
      ),
    ],
  });
}