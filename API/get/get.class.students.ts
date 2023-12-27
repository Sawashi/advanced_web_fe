import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IMetaResponse, IStudent } from "interfaces/classes";
import { useQuery } from "react-query";

interface IGetClassStudents {
  data: IStudent[];
  meta: IMetaResponse;
}

export const getClassStudents = async (classId: string) => {
  const res = await api.get<IGetClassStudents>(
    ClassesApiRouters.get.students.value(classId)
  );
  return res?.data;
};

export const useGetClassGradeStudents = (classId: string) => {
  return useQuery<IGetClassStudents, Error>({
    queryKey: [ClassesApiRouters.get.students.value(classId)],
    queryFn: () => getClassStudents(classId),
    enabled: !!classId,
  });
};
