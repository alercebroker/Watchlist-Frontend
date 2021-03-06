export interface RegisterUserRequestModel {
  username: string;
  email: string;
  password: string;
  name: string;
  last_name: string;
  institution: string;
  role: string;
}

export interface RegisterUserApiResponse {
  username: string;
  email: string;
  name: string;
  last_name: string;
  institution: string;
  role: string;
}

export interface LoginUserApiRequestModel {
  username: string;
  password: string;
}

export interface LoginApiResponse {
  access: string;
  refresh: string;
}

export interface UsersApiResponse {
  username: string;
  email: string;
  name: string;
  last_name: string;
  institution: string;
  role: string;
}

export interface ActivateUserApiRequestModel {
  uid: string;
  token: string;
}

export interface LoginGoogleApiRequestModel {
  code: string;
  state: string;
}
