import { ActionTree } from "vuex";
import { IRootState } from "../../Store.types";
import { ActionTypes } from "../actions";
import { TargetsState } from "../state";

export const mockActions = (): ActionTree<IRootState, TargetsState> => ({
  [ActionTypes.getTargets]: jest.fn(),
  [ActionTypes.deleteTarget]: jest.fn(),
  [ActionTypes.editTarget]: jest.fn(),
  [ActionTypes.createTarget]: jest.fn(),
});
