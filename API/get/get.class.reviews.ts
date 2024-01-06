import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IMetaResponse, IReview } from "interfaces/classes";
import { useQuery } from "react-query";

interface IGetClassReviewsParams {
  classId: string;
}

interface IGetClassReviewsResponse {
  data: IReview[];
  meta: IMetaResponse;
}

export const getClassReviews = async (params: IGetClassReviewsParams) => {
  const res = await api.get<{}, IResponseData<IGetClassReviewsResponse>>(
    ClassesApiRouters.get.reviews.value(params.classId)
  );

  return res.data;
};

export const useGetClassReviews = (classId: string) => {
  return useQuery<IGetClassReviewsResponse, Error, IGetClassReviewsResponse>({
    queryKey: [ClassesApiRouters.get.reviews.value(classId)],
    queryFn: () =>
      getClassReviews({
        classId,
      }),
    enabled: !!classId,
  });
};
