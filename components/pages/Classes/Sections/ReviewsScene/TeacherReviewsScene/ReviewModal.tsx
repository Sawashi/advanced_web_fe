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
  Collapse,
  Code,
  Divider,
} from "@chakra-ui/react";
import FormInput from "components/FormInput";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IReviewGradeSchema,
  ReviewGradeSchema,
} from "constants/validation/classes";
import { IReview } from "interfaces/classes";
import { EReviewStatus, ETabName } from "enums/classes";
import { useUpdateReview } from "API/patch/patch.class.update-review";
import SvgIcon from "components/SvgIcon";
import { gray700 } from "theme/colors.theme";
import { useStores } from "hooks/useStores";
import { useRouter } from "next/router";
import routes from "routes";
import { StatusRender } from "./ReviewDetailsItem";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  review: IReview;
};

const ReviewModal = ({ isVisible, onClose, review }: Props) => {
  const { mutateAsync: updateReview, isLoading } = useUpdateReview(review?.id);
  const isPending = review?.status === EReviewStatus.PENDING;
  const { classStore } = useStores();
  const router = useRouter();
  const toast = useToast();
  const method = useForm<IReviewGradeSchema>({
    defaultValues: {
      finalGrade: 0,
    },
    resolver: yupResolver(ReviewGradeSchema),
    reValidateMode: "onChange",
    mode: "all",
  });
  const [isShowMoreExplanation, setIsShowMoreExplanation] =
    React.useState(false);

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = method;

  const expectedGrade = method.watch("finalGrade");

  const onCloseModal = () => {
    router.replace(
      routes.classes.details.value(
        classStore?.currentClass?.id ?? "",
        ETabName.Reviews
      ),
      undefined,
      { shallow: true }
    );
    onClose();
    reset();
  };

  const onReject = async () => {
    const res = await updateReview({
      status: EReviewStatus.REJECTED,
      reviewId: review?.id,
    });
    if (res.status >= 400) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onCloseModal();
      return;
    }
    toast({
      title: "Success",
      description: "Review has been rejected",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onCloseModal();
  };

  const onAccept = async (values: IReviewGradeSchema) => {
    const res = await updateReview({
      status: EReviewStatus.ACCEPTED,
      finalGrade: values.finalGrade,
      reviewId: review?.id,
    });
    if (res.status >= 400) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onCloseModal();
      return;
    }
    toast({
      title: "Success",
      description: "Review has been accepted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onCloseModal();
  };

  useEffect(() => {
    if (review) {
      method.setValue("finalGrade", review?.studentExpectedGrade);
    }
  }, [review, isVisible]);

  const Title = useCallback(() => {
    return (
      <HStack w="full" justifyContent={"space-between"}>
        <HStack>
          <Text fontSize={20} fontWeight={600}>
            Review
          </Text>
          <StatusRender review={review} />
        </HStack>

        <HStack spacing={5} display={isPending ? "flex" : "none"}>
          <Button
            backgroundColor={"red.300"}
            color={"red.600"}
            size="md"
            onClick={handleSubmit(onReject)}
            w={100}
            isLoading={isLoading}
            border={"none"}
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
            border={"none"}
          >
            Submit
          </Button>
        </HStack>
      </HStack>
    );
  }, [isValid, isLoading, isPending]);

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
              gap={7}
              p={5}
              borderWidth={1}
              borderColor={"gray.300"}
              alignItems={"start"}
              borderRadius={10}
              w={"full"}
              divider={<Divider borderColor={"gray.300"} borderWidth={1} />}
            >
              <VStack w={"full"} alignItems={"start"} gap={3}>
                <Text fontSize={18} fontWeight={900}>
                  Submit a review
                </Text>
              </VStack>

              {isPending ? (
                <FormInput
                  name="finalGrade"
                  placeholder="The grade you want to give"
                  isRequired={true}
                  label="Final grade"
                />
              ) : null}

              <VStack
                w={"full"}
                alignItems={"start"}
                justifyContent={"space-between"}
              >
                <VStack w={"full"} alignItems={"start"}>
                  <Text
                    fontSize={"md"}
                    fontWeight={"bold"}
                    color={"primary.500"}
                  >
                    Details
                  </Text>

                  <VStack w={"full"} p={3}>
                    <HStack w={"full"} gap={3} alignItems={"center"}>
                      <Text
                        fontSize={"sm"}
                        color={"gray.500"}
                        fontWeight={"bold"}
                      >
                        Composition:
                      </Text>
                      <Text
                        fontSize={"md"}
                        fontWeight={"700"}
                        ml={2}
                        color={"purple.700"}
                      >
                        {review?.grade?.composition?.name +
                          " " +
                          `(${review?.grade?.composition?.percentage}%)`}
                      </Text>
                    </HStack>
                    <HStack w={"full"} gap={3} alignItems={"center"}>
                      <Text
                        fontSize={"sm"}
                        color={"gray.500"}
                        fontWeight={"bold"}
                      >
                        Student:
                      </Text>
                      <Text
                        fontSize={"md"}
                        fontWeight={"700"}
                        ml={2}
                        color={"purple.700"}
                      >
                        {review?.grade?.student?.id +
                          " - " +
                          review?.grade?.student?.name}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>

                {!isPending ? (
                  <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
                    <Text
                      fontSize={"md"}
                      fontWeight={"bold"}
                      color={"primary.500"}
                    >
                      Teacher review
                    </Text>

                    <VStack w={"full"} p={3}>
                      <HStack w={"full"} gap={3} alignItems={"center"}>
                        <Text
                          fontSize={"sm"}
                          color={"gray.500"}
                          fontWeight={"bold"}
                        >
                          Name:
                        </Text>
                        <Text
                          fontSize={"md"}
                          fontWeight={"700"}
                          ml={2}
                          color={"orange.700"}
                        >
                          {review?.endedBy?.firstName +
                            " " +
                            review?.endedBy?.lastName}
                        </Text>
                      </HStack>
                      <HStack w={"full"} gap={3} alignItems={"center"}>
                        <Text
                          fontSize={"sm"}
                          color={"gray.500"}
                          fontWeight={"bold"}
                        >
                          Email:
                        </Text>
                        <Text
                          fontSize={"md"}
                          fontWeight={"700"}
                          ml={2}
                          color={"orange.700"}
                        >
                          {review?.endedBy?.email}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                ) : null}

                <VStack w={"full"} alignItems={"start"}>
                  <Text
                    fontSize={"md"}
                    fontWeight={"bold"}
                    color={"primary.500"}
                  >
                    Review
                  </Text>

                  <HStack w={"full"} justifyContent={"space-between"} gap={5}>
                    <VStack flex={1}>
                      <Text
                        fontSize={"lg"}
                        color={"gray.700"}
                        fontWeight={"bold"}
                      >
                        From
                      </Text>
                      <Code
                        fontSize={"md"}
                        fontWeight={"700"}
                        borderRadius={6}
                        p={2}
                        backgroundColor={
                          review?.studentCurrentGrade >
                          review?.studentExpectedGrade
                            ? "red.100"
                            : "green.100"
                        }
                        color={
                          review?.studentCurrentGrade >
                          review?.studentExpectedGrade
                            ? "red.500"
                            : "green.500"
                        }
                      >
                        {review?.studentCurrentGrade}
                      </Code>
                    </VStack>
                    <SvgIcon
                      iconName="ic-arrow-right.svg"
                      size={20}
                      color={gray700}
                    />
                    <VStack flex={1}>
                      <Text
                        fontSize={"md"}
                        color={"gray.700"}
                        fontWeight={"bold"}
                      >
                        To
                      </Text>
                      <HStack>
                        <Code
                          fontSize={"md"}
                          fontWeight={"700"}
                          borderRadius={6}
                          p={2}
                          backgroundColor={
                            review?.studentCurrentGrade >
                            review?.studentExpectedGrade
                              ? "red.100"
                              : "green.100"
                          }
                          color={
                            review?.studentCurrentGrade >
                            review?.studentExpectedGrade
                              ? "red.500"
                              : "green.500"
                          }
                          as={
                            Number(expectedGrade) !==
                            Number(review?.studentExpectedGrade)
                              ? "del"
                              : "span"
                          }
                        >
                          {review?.studentExpectedGrade}
                        </Code>

                        <Code
                          fontSize={"md"}
                          fontWeight={"700"}
                          borderRadius={6}
                          p={2}
                          backgroundColor={"yellow.100"}
                          color={"yellow.700"}
                          display={
                            Number(expectedGrade) !==
                            Number(review?.studentExpectedGrade)
                              ? "inline-block"
                              : "none"
                          }
                        >
                          {expectedGrade}
                        </Code>
                      </HStack>
                    </VStack>
                  </HStack>
                </VStack>

                <VStack w={"full"} alignItems={"start"}>
                  <Text
                    fontSize={"md"}
                    fontWeight={"bold"}
                    color={"primary.500"}
                  >
                    Explanation
                  </Text>

                  <Collapse startingHeight={50} in={isShowMoreExplanation}>
                    <Text
                      fontSize={"xs"}
                      fontWeight={"normal"}
                      color={"gray.500"}
                      ml={2}
                      whiteSpace={"pre-line"}
                    >
                      {review?.studentExplanation}
                    </Text>
                  </Collapse>
                  <Button
                    variant={"link"}
                    colorScheme={"primary"}
                    size={"sm"}
                    onClick={() =>
                      setIsShowMoreExplanation(!isShowMoreExplanation)
                    }
                    alignSelf={"center"}
                    color={"gray.400"}
                  >
                    <SvgIcon
                      iconName={
                        isShowMoreExplanation ? "ic-up.svg" : "ic-down.svg"
                      }
                      size={20}
                    />
                  </Button>
                </VStack>
              </VStack>
            </VStack>

            <VStack alignItems={"start"} w={"full"}
              display={isPending ? "flex" : "none"}
            >
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
