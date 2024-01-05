import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IComposition } from "interfaces/classes";
import { useQuery } from "react-query";

export interface IGetGradesOfStudentPayload {
  studentId: string;
  classId: string;
}

export interface ICompositionGrade {
  id?: string;
  grade?: number;
  composition?: IComposition;
}

export const getGradesOfStudent = async (
  payload: IGetGradesOfStudentPayload
) => {
  const res = await api.get<{}, IResponseData<ICompositionGrade[]>>(
    ClassesApiRouters.get.student_grades.value(
      payload?.classId,
      payload?.studentId
    )
  );

  return res?.data;
};

export const useGetGradesOfStudent = (payload: IGetGradesOfStudentPayload) => {
  return useQuery<ICompositionGrade[], Error, ICompositionGrade[]>({
    queryFn: () => getGradesOfStudent(payload),
    queryKey: [
      ClassesApiRouters.get.student_grades.value(
        payload?.classId,
        payload?.studentId
      ),
    ],
    enabled: !!payload?.classId && !!payload?.studentId,
  });
}
