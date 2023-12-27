import { useQuery } from "react-query";
import { IAttendee, IClass, IMetaResponse } from "interfaces/classes";
import { api } from "API";
import { ClassesApiRouters } from "API/router.api";

export interface IClassAttendeesResponse {
  data: IAttendee[];
  meta: IMetaResponse;
}

export const getClassAttendees = async (classId: string) => {
  const response = await api.get<IClassAttendeesResponse>(
    ClassesApiRouters.get.class_attendees.value(classId)
  );
  return response.data;
};

export const useGetClassAttendees = (classId: string, enabled = true) => {
  return useQuery<IClassAttendeesResponse, Error, IClassAttendeesResponse>({
    queryKey: [ClassesApiRouters.get.class_attendees.value(classId)],
    queryFn: () => getClassAttendees(classId),
    enabled: !!classId && enabled,
  });
};
