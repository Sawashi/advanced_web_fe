import { api } from "API";
import { ClassesApiRouters } from "API/router.api";

export const softDeleteClass = async (classId: string) => {
  const response = await api.delete(
    ClassesApiRouters.delete.soft_delete_class.value(classId)
  );
  if (response.status !== 200) throw new Error(response.statusText);
  return response.data;
};
