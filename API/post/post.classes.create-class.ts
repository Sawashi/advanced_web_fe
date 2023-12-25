import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";

export const createAClass = async (
  nameOfClass: string,
  descriptionOfClass: string
) => {
  const response = await api.post<
    { name: string; description: string },
    IResponseData<{}>
  >(ClassesApiRouters.post.create_a_class.value, {
    name: nameOfClass,
    description: descriptionOfClass,
  });
  return response;
};
