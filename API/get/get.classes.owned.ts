import { useQuery } from "react-query";
import { api } from "API";
import { UsersApiRouters } from "API/router";
import { IClass, IMetaResponse } from "interfaces/classes";

export interface IClassesAsStudentResponse {
  data: IClass[];
  meta: IMetaResponse;
}

export const getClassesAsOwner = async (userId: string) => {
  const response = await api.get<IClassesAsStudentResponse>(
    UsersApiRouters.get.classes_as_owner.value(userId, {
      sortBy: "updatedAt",
      page: 1,
      limit: 10,
    })
  );

  return response.data;
};

export const useGetClassesAsOwner = (userId: string) => {
  // @ts-ignore
  return useQuery<IClassesAsStudentResponse, Error, IClassesAsStudentResponse>({
    queryKey: [
      UsersApiRouters.get.classes_as_owner.value(userId, {
        sortBy: "updatedAt",
        page: 1,
        limit: 10,
      }),
    ],
    queryFn: () => getClassesAsOwner(userId),
    enabled: !!userId,
  });
};
