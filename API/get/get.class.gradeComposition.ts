import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IGradeComposition } from "interfaces/classes";
import { useQuery } from "react-query";

export const getClassGradeCompositions = async (classId: string) => {
  const res = await api.get<IGradeComposition[]>(
    ClassesApiRouters.get.class_grade_compositions.value(classId)
  );
  return res?.data;
};

export const useGetClassGradeCompositions = (classId: string) => {
  return useQuery<IGradeComposition[], Error>({
    queryKey: [ClassesApiRouters.get.class_grade_compositions.value(classId)],
    queryFn: () => getClassGradeCompositions(classId),
    enabled: !!classId,
  });
};
