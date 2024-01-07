import { api } from "API";
import { ReviewApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

interface ICreateReviewCommentPayload {
  reviewId: string;
  content: string;
}

export const postCreateReviewComment = async ({
  reviewId,
  content,
}: ICreateReviewCommentPayload) => {
  const res = await api.post<ICreateReviewCommentPayload, IResponseData<{}>>(
    ReviewApiRouters.post.review_comment.value(reviewId),
    {
      content,
    }
  );
  return res.data;
};

export const usePostCreateReviewComment = (
  reviewId: string,
  onSuccess: () => void
) => {
  return useMutation<{}, Error, ICreateReviewCommentPayload>({
    mutationFn: postCreateReviewComment,
    mutationKey: [ReviewApiRouters.post.review_comment.value(reviewId)],
    onSuccess,
  });
};
