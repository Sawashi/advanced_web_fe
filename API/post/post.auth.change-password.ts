import { api, auth } from "API";
import { errorHandler } from "API/helpers";
import { IServerError } from "interfaces/authentication";
import { CommonError } from "types";

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<boolean | IServerError> {
  try {
    const payload = {
      oldPassword,
      newPassword,
    };
    const result = await api.post(`/auth/me/change-password`, payload, {
      headers: auth(),
    });

    if (result.status !== 200) {
      return false;
    }

    return true;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}
