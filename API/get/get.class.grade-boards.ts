import { api } from "API";
import { ClassesApiRouters, ID } from "API/router.api";
import { IResponseData } from "API/types";
import { useQuery } from "react-query";

export interface IGetClassGradeBoard {
  header: IHeader;
  rows: IRow[];
}

export interface IHeader {
  student: IStudentHeader;
  compositions: ICompositionHeader[];
  total: string;
}

export interface IStudentHeader {
  id: string;
  name: string;
}

export interface ICompositionHeader {
  id: string;
  name: string;
  percentage: number;
  finalized: boolean;
  order: number;
}

export interface IRow {
  student: IStudentRow;
  compositions: ICompositionRow[];
  total: number;
}

export interface IStudentRow {
  id: string;
  name: string;
}

export interface ICompositionRow {
  id: string;
  grade?: number;
}

export interface IGetGradeBoardPayload {
  classId: ID;
}

export const getGradeBoard = async ({ classId }: IGetGradeBoardPayload) => {
  const response = await api.get<IGetGradeBoardPayload, IResponseData<IGetClassGradeBoard>>(
    ClassesApiRouters.get.grade_board.value(classId)
  );
  return response.data;
};

export const useGetGradeBoard = (classId: ID) => {
  return useQuery<IGetClassGradeBoard, Error, IGetClassGradeBoard>({
    queryKey: ClassesApiRouters.get.grade_board.value(classId),
    queryFn: () => getGradeBoard({ classId }),
    enabled: !!classId,
  });
};
