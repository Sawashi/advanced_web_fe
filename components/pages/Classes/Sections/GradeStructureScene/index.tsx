import { VStack } from "@chakra-ui/react";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import React from "react";

interface Props {
  details: IClass;
}

const GradeStructureScene = ({ details }: Props) => {
  return (
    <VStack alignSelf={"center"} alignItems={"center"}>
      <VStack
        w={"full"}
        maxW={"container.lg"}
        p={10}
        borderColor={"gray.300"}
        alignItems={"start"}
        gap={20}
        h={"full"}
      ></VStack>
    </VStack>
  );
};

export default observer(GradeStructureScene);
