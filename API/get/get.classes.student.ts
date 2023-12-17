import { useQuery } from "react-query";
import { api } from "API";
import { URLQueryType, UsersApiRouters } from "API/router";
import { IClass, IMetaResponse } from "interfaces/classes";

export interface IClassesAsStudentResponse {
  data: IClass[];
  meta: IMetaResponse;
}

export const getClassesAsStudent = async (
  userId: string,
  queries?: URLQueryType<{}>
) => {
  const response = await api.get<IClassesAsStudentResponse>(
    UsersApiRouters.get.classes_as_student.value(userId, {
      ...queries,
    })
  );

  return response.data;
};

export const useGetClassesAsStudent = (
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
      UsersApiRouters.get.classes_as_student.value(userId, queries),
      userId,
    ],
    queryFn: () => getClassesAsStudent(userId, queries),
    enabled: !!userId,
  });
};
