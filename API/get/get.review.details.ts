import { api } from "API";
import { ReviewApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IReview } from "interfaces/classes";
import { useQuery } from "react-query";

interface IGetReviewParams {
  reviewId: string;
}

interface IGetReviewResponse {
  data: IReview;
}

export const getReview = async (params: IGetReviewParams) => {
  const res = await api.get<{}, IResponseData<IReview>>(
    ReviewApiRouters.get.review_details.value(params?.reviewId)
  );

  return res.data;
};

export const useGetReview = (reviewId: string) => {
  return useQuery<IGetReviewResponse, Error, IReview>({
    queryKey: [ReviewApiRouters.get.review_details.value(reviewId)],
    queryFn: () =>
    getReview({
        reviewId,
      }),
    enabled: !!reviewId,
    keepPreviousData: true,
  });
};
