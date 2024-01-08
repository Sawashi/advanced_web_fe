import { api } from "API";
import { ClassesApiRouters, ID } from "API/router.api";
import { IResponseData } from "API/types";
import { useMutation, useQueryClient } from "react-query";

export const patchUpdateClassDetails = async ({
  name,
  description,
  classId,
}: {
  name?: string;
  description?: string;
  classId: ID;
}) => {
  const response = await api.patch<
    { name: string; description: string },
    IResponseData<{}>
  >(ClassesApiRouters.patch.update_class_details.value(classId), {
    name,
    description,
  });
  return response;
};

export const useUpdateClassDetails = (classId: ID) => {
  const queryClient = useQueryClient();
  return useMutation<
    IResponseData<{}>,
    Error,
    {
      name?: string;
      description?: string;
      classId: ID;
    }
  >({
    mutationFn: patchUpdateClassDetails,
    mutationKey: [ClassesApiRouters.patch.update_class_details.value(classId)],
    onSuccess: async () => {
      await Promise.all([queryClient.refetchQueries()]);
    },
  });
};
