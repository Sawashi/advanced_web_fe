import {
  HStack,
  VStack,
  Text,
  Box,
  Tag,
  Button,
  Avatar,
  Tooltip,
} from "@chakra-ui/react";
import { IClass, IStudent } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { useState, useMemo } from "react";
import { useStores } from "hooks/useStores";
import { checkValidArray, getQueryValue, getValidArray } from "utils/common";
import EmptyList from "components/EmptyState/EmptyList";
import { useGetClassGradeStudents } from "API/get/get.class.students";
import Table, { IPagination } from "components/Table";
import { getCaseHeaderList } from "./utils";
import { useRouter } from "next/router";
import SvgIcon from "components/SvgIcon";
import { red500 } from "theme/colors.theme";

interface Props {
  details: IClass;
}

interface IStudentTableData {
  studentId: JSX.Element;
  studentName: JSX.Element;
  action: JSX.Element;
  email: JSX.Element;
}

const StudentsScene = ({ details }: Props) => {
  const { settingStore, classStore, authStore } = useStores();
  const { isStudentOfClass } = classStore;
  const [orderBy, setOrderBy] = useState<number>(1);
  const [sort, setSort] = useState<string>("id");

  const {
    data: dataClassStudents,
    isLoading: isClassStudentsLoading,
    refetch: refetchClassStudents,
  } = useGetClassGradeStudents(details?.id ?? "", {
    sortBy: `${sort}:${orderBy === 1 ? "ASC" : "DESC"}`,
  });

  const [studentsList, setStudentsList] = useState<IStudent[]>();

  const isAssignable = useMemo(() => {
    if (!isStudentOfClass) return true;
    const isUserMapped = studentsList?.some(
      (item) => item?.user?.id === authStore?.user?.id
    );
    return !isUserMapped;
  }, [studentsList, authStore?.user, isStudentOfClass]);

  const onClickMappingTag = (id: string) => {};

  const tableData: IStudentTableData[] = useMemo(() => {
    if (!studentsList) {
      return [];
    }

    const data = studentsList.map((item) => {
      const isCurrentStudent = item?.user?.id === authStore?.user?.id;
      const isAbleToUnmap = !isStudentOfClass || isCurrentStudent;
      return {
        studentId: (
          <Tag borderRadius={16} paddingX="10px" whiteSpace="nowrap">
            {item?.id}
          </Tag>
        ),
        studentName: <Text>{item?.name}</Text>,
        email: <Text>{item?.user?.email}</Text>,
        action: !!item?.user ? (
          <Tooltip label={item?.user?.email} aria-label="A tooltip">
            <Tag
              borderRadius={16}
              p={2}
              px={3}
              cursor={!isAbleToUnmap ? "not-allowed" : "pointer"}
              gap={2}
            >
              <Avatar
                size="xs"
                name={item?.user?.firstName + " " + item?.user?.lastName}
                src={item?.user?.avatar}
              />
              <Text>{item?.user?.firstName + " " + item?.user?.lastName}</Text>
              {isAbleToUnmap ? (
                <Button
                  isDisabled={!isAbleToUnmap}
                  onClick={() => {
                    onClickMappingTag(item?.user?.id ?? "");
                  }}
                  display={isAbleToUnmap ? "flex" : "none"}
                  variant={"icon"}
                  p={0}
                >
                  <SvgIcon iconName="ic-delete.svg" size={20} color={red500} />
                </Button>
              ) : null}
            </Tag>
          </Tooltip>
        ) : (
          <Button
            size="sm"
            background="white"
            border="1px solid #A9A9A9"
            onClick={() => {}}
            isDisabled={!isAssignable}
            display={isAssignable ? "flex" : "none"}
          >
            Assign
          </Button>
        ),
      };
    });

    return data;
  }, [studentsList, authStore?.user, isAssignable]);

  settingStore?.setHeaderLoading(isClassStudentsLoading);

  React.useEffect(() => {
    if (checkValidArray(dataClassStudents?.data)) {
      setStudentsList(getValidArray(dataClassStudents?.data));
    }
  }, [dataClassStudents]);

  return (
    <VStack alignSelf={"center"} alignItems={"center"}>
      {checkValidArray(studentsList) ? (
        <VStack
          w={"full"}
          p={10}
          borderColor={"gray.300"}
          alignItems={"start"}
          h={"full"}
          gap={5}
        >
          <Box flex={1} width="full">
            <Table
              tableData={tableData}
              headerList={getCaseHeaderList()}
              setSort={setSort}
              setOrderBy={setOrderBy}
              sort={sort}
              orderBy={orderBy}
            />
          </Box>
        </VStack>
      ) : (
        <EmptyList
          title="Seems like there's no students in this class"
          description={
            !isStudentOfClass
              ? "Create a list of students to start adding grades"
              : "The teacher hasn't added any students yet"
          }
          _button={
            !isStudentOfClass
              ? {
                  text: "Upload students",
                  onClick: () => {},
                }
              : undefined
          }
        />
      )}
    </VStack>
  );
};

export default observer(StudentsScene);
