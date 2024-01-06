import { api } from "API";
import { ReviewApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { EReviewStatus } from "enums/classes";
import { useMutation } from "react-query";

interface IUpdateReviewPayload {
  reviewId: string;
  status: EReviewStatus;
  finalGrade?: number;
}

export const patchUpdateReview = async ({
  reviewId,
  status,
  finalGrade,
}: IUpdateReviewPayload) => {
  const response = await api.patch<IUpdateReviewPayload, IResponseData<{}>>(
    ReviewApiRouters.patch.update_review.value(reviewId),
    {
      status,
      finalGrade,
    }
  );
  return response;
};

export const useUpdateReview = (reviewId: string) => {
  return useMutation<IResponseData<{}>, Error, IUpdateReviewPayload>({
    mutationFn: patchUpdateReview,
    mutationKey: [ReviewApiRouters.patch.update_review.value(reviewId)],
  });
};
