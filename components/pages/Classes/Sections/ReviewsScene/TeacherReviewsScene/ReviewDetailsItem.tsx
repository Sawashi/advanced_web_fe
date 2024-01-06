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
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { EReviewStatus } from "enums/classes";
import { IReview } from "interfaces/classes";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { gray700 } from "theme/colors.theme";

type Props = {
  review: IReview;
};

const ReviewsDetailItem = ({ review }: Props) => {
  const timeRender = useMemo(() => {
    const now = moment();
    const createdAt = moment(review?.createdAt);
    const diff = now.diff(createdAt, "hours");
    if (diff < 24) {
      return createdAt.fromNow();
    } else {
      return createdAt.format("DD/MM/YYYY");
    }
  }, [review?.createdAt]);

  const [isShowMore, setIsShowMore] = useState(false);

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
          gap={5}
          divider={<Divider orientation="vertical" borderColor="gray.300" />}
        >
          <HStack flex={1} alignItems={"center"} gap={3}>
            <Avatar
              size={"sm"}
              name={
                review?.requester?.firstName + " " + review?.requester?.lastName
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
          <VStack flex={1} alignItems={"end"}>
            <Text fontSize={"xs"} fontWeight={"bold"} color={"gray.500"}>
              {timeRender}
            </Text>

            <StatusRender />
          </VStack>
        </HStack>

        <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
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

        <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
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
            <SvgIcon iconName="ic-arrow-right.svg" size={20} color={gray700} />
            <VStack flex={1}>
              <Text fontSize={"md"} color={"gray.700"} fontWeight={"bold"}>
                To
              </Text>
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
                {review?.studentExpectedGrade}
              </Code>
            </VStack>
          </HStack>
        </VStack>

        <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
          <Text fontSize={"md"} fontWeight={"bold"} color={"primary.500"}>
            Explanation
          </Text>

          <Collapse startingHeight={50} in={isShowMore}>
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
            onClick={() => setIsShowMore(!isShowMore)}
            alignSelf={"center"}
            color={"gray.400"}
          >
            <SvgIcon
              iconName={isShowMore ? "ic-up.svg" : "ic-down.svg"}
              size={20}
            />
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default ReviewsDetailItem;
