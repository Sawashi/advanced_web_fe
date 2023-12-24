import { api, auth } from "API";
import { errorHandler } from "API/helpers";
import { IUser } from "interfaces/user";
import { CommonError } from "types";

export async function editProfile(userData: Partial<IUser>): Promise<IUser> {
  try {
    const response = await api.patch(
      `/auth/me`,
      {
        ...userData,
      },
      {
        headers: auth(),
      }
    );
    const data: IUser = response?.data ?? {};
    return data;
  } catch (err) {
    const error = (<CommonError>err)?.response?.data?.error;
    errorHandler(error);
    return {} as IUser;
  }
}
