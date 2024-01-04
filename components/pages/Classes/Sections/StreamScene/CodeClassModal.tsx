import Modal from "components/Modal";
import React from "react";
import { Text, Code, VStack, Divider, HStack } from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import { gray500 } from "theme/colors.theme";

interface Props {
  isVisible: boolean;
  onClose?: () => void;
  code: string;
}

const CodeClassModal = ({ isVisible, onClose, code }: Props) => {
  const { classStore } = useStores();
  const { currentClass } = classStore;
  return (
    <Modal isVisible={isVisible && !!code} onClose={onClose} title="Class code">
      <VStack
        w={"full"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={5}
        py={5}
        divider={<Divider h={"1px"} w={"full"} bgColor={"blue.800"} />}
      >
        <Code
          fontSize={"8xl"}
          fontWeight={"thin"}
          color={"primary.300"}
          rounded={"md"}
          textDecoration={"underline"}
        >
          {code}
        </Code>
        <VStack>
          <HStack
            gap={3}
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text>
              Share this code with other people to join this class as a student.
            </Text>
            <HStack
              gap={3}
              alignItems={"center"}
              justifyContent={"flex-end"}
              onClick={() => {
                navigator.clipboard.writeText(currentClass?.code ?? "");
              }}
              cursor={"pointer"}
            >
              <SvgIcon
                iconName={"ic-copy.svg"}
                fill={gray500}
                color={gray500}
                size={30}
              />
            </HStack>
          </HStack>
        </VStack>
      </VStack>
    </Modal>
  );
};

export default observer(CodeClassModal);
