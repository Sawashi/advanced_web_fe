import {
  Box,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  ICompositionHeader,
  ICompositionRow,
  IGetClassGradeBoard,
} from "API/get/get.class.grade-boards";
import { usePatchUpdateGrade } from "API/patch/patch.class.update-grade";
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
              justifyContent={"center"}
              cursor={"pointer"}
              minW={"100px"}
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
          <MenuList bgColor={"white"}>
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

const InputGrade = ({
  item,
  studentId,
}: {
  item: ICompositionRow;
  studentId: string;
}) => {
  const { mutateAsync: updateGrade } = usePatchUpdateGrade({
    compositionId: item?.id,
    studentId,
  });
  const toast = useToast();
  const onUpdateGrade = async (value: number, compositionId: string) => {
    try {
      const res = await updateGrade({
        compositionId,
        studentId,
        grade: value,
      });

      // @ts-ignore
      if (res.status >= 400) {
        toast({
          title: "Error",
          description: res?.data?.message?.[0] ?? "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          title: "Success",
          description: "Grade updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <HStack>
      <Input
        variant={"flushed"}
        defaultValue={item?.grade ?? undefined}
        textAlign={"center"}
        fontSize={"md"}
        fontWeight={"bold"}
        color={"gray.500"}
        _focus={{
          border: "none",
        }}
        maxW={"50px"}
        maxLength={3}
        onBlur={(e) => {
          if (e.target.value === "") {
            if (item?.grade !== null) {
              e.target.value = item?.grade?.toString() ?? '';
            }
          }
          else {
            const isNumber = !isNaN(Number(e.target.value));
            if (!isNumber) {
              toast({
                title: "Error",
                description: "Invalid grade",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
              e.target.value = item?.grade?.toString() ?? '';
            }
            else {
              onUpdateGrade(Number(e.target.value), item?.id);
            }
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // blur input
            e.currentTarget.blur();
          }
        }}
      />
    </HStack>
  );
};

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
            [`composition_${index}`]: (
              <InputGrade
                item={item}
                studentId={row?.student?.id}
                key={`composition_${item?.id}_${row?.student?.id}`}
              />
            ),
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
