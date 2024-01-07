import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData, URLQueryType } from "API/types";
import { EReviewStatus } from "enums/classes";
import { IMetaResponse, IReview } from "interfaces/classes";
import { useQuery } from "react-query";

interface IGetMyReviewsParams {
  classId: string;
  query?: URLQueryType<{}>;
}

interface IGetMyReviewsResponse {
  data: IReview[];
  meta: IMetaResponse;
}

export const getMyReviews = async (params: IGetMyReviewsParams) => {
  const res = await api.get<{}, IResponseData<IGetMyReviewsResponse>>(
    ClassesApiRouters.get.my_reviews.value(params.classId, params?.query)
  );

  return res.data;
};

export const useGetMyReviews = (
  classId: string,
  query?: URLQueryType<{
    "filter.status"?: EReviewStatus;
  }>
) => {
  return useQuery<IGetMyReviewsResponse, Error, IGetMyReviewsResponse>({
    queryKey: [
      ClassesApiRouters.get.my_reviews.value(classId),
      query?.["filter.status"],
    ],
    queryFn: () =>
      getMyReviews({
        classId,
        query,
      }),
    enabled: !!classId,
    keepPreviousData: true,
  });
};
