import { api } from "API";
import { NotificationsApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

interface IPatchSeenNotificationParams {
  notificationId: string;
  onSuccess?: () => void;
}

export const patchSeenNotification = async ({
  notificationId,
}: IPatchSeenNotificationParams) => {
  const res = await api.patch<{}, IResponseData<{}>>(
    NotificationsApiRouters.patch.mark_seen.value(notificationId)
  );
  return res.data;
};

export const usePatchSeenNotification = ({
  notificationId,
  onSuccess,
}: IPatchSeenNotificationParams) => {
  return useMutation(
    [NotificationsApiRouters.patch.mark_seen.value(notificationId)],
    () => patchSeenNotification({ notificationId }),
    {
      onSuccess,
    }
  );
};
