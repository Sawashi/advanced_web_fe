import { ITableHeader } from "components/Table";

export const getCaseHeaderList = () => {
  const headers: ITableHeader[] = [
    {
      Header: "",
      accessor: "unread",
    },
    {
      Header: "STUDENT NAME",
      accessor: ETableHeader.NAME,
    },
    {
      Header: "ID NUMBER",
      accessor: ETableHeader.ID_NUMBER,
    },
    {
      Header: "",
      accessor: ETableHeader.ACTION,
    },
  ];

  return headers;
};

export enum ETableHeader {
  NAME = "name",
  ID_NUMBER = "id",
  ACTION = "action",
}
