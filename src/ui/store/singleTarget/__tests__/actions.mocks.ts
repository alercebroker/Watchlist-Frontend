import { ActionTree } from "vuex";
import { IRootState } from "../../Store.types";
import { ActionTypes } from "../actions";
import { SingleTargetState } from "../state";

export const mockActions = (): ActionTree<IRootState, SingleTargetState> => ({
  [ActionTypes.selectTarget]: jest.fn(),
});
