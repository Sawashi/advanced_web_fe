import { api } from "API";
import { UsersApiRouters } from "API/router.api";
import { IResponseData } from "API/types";

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
