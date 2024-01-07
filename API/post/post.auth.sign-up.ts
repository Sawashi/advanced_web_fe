import { api } from "API";
import { errorHandler } from "API/helpers";
import { UsersApiRouters } from "API/router.api";
import { IRegisterSchema } from "constants/validation/auth";
import { IServerError } from "interfaces/authentication";
import { IUser } from "interfaces/user";
import { CommonError } from "types";

interface ICreateUserByAdmin {
  dob: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}
export const createUserByAdmin = async (payload: ICreateUserByAdmin) => {
  try {
    const response = await api.post(
      UsersApiRouters.post.create_user_by_admin.value,
      {
        email: payload?.email,
        password: payload?.password,
        firstName: payload?.firstName,
        lastName: payload?.lastName,
        dob: payload?.dob,
        role: payload?.role,
        status: "active",
      }
    );
    return response?.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
};
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
