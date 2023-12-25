import { VStack } from "@chakra-ui/react";
import { IClass } from "interfaces/classes";
import React from "react";
import StudentStreamScene from "./StudentStream";
import TeacherStreamScene from "./Teacher/TeacherStream";

interface Props {
  details: IClass;
  isStudentOfClass?: boolean;
}

const StreamScene = ({ isStudentOfClass }: Props) => {
  return (
    <VStack
      alignSelf={"center"}
      alignItems={"center"}
      w={"full"}
      h={"full"}
      minW={"container.lg"}
    >
      <VStack
        w={"full"}
        maxW={"container.lg"}
        p={5}
        flex={1}
        alignItems={"start"}
        h={"full"}
      >
        {isStudentOfClass ? <StudentStreamScene /> : <TeacherStreamScene />}
      </VStack>
    </VStack>
  );
};

export default StreamScene;
