import { EClassRole } from "enums/classes";

export interface IClass {
  id?: string;
  name?: string;
  description?: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: any;
  owner?: IAttendeeProfile;
  role?: EClassRole;
}

export interface IAttendeeProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: any;
}

export interface IAttendee {
  user?: IAttendeeProfile;
  role?: EClassRole;
  joinedAt?: string;
}

export interface IMetaResponse {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: string[][];
}

export interface IGradeComposition {
  id: string;
  name?: string;
  percentage?: number;
  order?: number;
  finalized?: boolean;
}

export interface IStudent {
  id: string;
  name: string;
  user: {
    email?: string;
    firstName?: string;
    lastName?: string;
    avatar?: any;
    id?: string;
  };
}
