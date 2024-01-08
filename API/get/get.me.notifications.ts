import { api } from "API";
import { NotificationsApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IMetaResponse } from "interfaces/classes";
import { INotification } from "interfaces/user";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

interface IGetMeNotificationsResponse {
  data: INotification[];
  meta: IMetaResponse;
}

export const getMeNotifications = async (page: number, limit: number = 6) => {
  const res = await api.get<{}, IResponseData<IGetMeNotificationsResponse>>(
    NotificationsApiRouters.get.my_notifications.value,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return res.data;
};

export const getMeUnseenNotifications = async () => {
  const res = await api.get<{}, IResponseData<number>>(
    NotificationsApiRouters.get.my_notifications.value + "/count-unseen"
  );
  return res;
};

export const useGetMyNotifications = (enabled: boolean) => {
  const queryClient = useQueryClient();

  return {
    ...useInfiniteQuery(
      [NotificationsApiRouters.get.my_notifications.value],
      ({ pageParam = 1 }) => getMeNotifications(pageParam),
      {
        enabled,
        keepPreviousData: true,
        getNextPageParam: (lastPage) => {
          if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
            return lastPage.meta.currentPage + 1;
          }

          return undefined;
        },
      }
    ),
    reset: () => {
      queryClient.resetQueries(
        NotificationsApiRouters.get.my_notifications.value
      );
    },
  };
};

export const useGetMyUnseenNotifications = () => {
  return useQuery(
    [NotificationsApiRouters.get.my_notifications.value + "/count-unseen"],
    getMeUnseenNotifications,
    {
      refetchInterval: 10 * 1000,
    }
  );
};
