import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { inject } from "inversify-props";
import { IAxiosCreator } from ".";
import {
  mockLoginResponse,
  mockRegisterUser,
  mockUsersResponse,
} from "./mocks/user.mocks";
import { mockApiWatchlists, mockCreateWatchlistResponse } from "./mocks/watchlist.mocks";

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
    this.mock.onPost("/users/login").reply((_config: any) => {
      const response = mockLoginResponse;
      return [201, JSON.stringify(response)];
    });
    this.mock.onGet("/users").reply((_config: any) => {
      const response = mockUsersResponse;
      return [200, JSON.stringify(response)];
    });
    this.mock.onPost("/watchlists").reply((_config: any) => {

      const watchlistJSON = JSON.parse(_config.data);
      const response = mockCreateWatchlistResponse;
      mockApiWatchlists.results.push(
        {
        url: "watchlist/3",
        title: watchlistJSON.title,
        targets: "watchlist/3/targets",
        },
      )
      return [201, JSON.stringify(response)]
    })
  }
  setErrorActions() {
    this.mock.onGet("/watchlist").networkError();
    this.mock.onPost("/users").networkError();
    this.mock.onPost("/users/login").networkError();
    this.mock.onGet("/users").networkError();
    this.mock.onPost("/watchlists").networkError();
  }
  setTimeoutActions() {
    this.mock.onGet("/watchlist").timeout();
    this.mock.onPost("/users").timeout();
    this.mock.onPost("/users/login").timeout();
    this.mock.onGet("/users").timeout();
    this.mock.onPost("/watchlists").timeout();
  }
}
