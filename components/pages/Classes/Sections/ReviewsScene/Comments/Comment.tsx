import {
  Avatar,
  Button,
  Circle,
  Collapse,
  HStack,
  Input,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { IReview, IReviewComment } from "interfaces/classes";
import React, { useCallback, useMemo } from "react";
import { getValidArray, timeAgo } from "utils/common";
import moment from "moment";
import { EReviewStatus } from "enums/classes";
import SvgIcon from "components/SvgIcon";
import { primary500 } from "theme/colors.theme";
import { useGetReviewCommentReplies } from "API/get/get.review.comment-replies";

const Comment = ({
  comment,
  review,
}: {
  comment: IReviewComment;
  review: IReview;
}) => {
  const isPending = review?.status === EReviewStatus.PENDING;
  const replyInputRef = React.useRef<HTMLInputElement>(null);
  const [isShowReplies, setIsShowReplies] = React.useState(false);

  const {
    data: dataGetReviewCommentReplies,
    refetch: refetchGetReviewCommentReplies,
  } = useGetReviewCommentReplies({
    reviewId: review.id,
    commentId: comment.id,
  });
  const { data: reviewCommentReplies } = dataGetReviewCommentReplies ?? {};

  const updatedTime = useMemo(() => {
    return timeAgo(comment?.updatedAt);
  }, [comment?.updatedAt]);

  const renderReply = useCallback(
    (item: IReviewComment) => <Comment comment={item} review={review} />,
    [reviewCommentReplies, review, comment]
  );

  const handleSendReply = (value: string) => {};

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
              onClick={() => {
                setIsShowReplies(!isShowReplies);
              }}
            >
              {`${comment?.childrenCount ?? 0} replies`}
            </Text>
          </HStack>

          <Collapse in={isShowReplies} style={{ width: "100%" }}>
            <VStack w={"full"} alignItems={"start"}>
              <VStack w={"full"} alignItems={"start"}>
                {getValidArray(reviewCommentReplies)?.map(renderReply)}
              </VStack>
              {isPending ? (
                <HStack w={"full"}>
                  <Input
                    ref={replyInputRef}
                    placeholder="Reply to this comment"
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
                        if (replyInputRef.current?.value) {
                          handleSendReply(replyInputRef.current?.value);
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
                    isLoading={false}
                    onClick={() => {
                      if (replyInputRef.current?.value) {
                        handleSendReply(replyInputRef.current?.value);
                      }
                    }}
                  >
                    <SvgIcon
                      iconName="ic-reply.svg"
                      size={20}
                      color={primary500}
                    />
                  </Button>
                </HStack>
              ) : null}
            </VStack>
          </Collapse>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Comment;
