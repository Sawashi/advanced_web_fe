import Modal from "components/Modal";
import React, { useCallback } from "react";
import { Button, Code, Collapse, HStack, Text, VStack } from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { gray700 } from "theme/colors.theme";
import { timeAgo } from "utils/common";
import { EReviewStatus, ETabName } from "enums/classes";
import { useStores } from "hooks/useStores";
import { useRouter } from "next/router";
import routes from "routes";
import { IReview } from "interfaces/classes";
import { observer } from "mobx-react";
import { StatusRender } from "../TeacherReviewsScene/ReviewDetailsItem";
import Comments from "../Comments";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  review: IReview;
};

const ReviewDetails = ({ isVisible, onClose, review }: Props) => {
  const router = useRouter();
  const { classStore } = useStores();
  const isPending = review?.status === EReviewStatus.PENDING;

  const [isShowMoreExplanation, setIsShowMoreExplanation] =
    React.useState(false);

  const onCloseModal = async () => {
    await router.replace(
      routes.classes.details.value(
        classStore?.currentClass?.id ?? "",
        ETabName.Reviews
      ),
      undefined,
      { shallow: true }
    );
    onClose();
  };

  const Title = useCallback(() => {
    return (
      <HStack w="full" justifyContent={"space-between"}>
        <HStack>
          <Text fontSize={20} fontWeight={600}>
            Review
          </Text>
          <StatusRender review={review} />
        </HStack>
      </HStack>
    );
  }, [review]);

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
          gap={5}
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
              <HStack w={"full"} gap={3} alignItems={"center"}>
                <Text fontSize={"sm"} color={"gray.500"} fontWeight={"bold"}>
                  Time:
                </Text>
                <Text
                  fontSize={"md"}
                  fontWeight={"700"}
                  ml={2}
                  color={"gray.700"}
                >
                  {timeAgo(review?.updatedAt ?? "")}
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {!isPending ? (
            <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
              <Text fontSize={"md"} fontWeight={"bold"} color={"primary.500"}>
                Teacher review
              </Text>

              <VStack w={"full"} p={3}>
                <HStack w={"full"} gap={3} alignItems={"center"}>
                  <Text fontSize={"sm"} color={"gray.500"} fontWeight={"bold"}>
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
                  <Text fontSize={"sm"} color={"gray.500"} fontWeight={"bold"}>
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

export default observer(ReviewDetails);