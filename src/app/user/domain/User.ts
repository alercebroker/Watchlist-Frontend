import { IUser, IUserData } from "./User.types";

export class User implements IUser {
  username: string;
  email: string;
  password: string | null;
  name: string;
  lastName: string;
  token: string | null;
  institution: string | null;
  role: string | null;
  constructor(data: IUserData) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.lastName = data.lastName;
    this.token = data.token;
    this.institution = data.institution;
    this.role = data.role;
  }
  storeToken(): void {
    throw new Error("Method not implemented.");
  }

  deleteToken(): void {
    throw new Error("Method not implemented.");
  }
}
