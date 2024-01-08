import { api } from "API";
import { ReviewApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

interface ICreateReviewCommentPayload {
  reviewId: string;
  commentId: string;
  content: string;
}

export const postCreateReviewCommentReply = async ({
  reviewId,
  commentId,
  content,
}: ICreateReviewCommentPayload) => {
  const res = await api.post<ICreateReviewCommentPayload, IResponseData<{}>>(
    ReviewApiRouters.post.review_comment_reply.value(reviewId, commentId),
    {
      content,
    }
  );
  return res.data;
};

export const usePostCreateReviewCommentReply = (
  reviewId: string,
  commentId: string,
  onSuccess: () => void
) => {
  return useMutation<{}, Error, ICreateReviewCommentPayload>({
    mutationFn: postCreateReviewCommentReply,
    mutationKey: [
      ReviewApiRouters.post.review_comment_reply.value(reviewId, commentId),
    ],
    onSuccess,
  });
};
