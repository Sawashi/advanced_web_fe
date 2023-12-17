import Modal from "components/Modal";
import React from "react";
import {
  Button,
  HStack,
  UnorderedList,
  Text,
  VStack,
  ListItem,
} from "@chakra-ui/react";
import FormInput from "components/FormInput";
import { useForm, FormProvider } from "react-hook-form";

const JoinClassModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const method = useForm({
    defaultValues: {
      classCode: "",
    },
  });

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
      <FormProvider {...method}>
        <VStack alignItems={"center"} spacing={5} p={5}>
          <VStack
            w={{
              base: "90%",
              md: "50%",
              lg: "40%",
            }}
            gap={8}
          >
            <VStack
              gap={3}
              p={5}
              borderWidth={1}
              borderColor={"gray.300"}
              alignItems={"start"}
              borderRadius={10}
              w={"full"}
            >
              <Text fontSize={18} fontWeight={900}>
                Class code
              </Text>

              <FormInput
                name="classCode"
                placeholder="Enter class code"
                isRequired={false}
                label="Ask your teacher for the class code, then enter it here."
              />
            </VStack>

            <VStack alignItems={"start"} w={"full"}>
              <Text fontWeight={600}>To sign in with a class code</Text>
              <UnorderedList>
                <ListItem>Use an authorized account</ListItem>
                <ListItem>
                  Use a class code with 5-7 letters or numbers, and no spaces or
                  symbols
                </ListItem>
              </UnorderedList>
            </VStack>
          </VStack>
        </VStack>
      </FormProvider>
    </Modal>
  );
};

export default JoinClassModal;
