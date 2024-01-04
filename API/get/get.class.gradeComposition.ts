import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IComposition } from "interfaces/classes";
import { useQuery } from "react-query";

export const getClassGradeCompositions = async (classId: string) => {
  const res = await api.get<IComposition[]>(
    ClassesApiRouters.get.class_grade_compositions.value(classId)
  );
  return res?.data;
};

export const useGetClassGradeCompositions = (classId: string) => {
  return useQuery<IComposition[], Error>({
    queryKey: [ClassesApiRouters.get.class_grade_compositions.value(classId)],
    queryFn: () => getClassGradeCompositions(classId),
    enabled: !!classId,
  });
};
