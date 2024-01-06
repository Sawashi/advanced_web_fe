import { api } from "API";
import { ReviewApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

interface IPostRequestReviewPayload {
  gradeId: string;
  expectedGrade: number;
  explanation: string;
}

export const postRequestReview = async (payload: IPostRequestReviewPayload) => {
  const res = await api.post<IPostRequestReviewPayload, IResponseData<{}>>(
    ReviewApiRouters.post.create_review.value,
    payload
  );

  return res;
};

export const usePostRequestReview = () => {
  return useMutation<IResponseData<{}>, Error, IPostRequestReviewPayload>({
    mutationFn: postRequestReview,
    mutationKey: [ReviewApiRouters.post.create_review.value]
  })
};