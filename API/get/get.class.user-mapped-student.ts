import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation, useQuery } from "react-query";

interface IGetUserMappedStudentPayload {
  classId: string;
}

interface IGetUserMappedStudent {
  studentId: string | null;
}

export const getUserMappedStudent = async ({
  classId,
}: IGetUserMappedStudentPayload) => {
  const res = await api.get<
    IGetUserMappedStudentPayload,
    IResponseData<IGetUserMappedStudent>
  >(ClassesApiRouters.get.mapped_student_id.value(classId));
  const { data } = res;
  return data;
};

export const useGetUserMappedStudent = (
  payload: IGetUserMappedStudentPayload
) => {
  return useQuery<IGetUserMappedStudent, Error, IGetUserMappedStudent>({
    queryFn: () => getUserMappedStudent(payload),
    queryKey: [ClassesApiRouters.get.mapped_student_id.value(payload?.classId)],
    enabled: !!payload?.classId,
  });
};
