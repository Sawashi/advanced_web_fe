import { api, auth } from "API";
import { errorHandler } from "API/helpers";
import { IResetPasswordRequest } from "interfaces/authentication";
import { CommonError } from "types";

export async function resetPassword(data: IResetPasswordRequest) {
  try {
    const response = await api.post(`/auth/reset-password`, data, {
      headers: auth(),
    });
    return response.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}
