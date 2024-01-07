export interface IUser {
  [key: string]: any;
  createdAt?: Date;
  dob?: string;
  email?: string;
  firstName?: string;
  id?: string;
  lastName?: string;
  updatedAt?: Date;
  avatar?: string;
  role?: string;
  status?: string;
}

export interface IVerifyTokenResponse {
  isValidToken: boolean;
}

export interface INotification {
  id: string;
  title: string;
  description: string;
  seen: boolean;
  type: string;
  data: string;
  createdAt: string;
  user: IUser;
}
