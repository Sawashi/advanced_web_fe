import {
  ILoginDataReq,
  ILoginDataRes,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  ISignUpData,
  IServerError
} from 'interfaces/authentication'
import { IUser } from 'interfaces/user'
import { CommonError } from 'types'
import { api, auth, errorHandler } from '.'

export async function login(loginData: ILoginDataReq): Promise<ILoginDataRes | IServerError> {
  try {
    const response = await api.post(`/auth/login`, loginData)
    return response.data
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error)
    throw new Error((<CommonError>err)?.response?.data?.error?.message)
  }
}

export async function forgotPassword(userData: IForgotPasswordRequest) {
  try {
    await api.post(`/auth/forgot-password`, userData, {
      headers: auth()
    })
    return undefined
  } catch (err) {
    throw new Error((<CommonError>err)?.response?.data?.error?.message)
  }
}

export async function resetPassword(resetData: IResetPasswordRequest) {
  try {
    await api.post(`/auth/reset-password`, resetData, {
      headers: auth()
    })

    return undefined
  } catch (err) {
    throw new Error((<CommonError>err)?.response?.data?.error?.message)
  }
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void | IServerError> {
  try {
    const passwords = {
      oldPassword,
      newPassword
    }
    await api.patch(`/auth/change-password`, passwords, {
      headers: auth()
    })
    return undefined
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error)
    throw new Error((<CommonError>err)?.response?.data?.error?.message)
  }
}

export async function signUp(userData: Omit<ISignUpData, 'id'>): Promise<IServerError> {
  try {
    const response = await api.post(`/auth/sign-up`, userData)
    return response?.data
  } catch (err) {
    errorHandler((<CommonError>err)?.response?.data?.error)
    throw new Error((<CommonError>err)?.response?.data?.error?.message)
  }
}

export async function getCurrentUser(): Promise<IUser> {
  try {
    const response = await api.get(`/auth/me`, {
      headers: auth()
    })
    const data: IUser = response?.data ?? {}
    return data
  } catch (err) {
    const error = (<CommonError>err)?.response?.data?.error
    errorHandler(error)
    return {} as IUser
  }
}
