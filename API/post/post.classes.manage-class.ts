import { api } from "API";
import { UsersApiRouters } from "API/router";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";
export const createAClass = async (
  nameOfClass: string,
  descriptionOfClass: string
) => {
  const response = await api.post<
    { name: string; description: string },
    IResponseData<{}>
  >(UsersApiRouters.post.create_a_class.value, {
    name: nameOfClass,
    description: descriptionOfClass,
  });
  return response;
};
export const createClassToken = async (
  classId: string,
  userRole: string,
  expireDuration: string
) => {
  const response = await api.post<
    { role: string; expiresIn: string },
    IResponseData<{}>
  >(UsersApiRouters.post.create_a_class.value + `/${classId}/invite-token`, {
    role: userRole,
    expiresIn: expireDuration,
  });
  return response;
};
