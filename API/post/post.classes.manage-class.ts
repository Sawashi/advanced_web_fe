import { api } from "API";
import { UsersApiRouters } from "API/router.api";
import { IResponseData } from "API/types";

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

export const sendInvitationMail = async (
  classId: string,
  roleToJoin: string,
  email: string
) => {
  const response = await api.post<
    { role: string; expiresIn: string },
    IResponseData<{}>
  >(UsersApiRouters.post.create_a_class.value + `/${classId}/invite`, {
    role: roleToJoin,
    email: email,
  });
  return response;
};
