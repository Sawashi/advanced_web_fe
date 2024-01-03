import { Center, Spinner, VStack } from "@chakra-ui/react";
import { useGetGradeBoard } from "API/get/get.class.grade-boards";
import EmptyList from "components/EmptyState/EmptyList";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { ETabName } from "pages/classes/[id]";
import React from "react";
import routes from "routes";
import { checkValidArray } from "utils/common";

interface Props {
  details: IClass;
}

const GradeBoardScene = ({ details }: Props) => {
  const router = useRouter();
  const { data: gradeBoard, isLoading: isLoadingGradeBoard } = useGetGradeBoard(details?.id ?? "");
  const isHeaderEmpty = !checkValidArray(gradeBoard?.header?.compositions);
  const isRowsEmpty = !checkValidArray(gradeBoard?.rows);

  const goToGradeStructure = async () => {
    await router.push(
      routes.classes.details.value(details?.id ?? "", ETabName.GradeStructure)
    );
    router.reload();
  };

  const goToStudents = async () => {
    await router.push(
      routes.classes.details.value(details?.id ?? "", ETabName.Students)
    );
    router.reload();
  };

  if (isLoadingGradeBoard) {
    return (
      <Center mt={20}>
        <Spinner boxSize={30} />
      </Center>
    )
  }

  return (
    <VStack alignSelf={"center"} alignItems={"center"}>
      <VStack
        w={"full"}
        maxW={"container.lg"}
        p={10}
        borderColor={"gray.300"}
        alignItems={"start"}
        h={"full"}
        gap={5}
      >
        {isHeaderEmpty ? (
          <EmptyList
            title={"Compositions are empty"}
            description={"Please add some compositions"}
            _button={{
              text: "Add composition",
              onClick: goToGradeStructure,
            }}
          />
        ) : isRowsEmpty ? (
          <EmptyList
            title={"Grade board is empty"}
            description={"Please add some students"}
            _button={{
              text: "Add student",
              onClick: goToStudents,
            }}
          />
        ) : (
          <></>
        )}
      </VStack>
    </VStack>
  );
};

export default observer(GradeBoardScene);
