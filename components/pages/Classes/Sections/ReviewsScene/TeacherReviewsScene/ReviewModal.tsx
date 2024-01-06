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
  IReviewGradeSchema,
  ReviewGradeSchema,
} from "constants/validation/classes";
import { usePostRequestReview } from "API/post/post.class.request-review";
import { ICompositionGrade, IReview } from "interfaces/classes";
import { EReviewStatus } from "enums/classes";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  review: IReview;
};

const ReviewModal = ({ isVisible, onClose, review }: Props) => {
  const { mutateAsync: createReview, isLoading } = usePostRequestReview();
  const toast = useToast();
  const method = useForm<IReviewGradeSchema>({
    defaultValues: {
      finalGrade: 0,
      status: EReviewStatus.ACCEPTED,
    },
    resolver: yupResolver(ReviewGradeSchema),
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

  const onReject = async (values: IReviewGradeSchema) => {};

  const onAccept = async (values: IReviewGradeSchema) => {};

  useEffect(() => {
    if (review) {
      method.setValue("finalGrade", review?.studentExpectedGrade);
    }
  }, [review, isVisible]);

  const Title = useCallback(() => {
    return (
      <HStack w="full" justifyContent={"space-between"}>
        <Text fontSize={20} fontWeight={600}>
          Review
        </Text>

        <HStack spacing={5}>
          <Button
            backgroundColor={"red.300"}
            color={"red.600"}
            size="md"
            onClick={handleSubmit(onReject)}
            w={100}
            isLoading={isLoading}
          >
            Reject
          </Button>

          <Button
            backgroundColor={"green.300"}
            color={"green.600"}
            isDisabled={!isValid}
            size="md"
            onClick={handleSubmit(onAccept)}
            w={100}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </HStack>
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
                Submit a review
              </Text>

              <FormInput
                name="finalGrade"
                placeholder="The grade you want to give"
                isRequired={true}
                label="Final grade"
              />
            </VStack>

            <VStack alignItems={"start"} w={"full"}>
              <Text fontWeight={600}>To submit a review:</Text>
              <UnorderedList>
                <ListItem key={1}>
                  Submit: Accept the review and submit the grade
                </ListItem>
                <ListItem key={2}>Reject: Reject the review</ListItem>
              </UnorderedList>
            </VStack>
          </VStack>
        </VStack>
      </FormProvider>
    </Modal>
  );
};

export default ReviewModal;
