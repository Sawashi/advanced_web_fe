import { HStack, VStack, Text, Box } from "@chakra-ui/react";
import { IClass, IStudent } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useStores } from "hooks/useStores";
import { checkValidArray, getQueryValue, getValidArray } from "utils/common";
import EmptyList from "components/EmptyState/EmptyList";
import { useGetClassGradeStudents } from "API/get/get.class.students";
import Table, { IPagination } from "components/Table";
import { getCaseHeaderList } from "./utils";
import { useRouter } from "next/router";

interface Props {
  details: IClass;
}

const StudentsScene = ({ details }: Props) => {
  const { settingStore, classStore } = useStores();
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
          maxW={"container.lg"}
          p={10}
          borderColor={"gray.300"}
          alignItems={"start"}
          h={"full"}
          gap={5}
        >
          <Box flex={1} width="full">
            <Table
              tableData={studentsList}
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
