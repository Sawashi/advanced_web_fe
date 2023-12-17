import Modal from "components/Modal";
import React from "react";
import { Button, HStack, Text } from "@chakra-ui/react";

const JoinClassModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const Title = () => {
    return (
      <HStack w="full" justifyContent={"space-between"}>
        <Text fontSize={20} fontWeight={600}>
          Join a class
        </Text>

        <Button
          variant="primary"
          isDisabled={true}
          size="md"
          onClick={() => {
            onClose();
          }}
          w={100}
        >
          Join
        </Button>
      </HStack>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title={<Title />}
      size="full"
    >
      <Text>Test</Text>
    </Modal>
  );
};

export default JoinClassModal;
