import { useQuery } from "react-query";
import { IAttendee, IClass, IMetaResponse } from "interfaces/classes";
import { api } from "API";
import { ClassesApiRouters, UsersApiRouters } from "API/router.api";
import { IUser } from "interfaces/user";

export interface IAccountListResponse {
  data: IUser[];
  meta: IMetaResponse;
}
export const getAllAccounts = async () => {
  const response = await api.get<IAccountListResponse>(
    UsersApiRouters.get.all_accounts.value
  );
  if (response.status !== 200) throw new Error(response.statusText);
  return response.data;
};
