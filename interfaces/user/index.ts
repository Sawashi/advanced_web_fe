export interface IUser {
  email: string
  createdAt?: Date
  updatedAt?: Date
  id?: string
  username?: string
  role?: string
  name?: string
  phone?: string
  dateOfBirth?: Date | string
  address?: string
  driverProfile?: IDriverProfile
  profileImage?: string
  isInactive?: boolean
  resetPasswordToken?: string
  sendInvitationEmailCount?: number
  // fleetIds?: string[]
  fleetId?: string
  jobTitle?: string
  isAdmin?: boolean

  adminFleets?: Array<{ fleetId: string; isAdmin: boolean }>
}

export interface IDriverProfile {
  profileImage: string
}

export interface IVerifyTokenResponse {
  isValidToken: boolean
}
