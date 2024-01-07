import { api } from "API";
import { NotificationsApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { IMetaResponse } from "interfaces/classes";
import { INotification } from "interfaces/user";
import { useQuery } from "react-query";

interface IGetMeNotificationsResponse {
  data: INotification[];
  meta: IMetaResponse;
}

export const getMeNotifications = async () => {
  const res = await api.get<IGetMeNotificationsResponse>(
    NotificationsApiRouters.get.my_notifications.value
  );
  return res.data;
};

export const getMeUnseenNotifications = async () => {
  const res = await api.get<{},IResponseData<number>>(
    NotificationsApiRouters.get.my_notifications.value + "/count-unseen"
  );
  return res;
};

export const useGetMyNotifications = () => {
  return useQuery(
    [NotificationsApiRouters.get.my_notifications.value],
    getMeNotifications
  );
};

export const useGetMyUnseenNotifications = () => {
  return useQuery(
    [NotificationsApiRouters.get.my_notifications.value + "/count-unseen"],
    getMeUnseenNotifications,
    {
      refetchInterval: 5 * 1000,
    }
  );
};
