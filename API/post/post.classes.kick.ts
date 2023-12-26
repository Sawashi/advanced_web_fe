import { api } from "API";
import { ClassesApiRouters } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation } from "react-query";

type TPostKickAttendeeBody = {
  attendeeId: string;
  classId: string;
};

export const postKickStudent = async ({
  attendeeId,
  classId,
}: TPostKickAttendeeBody) => {
  const res = await api.post<{}, IResponseData<{}>>(
    ClassesApiRouters.post.kick_attendee.value(classId),
    {
      attendeeId,
    }
  );

  return res;
};

export const usePostKickStudent = () => {
  return useMutation<IResponseData<{}>, Error, TPostKickAttendeeBody>({
    mutationFn: postKickStudent,
    mutationKey: [ClassesApiRouters.post.kick_attendee.value],
  });
};
