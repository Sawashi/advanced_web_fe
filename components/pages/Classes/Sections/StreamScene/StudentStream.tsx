import { VStack, Image, Text } from "@chakra-ui/react";
import { StudentClassBackground } from "constants/pages/classes";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import React from "react";
import StreamHeaderScene from "./StreamHeaderScene";
import CodeClassModal from "./CodeClassModal";

interface Props {}

const StudentStreamScene = (props: Props) => {
  const { classStore } = useStores();
  const { currentClass } = classStore;
  const [isCodeModalVisible, setIsCodeModalVisible] = React.useState(false);

  const onCloseCodeModal = () => {
    setIsCodeModalVisible(false);
  };

  return (
    <VStack w={"full"} h={"full"}>
      <StreamHeaderScene
        onOpenCodeModal={() => {
          setIsCodeModalVisible(true);
        }}
      />
      <CodeClassModal
        isVisible={isCodeModalVisible}
        onClose={onCloseCodeModal}
        code={currentClass?.code ?? ""}
      />
    </VStack>
  );
  // return (
  //   <VStack w={"full"} h={"full"} alignItems={"center"}>
  //     <VStack w={"full"} position={"relative"}>
  //       <Image
  //         src={StudentClassBackground}
  //         w={"full"}
  //         h={"full"}
  //         objectFit={"contain"}
  //         borderRadius={10}
  //       />
  //       <VStack
  //         w={"full"}
  //         h={"full"}
  //         position={"absolute"}
  //         alignItems={"start"}
  //         justifyContent={"flex-end"}
  //         bottom={0}
  //         left={0}
  //         p={5}
  //         bgGradient={"linear(to-t, blackAlpha.500, transparent)"}
  //         borderRadius={10}
  //       >
  //         <Text color={"white"} fontSize={"3xl"} fontWeight={"bold"}>
  //           {currentClass?.name}
  //         </Text>
  //         <Text color={"white"} fontSize={"xl"} fontWeight={"normal"}>
  //           {currentClass?.description}
  //         </Text>
  //       </VStack>
  //     </VStack>
  //   </VStack>
  // );
};

export default observer(StudentStreamScene);
