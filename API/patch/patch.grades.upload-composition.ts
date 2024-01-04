import { api } from "API";
import { CompositionsApiRouters, UsersApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import get from "lodash/get";
import { useMutation } from "react-query";

export async function patchUploadCompositionsGrade(params: {
  file: File;
  compositionId: string;
}): Promise<IResponseData<{}>> {
  const formData = new FormData();
  formData.append("file", get(params, "file") as File);
  const response = await api.patch<{}, IResponseData<{}>>(
    CompositionsApiRouters.patch.upload_compositions_grade.value(params?.compositionId),
    formData
  );
  return response;
}

export const useUploadCompositionsGrade = (compositionId: string) => {
  return useMutation<IResponseData<{}>, Error, { file: File; compositionId: string }>({
    mutationFn: (params) => patchUploadCompositionsGrade(params),
    mutationKey: [CompositionsApiRouters.patch.upload_compositions_grade.value(compositionId)],
  });
};
