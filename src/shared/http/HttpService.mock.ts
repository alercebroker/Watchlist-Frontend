import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { inject } from "inversify-props";
import { IAxiosCreator } from ".";
import { mockRegisterUser } from "./mocks/user.mocks";
import { mockApiWatchlists } from "./mocks/watchlist.mocks";

export type TestActions =
  | "ok"
  | "error"
  | "timeout"
  | "parseError"
  | "clientError"
  | "serverError";

export class MockAxiosCreator implements IAxiosCreator {
  mock!: MockAdapter;
  actionType: TestActions;
  constructor(@inject("ActionType") actionType: TestActions) {
    this.actionType = actionType;
  }

  createAxiosInstance(_baseUrl: string): AxiosInstance {
    const instance = axios.create({ baseURL: _baseUrl });
    this.mock = new MockAdapter(instance);
    if (this.actionType === "ok") this.setMockActions();
    if (this.actionType === "error") this.setErrorActions();
    if (this.actionType === "timeout") this.setTimeoutActions();
    return instance;
  }

  setMockActions() {
    this.mock.onGet("/watchlist").reply((_config: any) => {
      const response = mockApiWatchlists;
      return [200, JSON.stringify(response)];
    });
    this.mock.onPost("/users").reply((_config: any) => {
      const response = mockRegisterUser;
      return [201, JSON.stringify(response)];
    });
  }
  setErrorActions() {
    this.mock.onGet("/watchlist").networkError();
    this.mock.onPost("/users").networkError();
  }
  setTimeoutActions() {
    this.mock.onGet("/watchlist").timeout();
    this.mock.onPost("/users").timeout();
  }
}
