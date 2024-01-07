import { EClassRole, EReviewStatus } from "enums/classes";

export interface IClass {
  [key: string]: any;
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

export interface IComposition {
  id: string;
  name?: string;
  percentage?: number;
  order?: number;
  finalized?: boolean;
}

export interface IStudent {
  [key: string]: any;
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

export interface ICompositionGrade {
  id?: string;
  grade?: number;
  composition?: IComposition;
  student?: IStudent;
}

export interface IReview {
  id: string;
  studentExplanation: string;
  studentExpectedGrade: number;
  studentCurrentGrade: number;
  studentFinalGrade: any;
  status: EReviewStatus;
  createdAt: string;
  updatedAt: string;
  grade: ICompositionGrade;
  requester: IRequester;
}

export interface IRequester {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface IReviewComment {
  id: string;
  content: string;
  level: number;
  createdAt: string;
  updatedAt: string;
  childrenCount: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}
