import {ITargetData} from "@/app/target/domain/Target.types";

export const state = () => ({
  loading: false,
  targets: [] as ITargetData[],
  error: null as string | null,
});

export type TargetsState = ReturnType<typeof state>;
