import { api, auth } from "API";
import { errorHandler } from "API/helpers";
import { CommonError } from "types";

export async function verifyToken(token: string) {
  try {
    const response = await api.post(
      `/auth/verify-email`,
      { token },
      {
        headers: auth(),
      }
    );
    return response.data;
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error);
    throw new Error((<CommonError>err)?.response?.data?.error?.message);
  }
}
