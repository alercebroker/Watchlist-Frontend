import { IUser, IUserData } from "./User.types";

export class User implements IUser {
  username: string;
  email: string;
  password: string | null;
  name: string;
  lastName: string;
  accessToken: string | null;
  refreshToken: string | null;
  institution: string | null;
  role: string | null;
  constructor(data: IUserData) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.lastName = data.lastName;
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.institution = data.institution;
    this.role = data.role;
  }
  storeToken(): void {
    localStorage.setItem("access_token", this.accessToken as string);
    localStorage.setItem("refresh_token", this.refreshToken as string);
  }

  deleteToken(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}
