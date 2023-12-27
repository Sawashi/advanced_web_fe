import { api } from "API";
import { UsersApiRouters } from "API/router.api";
import get from "lodash/get";
import { useMutation } from "react-query";

export async function updateAvatar(params: { avatar: File }): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", get(params, "avatar") as File);
  const response = await api.post(UsersApiRouters.post.avatar.value, formData);
  const data: string = response?.data ?? "";
  return data;
}

export const useUpdateAvatar = () => {
  return useMutation<string, Error, { avatar: File }>({
    mutationFn: (params) => updateAvatar(params),
    mutationKey: [UsersApiRouters.post.avatar.value],
  });
};
