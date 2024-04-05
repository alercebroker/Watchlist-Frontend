import { ITargetData } from "@/app/target/domain/Target.types";

export type TargetsState = {
  loading: boolean;
  targets: ITargetData[];
  error: Error | null;
  count: number;
  nextPage: string | null;
  prevPage: string | null;
  mag_value: number | null;
};

export const state = (): TargetsState => ({
  loading: false,
  targets: [] as ITargetData[],
  error: null,
  count: 0,
  nextPage: null,
  prevPage: null,
  mag_value: 0,
});
