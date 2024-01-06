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
  RequestReviewGradeSchema,
  IRequestReviewGradeSchema,
} from "constants/validation/classes";
import { usePostRequestReview } from "API/post/post.class.request-review";
import { ICompositionGrade, IReview } from "interfaces/classes";
import moment from "moment";

type RequestReviewModalProps = {
  isVisible: boolean;
  onClose: () => void;
  initGrade: ICompositionGrade;
  review?: IReview;
};

const RequestReviewModal = ({
  isVisible,
  onClose,
  initGrade,
  review = undefined,
}: RequestReviewModalProps) => {
  const { mutateAsync: createReview, isLoading } = usePostRequestReview();
  const isEdit = !review;
  const toast = useToast();
  const method = useForm<IRequestReviewGradeSchema>({
    defaultValues: {
      explanation: "",
      expectedGrade: 0,
    },
    resolver: yupResolver(RequestReviewGradeSchema),
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

  const onSubmit = async (values: IRequestReviewGradeSchema) => {
    const res = await createReview({
      expectedGrade: values?.expectedGrade,
      explanation: values?.explanation,
      gradeId: initGrade?.id ?? "",
    });

    if (res.status >= 400) {
      toast({
        description: res?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        description: "Request review successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onCloseModal();
    }
  };

  useEffect(() => {
    if (review) {
      method.setValue("expectedGrade", review?.studentExpectedGrade);
      method.setValue("explanation", review?.studentExplanation);
    } else {
      if (initGrade?.grade) {
        method.setValue("expectedGrade", initGrade?.grade);
      }
    }
  }, [initGrade?.grade, isVisible, review]);

  const Title = useCallback(() => {
    return (
      <HStack w="full" justifyContent={"space-between"}>
        <Text fontSize={20} fontWeight={600}>
          {isEdit ? "Request review to your teachers" : "Your review"}
        </Text>

        {!isEdit ? (
          <Text fontSize={"md"} color={"gray.700"} fontWeight={"bold"}>
            {moment(review?.createdAt).format("HH:ss DD/MM/YYYY")}
          </Text>
        ) : null}

        <Button
          variant="primary"
          isDisabled={!isValid}
          size="md"
          onClick={handleSubmit(onSubmit)}
          w={100}
          isLoading={isLoading}
          display={isEdit ? "block" : "none"}
        >
          Submit
        </Button>
      </HStack>
    );
  }, [isValid, isLoading, isEdit]);

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
                Request review
              </Text>

              <FormInput
                name="expectedGrade"
                placeholder="Enter your expected grade"
                isRequired={true}
                label="Your expected grade"
                disabled={!isEdit}
              />

              <FormInput
                name="explanation"
                placeholder="Enter your explanation"
                isRequired={true}
                multiple={true}
                label="Explanation"
                disabled={!isEdit}
              />
            </VStack>

            <VStack alignItems={"start"} w={"full"}>
              <Text fontWeight={600}>To request review to your teachers:</Text>
              <UnorderedList>
                <ListItem key={1}>
                  Use an authorized account to request review
                </ListItem>
                <ListItem key={2}>
                  Fill in your expected grade and the reason why you want to
                </ListItem>
              </UnorderedList>
            </VStack>
          </VStack>
        </VStack>
      </FormProvider>
    </Modal>
  );
};

export default RequestReviewModal;
