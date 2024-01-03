import {
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import {
  ICompositionHeader,
  IGetClassGradeBoard,
} from "API/get/get.class.grade-boards";
import SvgIcon from "components/SvgIcon";
import { ITableHeader } from "components/Table";
import { useMemo } from "react";
import { green400, red500 } from "theme/colors.theme";
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
      Header: (
        <Menu>
          <MenuButton aria-label="Options">
            <Box
              flexDirection={"row"}
              display={"flex"}
              gap={1}
              alignItems={"center"}
              cursor={"pointer"}
            >
              <Box flexDirection={"column"} display={"flex"} gap={1}>
                <HStack
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Text color="gray.500" fontSize="14px" fontWeight={600}>
                    {item?.name}
                  </Text>
                </HStack>
                <Box
                  color={"gray.500"}
                  fontSize={"xs"}
                  fontWeight={"normal"}
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {`(${item?.percentage}%)`}
                </Box>
              </Box>
              {item?.finalized ? (
                <SvgIcon iconName="ic-lock.svg" size={20} color={red500} />
              ) : (
                <SvgIcon
                  iconName="ic-lock-open.svg"
                  size={20}
                  color={green400}
                />
              )}
            </Box>
          </MenuButton>
          <MenuList bgColor={"white.100"}>
            <MenuItem onClick={() => {}}>
              <Text color={red500} fontWeight={"bold"}>
                Finalize
              </Text>
            </MenuItem>
            <MenuItem onClick={() => {}}>Upload grades</MenuItem>
            <MenuItem onClick={() => {}}>Download template</MenuItem>
          </MenuList>
        </Menu>
      ),
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
        ...(compositions?.reduce(
          (acc, item, index) => ({
            ...acc,
            [`composition_${index}`]: item?.grade,
          }),
          {}
        ) as Record<string, React.ReactNode>),
      };
    });

    return table;
  }, [data]);
  return {
    tableData,
  };
};

export default useGradeBoardTable;
