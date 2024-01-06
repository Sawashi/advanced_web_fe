import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IMetaResponse, IReview } from "interfaces/classes";
import { useQuery } from "react-query";

interface IGetMyReviewsParams {
  classId: string;
}

interface IGetMyReviewsResponse {
  data: IReview[];
  meta: IMetaResponse;
}

export const getMyReviews = async (params: IGetMyReviewsParams) => {
  const res = await api.get<{}, IResponseData<IGetMyReviewsResponse>>(
    ClassesApiRouters.get.my_reviews.value(params.classId)
  );

  return res.data;
};

export const useGetMyReviews = (classId: string) => {
  return useQuery<IGetMyReviewsResponse, Error, IGetMyReviewsResponse>({
    queryKey: [ClassesApiRouters.get.my_reviews.value(classId)],
    queryFn: () =>
      getMyReviews({
        classId,
      }),
    enabled: !!classId,
  });
};
