import { IMatchData } from "@/app/match/domain/Match.types";
import moment from "moment";
import { GetterTree } from "vuex";
import { IRootState } from "../Store.types";
import { MatchesState } from "./state";

type Getters = {
  formattedUTCMatches(state: MatchesState): IMatchData[];
  formattedMJDMatches(state: MatchesState): IMatchData[];
};

export const getters: GetterTree<MatchesState, IRootState> & Getters = {
  formattedUTCMatches: (state) => {
    return state.matches.map((match) => {
      return {
        object_id: match.object_id,
        date: moment.utc(match.date).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        candid: match.candid,
      };
    });
  },
  formattedMJDMatches: (state) => {
    const gregToMjd = (date: string) => {
      const utcdate = moment.utc(date).toDate();
      const mjulianDate = utcdate.getTime() / 86400000 + 40587;
      return mjulianDate.toString();
    };
    return state.matches.map((match) => {
      return {
        object_id: match.object_id,
        date: gregToMjd(match.date),
        candid: match.candid,
      };
    });
  },
};
