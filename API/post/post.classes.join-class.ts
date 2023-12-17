import { api } from "API";
import { UsersApiRouters } from "API/router";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

export const postJoinClassViaClassCode = async (classCode: string) => {
  const response = await api.post<{ code: string }, IResponseData<{}>>(
    UsersApiRouters.post.join_class_with_class_code.value,
    {
      code: classCode,
    }
  );

  return response;
};

export const usePostJoinClassViaClassCode = () => {
  return useMutation<IResponseData<{}>, Error, string>({
    mutationFn: (classCode) => postJoinClassViaClassCode(classCode),
    mutationKey: [UsersApiRouters.post.join_class_with_class_code.value],
  });
};
