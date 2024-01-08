import {
  Box,
  Button,
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
import React, { useCallback } from "react";
import { useState } from "react";
import { primary500 } from "theme/colors.theme";
import { checkValidArray, getValidArray } from "utils/common";
import { usePostCreateReviewComment } from "API/post/post.review.comment";
import { EReviewStatus } from "enums/classes";
import Comment from "./Comment";

type Props = {
  review: IReview;
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
    (item: IReviewComment) => (
      <Comment comment={item} review={review} />
    ),
    [reviewComments, review]
  );

  return (
    <VStack w={"full"} alignItems={"start"} gap={5}>
      <VStack w={"full"} alignItems={"start"} gap={6}>
        <HStack w={"full"} justifyContent={"space-between"}>
          <HStack gap={2}>
            <Text fontSize={"md"} fontWeight={"bold"}>
              Comments
            </Text>

            <Tooltip label={"You just can comment when status is pending"}>
              <Box>
                <SvgIcon iconName="ic-help.svg" size={20} color={primary500} />
              </Box>
            </Tooltip>
          </HStack>

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
          in={isShowComments && checkValidArray(reviewComments)}
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
