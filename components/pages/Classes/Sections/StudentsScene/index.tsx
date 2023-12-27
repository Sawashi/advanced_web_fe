import { HStack, VStack, Text } from "@chakra-ui/react";
import { IClass, IStudent } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useStores } from "hooks/useStores";
import { checkValidArray, getValidArray } from "utils/common";
import EmptyList from "components/EmptyState/EmptyList";
import { useGetClassGradeStudents } from "API/get/get.class.students";

interface Props {
  details: IClass;
}

const StudentsScene = ({ details }: Props) => {
  const { settingStore, classStore } = useStores();
  const { isStudentOfClass } = classStore;
  const {
    data: dataClassStudents,
    isLoading: isClassStudentsLoading,
    refetch: refetchClassStudents,
  } = useGetClassGradeStudents(details?.id ?? "");

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
          {studentsList?.map((item, index) => (
            <HStack>
              <Text>{item?.id}</Text>
              <Text>{item?.name}</Text>
              <Text>{JSON.stringify(item?.user)}</Text>
            </HStack>
          ))}
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
