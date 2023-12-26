import Modal from "components/Modal";
import React, { useCallback, useEffect } from "react";
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
  IUpdateClassSchema,
  UpdateClassSchema,
} from "constants/validation/classes";
import { useStores } from "hooks/useStores";
import { useUpdateClassDetails } from "API/patch/path.classes.uppdate-details";
import { observer } from "mobx-react";

type UpdateClassModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const UpdateClassModal = ({ isVisible, onClose }: UpdateClassModalProps) => {
  const { classStore } = useStores();
  const { mutateAsync } = useUpdateClassDetails(
    classStore?.currentClass?.id ?? ""
  );

  const toast = useToast();
  const method = useForm<IUpdateClassSchema>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: yupResolver(UpdateClassSchema),
    reValidateMode: "onChange",
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
    setValue,
  } = method;

  const onCloseModal = () => {
    onClose();
    reset();
  };

  const onSubmit = async (values: IUpdateClassSchema) => {
    const { data } = await mutateAsync({
      ...values,
      classId: classStore?.currentClass?.id ?? "",
    });
    await classStore?.fetchCurrentClass();
    if (data?.message && data?.error && data?.statusCode >= 400) {
      toast({
        description: data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        description: "Class updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onCloseModal();
    }
  };

  useEffect(() => {
    if (classStore?.currentClass) {
      setValue("name", classStore?.currentClass?.name ?? "");
      setValue("description", classStore?.currentClass?.description);
    }
  }, [classStore?.currentClass]);

  const Title = useCallback(() => {
    return (
      <HStack w="full" justifyContent={"space-between"}>
        <Text fontSize={20} fontWeight={600}></Text>

        <Button
          variant="primary"
          isDisabled={!isValid}
          size="md"
          onClick={handleSubmit(onSubmit)}
          w={100}
        >
          Update
        </Button>
      </HStack>
    );
  }, [isValid]);

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
                name="name"
                placeholder="Enter your class name"
                isRequired={false}
                label="Enter a name for your class."
              />
              <FormInput
                name="description"
                placeholder="Enter a description for your class"
                isRequired={false}
                label="Enter something that describes your class."
              />
            </VStack>

            <VStack alignItems={"start"} w={"full"}>
              <Text fontWeight={600}>To update a class</Text>
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

export default observer(UpdateClassModal);
