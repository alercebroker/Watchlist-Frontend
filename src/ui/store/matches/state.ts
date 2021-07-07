import { IMatchData } from "@/app/match/domain/Match.types";

export type MatchesState = {
  error: string | null;
  loading: boolean;
  matches: IMatchData[];
};

export const state = () => ({
    error: null,
    loading: false,
    matches: []
});
