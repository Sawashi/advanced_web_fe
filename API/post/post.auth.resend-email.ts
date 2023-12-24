import { api } from "API";
import {
  IResendVerificationDataReq,
  IResendVerificationDataRes,
  IServerError,
} from "interfaces/authentication";
import { CommonError } from "types";

export async function resendVerificationEmail(
  loginData: IResendVerificationDataReq
): Promise<IResendVerificationDataRes | IServerError> {
  try {
    const response = await api.post(
      `/auth/resend-verification-email`,
      loginData
    );
    return response.data;
  } catch (err) {
    throw new Error((<CommonError>err)?.response?.data?.error);
  }
}
