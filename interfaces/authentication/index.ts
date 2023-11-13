export interface ILoginDataReq {
  email: string
  password: string
}

export interface ILoginDataRes {
  token: string
  isInactive: boolean
}

export interface ISignUpData {
  email: string
  password: string
}

export interface IForgotPasswordRequest {
  email: string
  platform: string
}

export interface IForgotPasswordResponse {
  message: string
}

export interface IResetPasswordRequest {
  newPassword: string
  confirmNewPassword: string
  resetPasswordToken: string
}

export interface IResetPasswordResponse {
  message: string
}

export interface IServerError {
  statusCode: number
  name: string
  message: string
  code?: string
}

export interface IRequestHeader {
  Authorization?: string
}
