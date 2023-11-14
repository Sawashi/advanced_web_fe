export interface ICredential {
  _id?: string
  emailVerified?: boolean
  email: string
  password: string
}

export interface IToken {
  accessToken: string
  idToken: string
}
