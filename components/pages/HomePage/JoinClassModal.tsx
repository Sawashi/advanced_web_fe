import Modal from "components/Modal";
import React, { useCallback } from "react";
import {
  Button,
  HStack,
  UnorderedList,
  Text,
  VStack,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import FormInput from "components/FormInput";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ClassCodeSchema,
  IClassCodeSchema,
} from "constants/validation/classes";
import { usePostJoinClassViaClassCode } from "API/post/post.classes.join-class";
import { useStores } from "hooks/useStores";
import { useGetClassesAsStudent } from "API/get/get.classes.student";

type JoinClassModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const JoinClassModal = ({ isVisible, onClose }: JoinClassModalProps) => {
  const { mutateAsync, isLoading } = usePostJoinClassViaClassCode();
  const { authStore } = useStores();
  const { refetch } = useGetClassesAsStudent(authStore?.user?.id ?? "", {
    limit: 3,
  });
  const toast = useToast();
  const method = useForm<IClassCodeSchema>({
    defaultValues: {
      classCode: "",
    },
    resolver: yupResolver(ClassCodeSchema),
    reValidateMode: "onChange",
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = method;

  const onCloseModal = () => {
    onClose();
    reset();
  };

  const onSubmit = async (values: IClassCodeSchema) => {
    const { data } = await mutateAsync(values?.classCode);

    if (data?.message && data?.error && data?.statusCode >= 400) {
      toast({
        description: data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        description: "Join class successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await refetch();
      onCloseModal();
    }
  };

  const Title = useCallback(() => {
    return (
      <HStack w="full" justifyContent={"space-between"}>
        <Text fontSize={20} fontWeight={600}>
          Join a class
        </Text>

        <Button
          variant="primary"
          isDisabled={!isValid}
          size="md"
          onClick={handleSubmit(onSubmit)}
          w={100}
          isLoading={isLoading}
        >
          Join
        </Button>
      </HStack>
    );
  }, [isValid, isLoading]);

  return (
    <Modal
      isVisible={isVisible}
      onClose={onCloseModal}
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
                <ListItem key={1}>Use an authorized account</ListItem>
                <ListItem key={2}>
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
