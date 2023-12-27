import { api } from "API";
import { ClassesApiRouters, UsersApiRouters } from "API/router.api";
import get from "lodash/get";
import { useMutation } from "react-query";

export async function postUploadClassStudentsList(params: {
  file: File;
  classId: string;
}): Promise<string> {
  const formData = new FormData();
  formData.append("file", get(params, "file") as File);
  const response = await api.post(
    ClassesApiRouters.post.upload_student_list.value(params.classId),
    formData
  );
  const data: string = response?.data ?? "";
  return data;
}

export const useUploadClassStudentList = () => {
  return useMutation<string, Error, { file: File; classId: string }>({
    mutationFn: (params) => postUploadClassStudentsList(params),
    mutationKey: [UsersApiRouters.post.avatar.value],
  });
};
