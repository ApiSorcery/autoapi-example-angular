export interface User {
  id?: number;
  code: string;
  name: string;
  email: string;
  gender?: number;
  avatar?: string;
  address?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserQueryParams {
  code?: string;
  name?: string;
  status?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface UserPagedParams extends UserQueryParams {
  pagination: PaginationParams;
}

export interface SelectOption {
  value: any;
  label: string;
  color?: string;
}
