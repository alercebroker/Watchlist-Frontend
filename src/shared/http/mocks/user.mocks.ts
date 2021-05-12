import { RegisterUserApiResponse } from "@/app/user/infrastructure/AuthService.types";

export const mockRegisterUser: RegisterUserApiResponse = {
  username: "username",
  email: "email",
  name: "name",
  last_name: "last name",
  institution: "institution",
  role: "role",
};
