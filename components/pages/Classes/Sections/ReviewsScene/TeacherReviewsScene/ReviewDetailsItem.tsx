import {
  HStack,
  VStack,
  Text,
  Divider,
  Avatar,
  Badge,
  Code,
  Button,
  Collapse,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { EReviewStatus } from "enums/classes";
import { IReview } from "interfaces/classes";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { gray500, gray700, pink500 } from "theme/colors.theme";
import ReviewModal from "./ReviewModal";
import Comments from "../Comments";
import { timeAgo } from "utils/common";

type Props = {
  review: IReview;
  refetch?: () => Promise<void>;
};

const ReviewsDetailItem = ({ review, refetch }: Props) => {
  const timeRender = useMemo(() => {
    return timeAgo(review?.createdAt);
  }, [review?.createdAt]);

  const [isShowMoreExplanation, setIsShowMoreExplanation] = useState(false);
  const [isShowMoreReview, setIsShowMoreReview] = useState(false);
  const [isShowReviewModal, setIsShowReviewModal] = useState(false);

  const isPending = review?.status === EReviewStatus.PENDING;

  const StatusRender = useCallback(() => {
    switch (review?.status) {
      case EReviewStatus.ACCEPTED:
        return (
          <Badge
            colorScheme="green"
            fontSize={"xs"}
            fontWeight={"bold"}
            bgColor={"green.100"}
            p={2}
            borderRadius={6}
          >
            <Text fontSize={"xs"} fontWeight={"bold"} color={"green.500"}>
              Approved
            </Text>
          </Badge>
        );
      case EReviewStatus.REJECTED:
        return (
          <Badge
            colorScheme="red"
            fontSize={"xs"}
            fontWeight={"bold"}
            bgColor={"red.100"}
            p={2}
            borderRadius={6}
          >
            <Text fontSize={"xs"} fontWeight={"bold"} color={"red.500"}>
              Rejected
            </Text>
          </Badge>
        );
      case EReviewStatus.PENDING:
      default:
        return (
          <Badge
            colorScheme="yellow"
            fontSize={"xs"}
            fontWeight={"bold"}
            bgColor={"yellow.100"}
            p={2}
            borderRadius={6}
          >
            <Text fontSize={"xs"} fontWeight={"bold"} color={"yellow.700"}>
              Pending
            </Text>
          </Badge>
        );
    }
  }, [review?.status]);

  return (
    <VStack w={"full"}>
      <VStack
        w={"full"}
        maxW={"container.lg"}
        p={5}
        borderColor={"gray.300"}
        boxShadow={"md"}
        borderWidth={1}
        borderRadius={6}
        alignItems={"start"}
        h={"full"}
        gap={5}
      >
        <HStack
          w={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={2}
        >
          <HStack
            flex={1}
            alignItems={"center"}
            gap={5}
            w={"full"}
            onClick={() => setIsShowMoreReview(!isShowMoreReview)}
            _hover={{
              cursor: "pointer",
            }}
            divider={<Box h={"20px"} w={'2px'} bgColor={"gray.300"} />}
          >
            <HStack flex={1} alignItems={"center"} gap={3}>
              <Avatar
                size={"sm"}
                name={
                  review?.requester?.firstName +
                  " " +
                  review?.requester?.lastName
                }
                src={review?.requester?.avatar}
              />
              <VStack alignItems={"start"} flex={1} gap={1}>
                <Text fontSize={"md"} fontWeight={"bold"} color={"primary.500"}>
                  {review?.requester?.firstName +
                    " " +
                    review?.requester?.lastName}
                </Text>
                <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.500"}>
                  {review?.requester?.email}
                </Text>
              </VStack>
            </HStack>

            {isShowMoreReview ? null : (
              <HStack justifyContent={"space-between"} gap={5}>
                <Text
                  fontSize={"md"}
                  color={"purple.500"}
                  fontWeight={"bold"}
                  whiteSpace={"nowrap"}
                >
                  {review?.grade?.composition?.name}
                </Text>
                <VStack flex={1}>
                  <Code
                    fontSize={"md"}
                    fontWeight={"700"}
                    borderRadius={6}
                    p={2}
                    backgroundColor={
                      review?.studentCurrentGrade > review?.studentExpectedGrade
                        ? "red.100"
                        : "green.100"
                    }
                    color={
                      review?.studentCurrentGrade > review?.studentExpectedGrade
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
                        !!review?.studentFinalGrade &&
                        Number(review?.studentFinalGrade) !==
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
                        !!review?.studentFinalGrade &&
                        Number(review?.studentFinalGrade) !==
                          Number(review?.studentExpectedGrade)
                          ? "inline-block"
                          : "none"
                      }
                    >
                      {review?.studentFinalGrade}
                    </Code>
                  </HStack>
                </VStack>
              </HStack>
            )}

            <VStack flex={1} alignItems={"end"}>
              <Tooltip
                label={moment(review?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                aria-label="A tooltip"
              >
                <Text fontSize={"xs"} fontWeight={"bold"} color={"gray.500"}>
                  {timeRender}
                </Text>
              </Tooltip>

              <StatusRender />
            </VStack>
          </HStack>

          {isPending ? (
            <Button
              variant={"ghost"}
              colorScheme={"primary"}
              size={"sm"}
              onClick={() => setIsShowReviewModal(true)}
              alignSelf={"center"}
              color={"gray.400"}
            >
              <SvgIcon iconName="ic-release.svg" size={20} color={pink500} />
            </Button>
          ) : null}
        </HStack>

        <Collapse
          in={isShowMoreReview}
          style={{
            width: "100%",
          }}
        >
          <VStack
            gap={5}
            w={"full"}
            alignItems={"start"}
            justifyContent={"space-between"}
            divider={<Divider />}
          >
            <VStack gap={5} w="full">
              <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
                <Text fontSize={"md"} fontWeight={"bold"} color={"primary.500"}>
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

              <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
                <Text fontSize={"md"} fontWeight={"bold"} color={"primary.500"}>
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
                          !!review?.studentFinalGrade &&
                          Number(review?.studentFinalGrade) !==
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
                          !!review?.studentFinalGrade &&
                          Number(review?.studentFinalGrade) !==
                            Number(review?.studentExpectedGrade)
                            ? "inline-block"
                            : "none"
                        }
                      >
                        {review?.studentFinalGrade}
                      </Code>
                    </HStack>
                  </VStack>
                </HStack>
              </VStack>

              {!isPending ? (
                <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
                  <Text
                    fontSize={"md"}
                    fontWeight={"bold"}
                    color={"primary.500"}
                  >
                    Teacher
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
                        color={"purple.700"}
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
                        color={"purple.700"}
                      >
                        {review?.endedBy?.email}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              ) : null}

              <VStack
                w={"full"}
                maxW={"container.lg"}
                alignItems={"start"}
                onClick={() => setIsShowMoreExplanation(!isShowMoreExplanation)}
                _hover={{
                  cursor: "pointer",
                }}
              >
                <HStack
                  w={"full"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={5}
                >
                  <Text
                    fontSize={"md"}
                    fontWeight={"bold"}
                    color={"primary.500"}
                  >
                    Explanation
                  </Text>
                  <SvgIcon
                    iconName={
                      isShowMoreExplanation ? "ic-up.svg" : "ic-down.svg"
                    }
                    size={20}
                  />
                </HStack>

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
              </VStack>
            </VStack>

            <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
              <Comments review={review} />
            </VStack>
          </VStack>
        </Collapse>
      </VStack>

      <ReviewModal
        isVisible={isShowReviewModal && !!review}
        onClose={() => {
          refetch?.();
          setIsShowReviewModal(false);
        }}
        review={review}
      />
    </VStack>
  );
};

export default ReviewsDetailItem;
