import { api } from "API";
import { CompositionsApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IComposition } from "interfaces/classes";
import { useMutation } from "react-query";

export type TDeleteCompositionBody = {
  compositionId: string;
};

export const deleteComposition = async (payload: TDeleteCompositionBody) => {
  const response = await api.delete<
    TDeleteCompositionBody,
    IResponseData<IComposition>
  >(
    CompositionsApiRouters.delete.delete_a_composition.value(
      payload?.compositionId
    )
  );
  return response;
};

export const useDeleteComposition = (compositionId: string) => {
  return useMutation<
    IResponseData<IComposition>,
    Error,
    TDeleteCompositionBody,
    { previousClassId: string }
  >({
    mutationFn: deleteComposition,
    mutationKey: [
      CompositionsApiRouters.delete.delete_a_composition.value(compositionId),
    ],
  });
};
