import { api } from "API";
import { ReviewApiRouters } from "API/router.api";
import { IMetaResponse, IReviewComment } from "interfaces/classes";
import { useQuery } from "react-query";

interface IGetReviewCommentReplies {
  reviewId: string;
  commentId: string;
}

interface IGetReviewRepliesResponse {
  data: IReviewComment[];
  meta: IMetaResponse;
}

export const getReviewCommentReplies = async ({
  reviewId,
  commentId,
}: IGetReviewCommentReplies) => {
  const response = await api.get<IGetReviewRepliesResponse>(
    ReviewApiRouters.get.review_comment_replies.value(reviewId, commentId)
  );
  return response.data;
};

export const useGetReviewCommentReplies = ({
  reviewId,
  commentId,
}: IGetReviewCommentReplies) => {
  return useQuery<IGetReviewRepliesResponse, Error, IGetReviewRepliesResponse>(
    [
      ReviewApiRouters.get.review_comment_replies.value(reviewId, commentId),
      reviewId,
      commentId,
    ],
    () => getReviewCommentReplies({ reviewId, commentId }),
    {
      enabled: !!reviewId && !!commentId,
    }
  );
};
