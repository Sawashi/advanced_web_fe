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
  GradeCompositionSchema,
  IGradeCompositionSchema,
} from "constants/validation/classes";
import { useStores } from "hooks/useStores";
import { IGradeComposition } from "interfaces/classes";
import { observer } from "mobx-react";

type UpsertCompositionModalProps = {
  isVisible: boolean;
  onClose: () => void;
  composition?: IGradeComposition;
};

const UpsertCompositionModal = ({
  isVisible,
  onClose,
  composition,
}: UpsertCompositionModalProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!composition;
  const { authStore } = useStores();

  const toast = useToast();
  const method = useForm<IGradeCompositionSchema>({
    defaultValues: {
      name: "",
      percentage: 0,
    },
    resolver: yupResolver(GradeCompositionSchema),
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
    reset({
      name: "",
      percentage: 0,
    });
  };

  const onSubmit = async (values: IGradeCompositionSchema) => {};

  const Title = useCallback(() => {
    return (
      <HStack w="full" justifyContent={"space-between"}>
        <Text fontSize={20} fontWeight={600}>
          {isEdit ? "Edit" : "Create"} a composition
        </Text>

        <Button
          variant="primary"
          isDisabled={!isValid}
          size="md"
          onClick={handleSubmit(onSubmit)}
          w={100}
          isLoading={isLoading}
        >
          {isEdit ? "Edit" : "Create"}
        </Button>
      </HStack>
    );
  }, [isValid, isLoading, isEdit]);

  useEffect(() => {
    if (composition) {
      method.reset({
        name: composition?.name,
        percentage: composition?.percentage,
      });
    }
  }, [composition]);

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
                Composition information
              </Text>

              <FormInput
                name="name"
                placeholder="Enter a name"
                isRequired={false}
                label="Name of the composition"
              />
              <FormInput
                name="percentage"
                placeholder="Percentage of the composition"
                isRequired={false}
                label="Percentage of the composition"
              />
            </VStack>

            <VStack alignItems={"start"} w={"full"}>
              <Text fontWeight={600}>To create a composition</Text>
              <UnorderedList>
                <ListItem key={1}>Enter a name for this composition</ListItem>
                <ListItem key={2}>
                  Enter the percentage of this composition (e.g. 20%)
                </ListItem>
              </UnorderedList>
            </VStack>
          </VStack>
        </VStack>
      </FormProvider>
    </Modal>
  );
};

export default observer(UpsertCompositionModal);
