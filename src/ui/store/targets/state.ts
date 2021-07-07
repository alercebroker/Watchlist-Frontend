import { ITargetData } from "@/app/target/domain/Target.types";

export type TargetsState = {
  loading: boolean;
  targets: ITargetData[];
  error: string | null;
};

export const state = (): TargetsState => ({
  loading: false,
  targets: [] as ITargetData[],
  error: null as string | null,
});
