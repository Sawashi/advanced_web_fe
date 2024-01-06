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
export const mapStudentId = async (
  classId: string,
  studentId: string,
  userId: string
) => {
  console.log("Running: ", classId, studentId, userId);
  const response = await api.patch(
    ClassesApiRouters.patch.map_student_id.value(classId),
    { studentId, userId }
  );
  if (response.status !== 200) throw new Error(response.statusText);
  return response.data;
};
export const unmapStudentId = async (classId: string, userId: string) => {
  const response = await api.patch(
    ClassesApiRouters.patch.unmap_student_id.value(classId),
    { userId }
  );
  if (response.status !== 200) throw new Error(response.statusText);
  return response.data;
};
