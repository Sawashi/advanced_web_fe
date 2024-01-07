import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData, URLQueryType } from "API/types";
import { EReviewStatus } from "enums/classes";
import { IMetaResponse, IReview } from "interfaces/classes";
import { useQuery } from "react-query";

interface IGetClassReviewsParams {
  classId: string;
  query?: URLQueryType<{}>;
}

interface IGetClassReviewsResponse {
  data: IReview[];
  meta: IMetaResponse;
}

export const getClassReviews = async (params: IGetClassReviewsParams) => {
  const res = await api.get<{}, IResponseData<IGetClassReviewsResponse>>(
    ClassesApiRouters.get.reviews.value(params?.classId, params?.query)
  );

  return res.data;
};

export const useGetClassReviews = (
  classId: string,
  query?: URLQueryType<{
    "filter.status"?: EReviewStatus;
  }>
) => {
  return useQuery<IGetClassReviewsResponse, Error, IGetClassReviewsResponse>({
    queryKey: [
      ClassesApiRouters.get.reviews.value(classId),
      query?.["filter.status"],
    ],
    queryFn: () =>
      getClassReviews({
        classId,
        query,
      }),
    enabled: !!classId,
    keepPreviousData: true,
  });
};
