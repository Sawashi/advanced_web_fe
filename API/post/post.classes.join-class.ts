import { api } from "API";
import { UsersApiRouters } from "API/router.api";
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

export const postJoinClassViaToken = async (token: string) => {
  const response = await api.post<{ token: string }, IResponseData<{}>>(
    UsersApiRouters.post.join_class_with_token.value,
    {
      token,
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

export const usePostJoinClassViaToken = () => {
  return useMutation<IResponseData<{}>, Error, string>({
    mutationFn: (token) => postJoinClassViaToken(token),
    mutationKey: [UsersApiRouters.post.join_class_with_token.value],
  });
};
