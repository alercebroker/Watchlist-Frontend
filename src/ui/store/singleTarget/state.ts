import { ITargetData } from "@/app/target/domain/Target.types";

export type SingleTargetState = {
  loading: boolean;
  target: ITargetData;
  error: Error | null;
};

export const state = (): SingleTargetState => ({
  loading: false,
  target: {} as ITargetData,
  error: null,
});
