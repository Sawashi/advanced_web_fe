import {
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import React from "react";

interface Props {
  details: IClass;
}

const StudentGradeBoard = ({ details }: Props) => {
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
        <HStack w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"xl"} fontWeight={"bold"}>
            My grade board
          </Text>

          <Text fontSize={"md"} fontWeight={"normal"}>
            {[]?.length} items
          </Text>
        </HStack>

        <HStack w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"md"} fontWeight={"normal"}>
            Total percentage: {0}%
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default observer(StudentGradeBoard);
