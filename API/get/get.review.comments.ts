import { api } from "API";
import { ReviewApiRouters } from "API/router.api";
import { IMetaResponse, IReviewComment } from "interfaces/classes";
import { useQuery } from "react-query";

interface IGetReviewComments {
  reviewId: string;
}

interface IGetReviewCommentsResponse {
  data: IReviewComment[];
  meta: IMetaResponse;
}

export const getReviewComments = async ({ reviewId }: IGetReviewComments) => {
  const response = await api.get<IGetReviewCommentsResponse>(
    ReviewApiRouters.get.review_comments.value(reviewId)
  );
  return response.data;
};

export const useGetReviewComments = ({ reviewId }: IGetReviewComments) => {
  return useQuery<
    IGetReviewCommentsResponse,
    Error,
    IGetReviewCommentsResponse
  >(
    [ReviewApiRouters.get.review_comments.value(reviewId), reviewId],
    () => getReviewComments({ reviewId }),
    {
      enabled: !!reviewId,
    }
  );
};
