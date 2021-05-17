import { IUserData } from "@/app/user/domain/User.types";

export const state = () => ({
  loading: false,
  error: null as string | null,
  userData: {} as IUserData,
});
export type UserState = ReturnType<typeof state>;
