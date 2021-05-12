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
