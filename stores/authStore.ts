import { action, makeObservable, observable } from 'mobx'
import { getCurrentUser, login as loginAPI } from 'API/authenticate'
import { AuthenticateParams, ErrorMessageEnum } from 'constants/enum'
import { ILoginDataReq, ILoginDataRes } from 'interfaces/authentication'
import { IUser } from 'interfaces/user'
import { CommonError } from 'types'

class AuthStore {
  rootStore: unknown

  constructor(rootStore: unknown) {
    this.rootStore = rootStore

    makeObservable(this, {
      isLoading: observable,
      user: observable,
      accessToken: observable,
      login: action,
      fetchCurrentUser: action,
      logout: action
    })
  }

  public accessToken: string = ''
  public isLoading: boolean = false
  public user: IUser = {
    email: ''
  }

  public async login(loginData: ILoginDataReq): Promise<void> {
    this.isLoading = true

    try {
      const response = await loginAPI(loginData)
      const { token, isInactive } = response as ILoginDataRes

      if (isInactive) {
        this.isLoading = false
        throw new Error(ErrorMessageEnum.ACCOUNT_DISABLED_PLEASE_CONTACT_ADMIN)
      }

      if (typeof token === 'string') {
        localStorage.setItem(AuthenticateParams.ACCESS_TOKEN, token)
        this.accessToken = token
        this.isLoading = false
      }
    } catch (error) {
      this.isLoading = false
      throw new Error((<CommonError>error)?.message)
    }
  }

  public async fetchCurrentUser() {
    this.accessToken = localStorage.getItem(AuthenticateParams.ACCESS_TOKEN) as string
    this.user = await getCurrentUser()
  }

  public logout() {
    this.user = {} as IUser
    localStorage.setItem(AuthenticateParams.ACCESS_TOKEN, '')
  }
}

export default AuthStore
