import { api } from "API";
import { ClassesApiRouters, CompositionsApiRouters, UsersApiRouters } from "API/router.api";
import get from "lodash/get";
import { useMutation } from "react-query";

export async function patchUploadCompositionsGrade(params: {
  file: File;
  compositionId: string;
}): Promise<string> {
  const formData = new FormData();
  formData.append("file", get(params, "file") as File);
  const response = await api.patch(
    CompositionsApiRouters.patch.upload_compositions_grade.value(params?.compositionId),
    formData
  );
  const data: string = response?.data ?? "";
  return data;
}

export const useUploadCompositionsGrade = () => {
  return useMutation<string, Error, { file: File; compositionId: string }>({
    mutationFn: (params) => patchUploadCompositionsGrade(params),
    mutationKey: [UsersApiRouters.post.avatar.value],
  });
};
