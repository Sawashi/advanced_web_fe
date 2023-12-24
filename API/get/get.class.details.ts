import { useQuery } from "react-query";
import { IClass } from "interfaces/classes";
import { api } from "API";
import { ClassesApiRouters } from "API/router.api";

export const getClassDetails = async (classId: string) => {
  const response = await api.get<IClass>(
    ClassesApiRouters.get.class_details.value(classId)
  );
  return response.data;
};

export const useGetClassDetails = (classId: string) => {
  return useQuery<IClass, Error, IClass>({
    queryKey: [ClassesApiRouters.get.class_details.value(classId)],
    queryFn: () => getClassDetails(classId),
    enabled: !!classId,
  });
};
