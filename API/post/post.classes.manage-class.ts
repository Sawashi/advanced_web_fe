import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

type TCreateClassToken = {
  token: string;
};

type TCreateClassTokenBody = {
  classId: string;
  role: string;
  expiresIn: string;
};

export const createClassToken = async ({
  classId,
  role,
  expiresIn,
}: TCreateClassTokenBody) => {
  const response = await api.post<
    { role: string; expiresIn: string },
    IResponseData<TCreateClassToken>
  >(ClassesApiRouters.post.create_a_class.value + `/${classId}/invite-token`, {
    role,
    expiresIn,
  });
  return response.data;
};

export const sendInvitationMail = async (
  classId: string,
  roleToJoin: string,
  email: string
) => {
  const response = await api.post<
    { role: string; expiresIn: string },
    IResponseData<{}>
  >(ClassesApiRouters.post.create_a_class.value + `/${classId}/invite`, {
    role: roleToJoin,
    email: email,
  });
  return response;
};

export const useCreateClassToken = () => {
  return useMutation<
    TCreateClassToken,
    Error,
    TCreateClassTokenBody,
    { previousClassId: string }
  >({
    mutationFn: createClassToken,
    mutationKey: [ClassesApiRouters.post.create_a_class.value],
  });
};
