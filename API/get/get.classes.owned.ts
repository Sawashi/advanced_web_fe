import { useQuery } from "react-query";
import { api } from "API";
import { URLQueryType, UsersApiRouters } from "API/router.api";
import { IClass, IMetaResponse } from "interfaces/classes";
import { getValidArray } from "utils/common";
import { EClassRole } from "enums/classes";

export interface IClassesAsStudentResponse {
  data: IClass[];
  meta: IMetaResponse;
}

export const getClassesAsOwner = async (
  userId: string,
  queries?: URLQueryType<{}>
) => {
  const response = await api.get<IClassesAsStudentResponse>(
    UsersApiRouters.get.classes_as_owner.value(userId, {
      ...queries,
    })
  );

  return response.data;
};

export const useGetClassesAsOwner = (
  userId: string,
  options?: URLQueryType<{}>
) => {
  const queries = {
    sortBy: "updatedAt",
    page: 1,
    limit: 10,
    ...options,
  };

  // @ts-ignore
  return useQuery<IClassesAsStudentResponse, Error, IClassesAsStudentResponse>({
    queryKey: [
      UsersApiRouters.get.classes_as_owner.value(userId, queries),
      userId,
    ],
    queryFn: () => getClassesAsOwner(userId, queries),
    select(data) {
      return {
        ...data,
        data: getValidArray(data.data)?.map((item) => {
          return {
            ...item,
            role: EClassRole.OWNER,
          };
        }),
      };
    },
    enabled: !!userId,
  });
};
