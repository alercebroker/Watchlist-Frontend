import { IUserData } from "@/app/user/domain/User.types";

export type UserState = {
  loading: boolean;
  error: string | null;
  userData: IUserData;
};

export const state = (): UserState => ({
  loading: false,
  error: null,
  userData: {} as IUserData,
});
