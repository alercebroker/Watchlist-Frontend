import {
  LoginApiResponse,
  RegisterUserApiResponse,
  RegisterUserRequestModel,
  UsersApiResponse,
} from "@/app/user/infrastructure/AuthService.types";

export const mockRegisterUser: RegisterUserApiResponse = {
  username: "username",
  email: "email",
  name: "name",
  last_name: "last name",
  institution: "institution",
  role: "role",
};
export const mockRegisterApiRequest: RegisterUserRequestModel = {
  username: "username",
  password: "password",
  email: "email",
  name: "name",
  last_name: "last name",
  institution: "institution",
  role: "role",
};

export const mockLoginResponse: LoginApiResponse = {
  access: "token",
  refresh: "token",
};

export const mockUsersResponse: UsersApiResponse = {
  username: "username",
  email: "email",
  name: "name",
  last_name: "last name",
  institution: "institution",
  role: "role",
};
