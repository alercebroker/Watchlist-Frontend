import { ITargetData } from "@/app/target/domain/Target.types";

export type TargetsState = {
  loading: boolean;
  targets: ITargetData[];
  error: Error | null;
  count: number;
  nextPage: string | null;
  prevPage: string | null;
  constant: number;
};

export const state = (): TargetsState => ({
  loading: false,
  targets: [] as ITargetData[],
  error: null,
  count: 0,
  nextPage: null,
  prevPage: null,
  constant: 0,
});
