import { VStack, Image, Text } from "@chakra-ui/react";
import { StudentClassBackground, TeacherClassBackground } from "constants/pages/classes";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import React from "react";

interface Props {}

const TeacherStreamScene = (props: Props) => {
  const { classStore } = useStores();
  const { currentClass } = classStore;
  return (
    <VStack w={"full"} h={"full"} alignItems={"center"}>
      <VStack w={"full"} position={"relative"}>
        <Image
          src={TeacherClassBackground}
          w={"full"}
          h={"full"}
          objectFit={"contain"}
          borderRadius={10}
        />
        <VStack
          w={"full"}
          h={"full"}
          position={"absolute"}
          alignItems={"start"}
          justifyContent={"flex-end"}
          bottom={0}
          left={0}
          p={5}
          bgGradient={"linear(to-t, blackAlpha.500, transparent)"}
          borderRadius={10}
        >
          <Text color={"white"} fontSize={"3xl"} fontWeight={"bold"}>
            {currentClass?.name}
          </Text>
          <Text color={"white"} fontSize={"xl"} fontWeight={"normal"}>
            {currentClass?.description}
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default observer(TeacherStreamScene);
