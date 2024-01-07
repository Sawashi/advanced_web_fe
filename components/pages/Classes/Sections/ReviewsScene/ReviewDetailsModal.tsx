import Modal from "components/Modal";
import React, { useCallback } from "react";
import {
  Button,
  Center,
  Code,
  Collapse,
  Divider,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useGetReview } from "API/get/get.review.details";
import SvgIcon from "components/SvgIcon";
import { gray700 } from "theme/colors.theme";
import Comments from "./Comments/index.ts";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  reviewId: string;
};

const ReviewDetails = ({ isVisible, onClose, reviewId }: Props) => {
  const {
    data: review,
    isLoading: isReviewLoading,
    refetch: refetchReview,
  } = useGetReview(reviewId);

  const [isShowMoreExplanation, setIsShowMoreExplanation] =
    React.useState(false);

  const onCloseModal = () => {
    onClose();
  };

  const Title = useCallback(() => {
    return (
      <HStack w="full" justifyContent={"space-between"}>
        <Text fontSize={20} fontWeight={600}>
          Review
        </Text>
      </HStack>
    );
  }, []);

  if (isReviewLoading) {
    return null;
  }

  return (
    <Modal
      isVisible={isVisible}
      onClose={onCloseModal}
      title={<Title />}
      size="full"
      scrollBehavior="inside"
    >
      <VStack alignItems={"center"} spacing={5} p={5}>
        <VStack
          w={"full"}
          alignItems={"start"}
          maxW={"container.lg"}
          justifyContent={"space-between"}
        >
          <VStack w={"full"} alignItems={"start"}>
            <Text fontSize={"md"} fontWeight={"bold"} color={"primary.500"}>
              Details
            </Text>

            <VStack w={"full"} p={3}>
              <HStack w={"full"} gap={3} alignItems={"center"}>
                <Text fontSize={"sm"} color={"gray.500"} fontWeight={"bold"}>
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
                <Text fontSize={"sm"} color={"gray.500"} fontWeight={"bold"}>
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

          <VStack w={"full"} alignItems={"start"}>
            <Text fontSize={"md"} fontWeight={"bold"} color={"primary.500"}>
              Review
            </Text>

            <HStack w={"full"} justifyContent={"space-between"} gap={5}>
              <VStack flex={1}>
                <Text fontSize={"lg"} color={"gray.700"} fontWeight={"bold"}>
                  From
                </Text>
                <Code
                  fontSize={"md"}
                  fontWeight={"700"}
                  borderRadius={6}
                  p={2}
                  backgroundColor={
                    Number(review?.studentCurrentGrade) >
                    Number(review?.studentExpectedGrade)
                      ? "red.100"
                      : "green.100"
                  }
                  color={
                    Number(review?.studentCurrentGrade) >
                    Number(review?.studentExpectedGrade)
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
                <Text fontSize={"md"} color={"gray.700"} fontWeight={"bold"}>
                  To
                </Text>
                <HStack>
                  <Code
                    fontSize={"md"}
                    fontWeight={"700"}
                    borderRadius={6}
                    p={2}
                    backgroundColor={
                      Number(review?.studentCurrentGrade) >
                      Number(review?.studentExpectedGrade)
                        ? "red.100"
                        : "green.100"
                    }
                    color={
                      Number(review?.studentCurrentGrade) >
                      Number(review?.studentExpectedGrade)
                        ? "red.500"
                        : "green.500"
                    }
                  >
                    {Number(review?.studentExpectedGrade)}
                  </Code>
                </HStack>
              </VStack>
            </HStack>
          </VStack>

          <VStack w={"full"} alignItems={"start"}>
            <Text fontSize={"md"} fontWeight={"bold"} color={"primary.500"}>
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
              onClick={() => setIsShowMoreExplanation(!isShowMoreExplanation)}
              alignSelf={"center"}
              color={"gray.400"}
            >
              <SvgIcon
                iconName={isShowMoreExplanation ? "ic-up.svg" : "ic-down.svg"}
                size={20}
              />
            </Button>
          </VStack>
        </VStack>

        <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
          {(review && <Comments review={review} />) || <></>}
        </VStack>
      </VStack>
    </Modal>
  );
};

export default ReviewDetails;
