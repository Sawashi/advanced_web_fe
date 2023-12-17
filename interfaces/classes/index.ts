export interface IClass {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  owner: IClassOwner;
}

export interface IClassOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: any;
}

export interface IMetaResponse {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: string[][];
}
