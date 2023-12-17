import { useQuery } from "react-query";
import { api } from "API";
import { UsersApiRouters } from "API/router";

export interface IClassesAsStudentResponse {
  data: IClass[];
  meta: IMetaResponse;
}

export interface IClass {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  owner: IClassOwner;
}

export interface IClassOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: any;
}

export interface IMetaResponse {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: string[][];
}

export const getClassesAsStudent = async (userId: string) => {
  const response = await api.get<IClassesAsStudentResponse>(
    UsersApiRouters.get.classes_as_student.value(userId, {
      sortBy: "updatedAt",
      page: 1,
      limit: 10,
    })
  );

  return response.data;
};

export const useGetClassesAsStudent = (userId: string) => {
  // @ts-ignore
  return useQuery<IClassesAsStudentResponse, Error, IClassesAsStudentResponse>({
    queryKey: [
      UsersApiRouters.get.classes_as_student.value(userId, {
        sortBy: "updatedAt",
        page: 1,
        limit: 10,
      }),
    ],
    queryFn: () => getClassesAsStudent(userId),
    enabled: !!userId,
  });
};
