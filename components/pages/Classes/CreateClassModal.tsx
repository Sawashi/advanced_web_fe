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
  ClassInformationSchema,
  IClassInformationSchema,
} from "constants/validation/classes";
import { useStores } from "hooks/useStores";
import { useGetClassesAsStudent } from "API/get/get.classes.student";
import { createAClass } from "API/post/post.classes.manage-class";

type CreateClassModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const CreateClassModal = ({ isVisible, onClose }: CreateClassModalProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { authStore } = useStores();
  const { refetch } = useGetClassesAsStudent(authStore?.user?.id ?? "", {
    limit: 3,
  });
  const toast = useToast();
  const method = useForm<IClassInformationSchema>({
    defaultValues: {
      nameOfClass: "",
      descriptionOfClass: "",
    },
    resolver: yupResolver(ClassInformationSchema),
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

  const onSubmit = async (values: IClassInformationSchema) => {
    if (!values?.descriptionOfClass || values?.descriptionOfClass === "") {
      values.descriptionOfClass = "No description";
    }
    setIsLoading(true);
    const { data } = await createAClass(
      values?.nameOfClass,
      values?.descriptionOfClass
    );
    console.log(JSON.stringify(data));
    if (data?.message && data?.error && data?.statusCode >= 400) {
      toast({
        description: data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        description: "Created your class",
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
          Create a class
        </Text>

        <Button
          variant="primary"
          isDisabled={!isValid}
          size="md"
          onClick={handleSubmit(onSubmit)}
          w={100}
          isLoading={isLoading}
        >
          Create
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
                Class information
              </Text>

              <FormInput
                name="nameOfClass"
                placeholder="Enter your class name"
                isRequired={false}
                label="Enter a name for your class."
              />
              <FormInput
                name="descriptionOfClass"
                placeholder="Enter a description for your class"
                isRequired={false}
                label="Enter something that describes your class."
              />
            </VStack>

            <VStack alignItems={"start"} w={"full"}>
              <Text fontWeight={600}>To create a class</Text>
              <UnorderedList>
                <ListItem key={1}>Enter a name for your class</ListItem>
                <ListItem key={2}>
                  Enter a description for your class - optional
                </ListItem>
              </UnorderedList>
            </VStack>
          </VStack>
        </VStack>
      </FormProvider>
    </Modal>
  );
};

export default CreateClassModal;
