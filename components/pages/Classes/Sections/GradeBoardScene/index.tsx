import { VStack } from "@chakra-ui/react";
import { useGetGradeBoard } from "API/get/get.class.grade-boards";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import React from "react";

interface Props {
  details: IClass;
}

const GradeBoardScene = ({ details }: Props) => {
  const { data: gradeBoard } = useGetGradeBoard(details?.id ?? "");

  console.log(gradeBoard);
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
      ></VStack>
    </VStack>
  );
};

export default observer(GradeBoardScene);
