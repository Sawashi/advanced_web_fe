import {
  Avatar,
  Box,
  Button,
  Circle,
  Collapse,
  HStack,
  Input,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useGetReviewComments } from "API/get/get.review.comments";
import SvgIcon from "components/SvgIcon";
import { IReview, IReviewComment } from "interfaces/classes";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import { primary500 } from "theme/colors.theme";
import { getValidArray, timeAgo } from "utils/common";
import moment from "moment";
import { usePostCreateReviewComment } from "API/post/post.review.comment";
import { EReviewStatus } from "enums/classes";

type Props = {
  review: IReview;
};

const Comment = ({ comment }: { comment: IReviewComment }) => {
  const updatedTime = useMemo(() => {
    return timeAgo(comment?.updatedAt);
  }, [comment?.updatedAt]);

  return (
    <VStack w={"full"} alignItems={"start"} gap={2}>
      <HStack w={"full"} justifyContent={"start"} gap={3} alignItems={"start"}>
        <Avatar
          size={"sm"}
          name={comment?.user?.firstName + " " + comment?.user?.lastName}
          src={comment?.user?.avatar}
          borderWidth={1}
          borderColor={"gray.200"}
          mt={1}
        />
        <VStack w={"full"} alignItems={"start"} gap={1}>
          <VStack
            w={"full"}
            backgroundColor={"gray.50"}
            borderRadius={12}
            key={comment?.id}
            alignItems={"start"}
            boxShadow={"md"}
            p={5}
            gap={1}
          >
            <HStack w={"full"} justifyContent={"space-between"}>
              <Tooltip label={comment?.user?.email}>
                <Text fontSize={"md"} fontWeight={"bold"}>
                  {comment?.user?.firstName + " " + comment?.user?.lastName}
                </Text>
              </Tooltip>
            </HStack>
            <Text>{comment?.content}</Text>
          </VStack>

          <HStack
            w={"full"}
            justifyContent={"start"}
            px={2}
            gap={2}
            divider={<Circle size={1} backgroundColor={"gray.500"} />}
          >
            <Tooltip label={moment(comment?.updatedAt).format("LLL")}>
              <Text fontSize={"xs"} color={"gray.500"}>
                {updatedTime}
              </Text>
            </Tooltip>

            <Text
              fontSize={"xs"}
              color={"gray.500"}
              _hover={{
                cursor: "pointer",
                color: "primary.500",
                textDecoration: "underline",
              }}
            >
              {`${comment?.childrenCount ?? 0} replies`}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

const Comments = ({ review }: Props) => {
  const isPending = review?.status === EReviewStatus.PENDING;
  const { data: dataGetReviewComments, refetch: refetchGetReviewComments } =
    useGetReviewComments({
      reviewId: review.id,
    });
  const { data: reviewComments } = dataGetReviewComments ?? {};

  const {
    mutateAsync: mutateCreateReviewComment,
    isLoading: isCreatingReviewComment,
  } = usePostCreateReviewComment(review.id, () => {
    refetchGetReviewComments();
  });
  const [isShowComments, setIsShowComments] = useState(true);
  const commentInputRef = React.useRef<HTMLInputElement>(null);

  const handleShowComments = async (value: string) => {
    await mutateCreateReviewComment({
      reviewId: review.id,
      content: value,
    });
    commentInputRef.current!.value = "";
  };

  const renderComment = useCallback(
    (item: IReviewComment) => <Comment comment={item} />,
    [reviewComments]
  );

  return (
    <VStack w={"full"} alignItems={"start"} gap={5}>
      <VStack w={"full"} alignItems={"start"} gap={6}>
        <HStack w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"md"} fontWeight={"bold"}>
            Comments
          </Text>

          <HStack
            alignItems={"center"}
            gap={3}
            onClick={() => {
              setIsShowComments(!isShowComments);
            }}
            _hover={{
              cursor: "pointer",
            }}
            backgroundColor={"gray.100"}
            borderRadius={12}
            px={3}
            py={1}
          >
            <SvgIcon iconName="ic-chat.svg" size={20} color={primary500} />
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {getValidArray(reviewComments)?.length}
            </Text>
          </HStack>
        </HStack>

        <Collapse
          in={isShowComments}
          style={{
            width: "100%",
          }}
        >
          <VStack w={"full"} alignItems={"start"} px={5} gap={5}>
            {getValidArray(reviewComments)?.map(renderComment)}
          </VStack>
        </Collapse>
      </VStack>
      {isPending ? (
        <HStack w={"full"}>
          <Input
            ref={commentInputRef}
            placeholder="Add a comment"
            h={50}
            outline={"none"}
            flex={1}
            w={"full"}
            borderRadius={12}
            borderWidth={1}
            borderColor={"gray.300"}
            _focus={{
              borderColor: "gray.500",
            }}
            _hover={{
              borderColor: "gray.500",
            }}
            fontSize={"sm"}
            enterKeyHint={"send"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (commentInputRef.current?.value) {
                  handleShowComments(commentInputRef.current?.value);
                }
              }
            }}
          />
          <Button
            rounded={"ghost"}
            borderWidth={0}
            borderRadius={12}
            colorScheme={"primary"}
            p={0}
            isLoading={isCreatingReviewComment}
            onClick={() => {
              if (commentInputRef.current?.value) {
                handleShowComments(commentInputRef.current?.value);
              }
            }}
          >
            <SvgIcon iconName="ic-send.svg" size={20} color={primary500} />
          </Button>
        </HStack>
      ) : null}
    </VStack>
  );
};

export default Comments;
