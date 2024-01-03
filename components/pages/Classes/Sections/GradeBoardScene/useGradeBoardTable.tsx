import {
  ICompositionHeader,
  IGetClassGradeBoard,
} from "API/get/get.class.grade-boards";
import { ITableHeader } from "components/Table";
import { useMemo } from "react";
import { getValidArray } from "utils/common";

export const getCaseHeaderList = (compositions: ICompositionHeader[]) => {
  const headers: ITableHeader[] = [
    {
      Header: "Student ID",
      accessor: ETableHeader.ID_NUMBER,
    },
    {
      Header: "Student Name",
      accessor: ETableHeader.NAME,
    },
    ...compositions.map((item, index) => ({
      Header: item.name,
      accessor: `composition_${index}`,
    })),
    {
      Header: "Total",
      accessor: ETableHeader.TOTAL,
    },
    {
      Header: "",
      accessor: ETableHeader.ACTION,
    },
  ];

  return headers;
};

export enum ETableHeader {
  NAME = "studentName",
  ID_NUMBER = "studentId",
  TOTAL = "total",
  ACTION = "action",
}

interface ITableData {
  [ETableHeader?.ID_NUMBER]: React.ReactNode;
  [ETableHeader?.NAME]: React.ReactNode;
  [ETableHeader?.TOTAL]: React.ReactNode;
}

const useGradeBoardTable = (data?: IGetClassGradeBoard) => {
  const tableData = useMemo<ITableData[]>(() => {
    const rows = getValidArray(data?.rows);
    const table: ITableData[] = rows.map((row) => {
      const compositions = getValidArray(row?.compositions);
      
      return {
        [ETableHeader.ID_NUMBER]: row?.student?.id,
        [ETableHeader.NAME]: row?.student?.name,
        [ETableHeader.TOTAL]: row?.total,
      };
    });

    return table;
  }, [data]);

  console.log(tableData);
  return {
    tableData,
  };
};

export default useGradeBoardTable;
