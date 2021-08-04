import { IUserData } from "@/app/user/domain/User.types";
import {
  ActivateUserApiRequestModel,
  LoginUserApiRequestModel,
  RegisterUserRequestModel,
} from "@/app/user/infrastructure/AuthService.types";
import { Login } from "@/app/user/use_case/Login";
import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { cid, container } from "inversify-props";
import { ActionTree } from "vuex";
import { IRootState } from "../Store.types";
import { MutationTypes } from "./mutations";
import { UserState } from "./state";

export enum ActionTypes {
  activate = "activate",
  registerUser = "registerUser",
  login = "login",
  logout = "logout",
}

export interface ActivateInput {
  uid: string;
  token: string;
}

export interface LoginInput {
  username: "";
  password: "";
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  institution: string;
  role: string;
}

function throwExpression(errorMessage: string) {
  throw new Error(errorMessage);
}

export const actions: ActionTree<UserState, IRootState> = {
  async [ActionTypes.registerUser]({ commit }, userInput: RegisterInput) {
    const registerUser = container.get<UseCaseInteractor>(cid.RegisterUser);
    commit(MutationTypes.SET_LOADING, true);
    const callbacks: Callbacks = {
      respondWithSuccess: (userData: IUserData) => {
        commit(MutationTypes.SET_USER_DATA, userData);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_USER_DATA, {} as IUserData);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_USER_DATA, {} as IUserData);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_USER_DATA, {} as IUserData);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
    };
    try {
      const requestModel: RegisterUserRequestModel = {
        username: userInput.username ?? throwExpression("username required"),
        password: userInput.password ?? throwExpression("password required"),
        email: userInput.email ?? throwExpression("email required"),
        name: userInput.name ?? throwExpression("name required"),
        last_name: userInput.lastName ?? throwExpression("lastName required"),
        institution: userInput.institution,
        role: userInput.role,
      };
      registerUser.execute(requestModel, callbacks);
    } catch (error) {
      commit(MutationTypes.SET_USER_DATA, {} as IUserData);
      commit(MutationTypes.SET_ERROR, error.message);
      commit(MutationTypes.SET_LOADING, false);
    }
  },
  async [ActionTypes.login]({ commit }, userInput: LoginInput) {
    const login = container.get<Login>(cid.Login);
    const callbacks: Callbacks = {
      respondWithSuccess: (userData: IUserData) => {
        commit(MutationTypes.SET_USER_DATA, userData);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_USER_DATA, {} as IUserData);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_USER_DATA, {} as IUserData);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_USER_DATA, {} as IUserData);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
    };
    commit(MutationTypes.SET_LOADING, true);
    try {
      const requestModel: LoginUserApiRequestModel = {
        username: userInput.username ?? throwExpression("username required"),
        password: userInput.password ?? throwExpression("password required"),
      };
      login.execute(requestModel, callbacks);
    } catch (error) {
      commit(MutationTypes.SET_USER_DATA, {});
      commit(MutationTypes.SET_ERROR, error.message);
      commit(MutationTypes.SET_LOADING, false);
    }
  },
  async [ActionTypes.logout]({ commit }) {
    const logout = container.get<UseCaseInteractor>(cid.Logout);
    logout.execute(null, {
      respondWithSuccess: (userData) => {
        commit(MutationTypes.SET_USER_DATA, userData);
        commit(MutationTypes.SET_ERROR, false);
      },
      respondWithAppError: (error) => {
        commit(MutationTypes.SET_USER_DATA, {});
        commit(MutationTypes.SET_ERROR, error);
      },
    } as Callbacks);
  },
  async [ActionTypes.activate]({ commit }, activateInput: ActivateInput) {
    const activateUser = container.get<UseCaseInteractor>(cid.Activate);
    const callbacks: Callbacks = {
      respondWithSuccess: () => {
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_LOADING, false);
      },
    };
    try {
      const requestModel: ActivateUserApiRequestModel = {
        uid: activateInput.uid ?? throwExpression("uid required"),
        token: activateInput.token ?? throwExpression("token required"),
      };
      activateUser.execute(requestModel, callbacks);
    } catch (error) {
      commit(MutationTypes.SET_ERROR, error.message);
      commit(MutationTypes.SET_LOADING, false);
    }
  },
};
