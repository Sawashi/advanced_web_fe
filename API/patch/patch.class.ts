import { api } from "API";
import { ClassesApiRouters } from "API/router.api";

export const restoreClass = async (classId: string) => {
  const response = await api.patch(
    ClassesApiRouters.patch.restore_soft_deleted_class.value(classId)
  );
  if (response.status !== 200) throw new Error(response.statusText);
  return response.data;
};
export const softDeleteClass = async (classId: string) => {
  const response = await api.patch(
    ClassesApiRouters.patch.soft_delete_class.value(classId)
  );
  if (response.status !== 200) throw new Error(response.statusText);
  return response.data;
};
