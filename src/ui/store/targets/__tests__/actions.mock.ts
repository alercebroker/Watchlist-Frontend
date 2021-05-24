import { ActionTree } from "vuex";
import { IRootState } from "../../Store.types";
import { ActionTypes } from "../actions";
import { TargetsState } from "../state";

export const mockActions: ActionTree<IRootState, TargetsState> = {
    [ActionTypes.getTargets]: jest.fn(),
}