export interface IUser {
  createdAt?: Date;
  dob?: string;
  email?: string;
  firstName?: string;
  id?: string;
  lastName?: string;
  updatedAt?: Date;
  avatar?: string;
  role?: string;
}

export interface IVerifyTokenResponse {
  isValidToken: boolean;
}
