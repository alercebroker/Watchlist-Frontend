import { ITargetData } from "@/app/target/domain/Target.types";

export type TargetsState = {
  loading: boolean;
  targets: ITargetData[];
  error: string | null;
  count: number;
  nextPage: string | null;
  prevPage: string | null;
};

export const state = (): TargetsState => ({
  loading: false,
  targets: [] as ITargetData[],
  error: null as string | null,
  count: 0,
  nextPage: null,
  prevPage: null,
});
