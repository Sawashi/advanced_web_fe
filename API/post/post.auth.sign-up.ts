import { api } from "API";
import { errorHandler } from "API/helpers";
import { IRegisterSchema } from "constants/validation/auth";
import { IServerError } from "interfaces/authentication";
import { IUser } from "interfaces/user";
import { CommonError } from "types";

export async function signUp(
  userData: IRegisterSchema
): Promise<IServerError | IUser> {
  try {
    const response = await api.post<
      {},
      {
        data: IUser;
      }
    >(`/auth/register`, userData);
    return response?.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}
