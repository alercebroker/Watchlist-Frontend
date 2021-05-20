import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { inject } from "inversify-props";
import { IAxiosCreator } from ".";
import { mockTargetsByWatchlist } from "./mocks/target.mocks";
import {
  mockLoginResponse,
  mockRegisterUser,
  mockUsersResponse,
} from "./mocks/user.mocks";
import {
  mockApiWatchlists,
  mockCreateWatchlistResponse,
  mockSingleWatchlist
} from "./mocks/watchlist.mocks";

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
    if (
      this.actionType === "error" ||
      this.actionType === "serverError" ||
      this.actionType === "clientError"
    )
      this.setErrorActions();
    if (this.actionType === "timeout") this.setTimeoutActions();
    if (this.actionType === "parseError") this.setParseErrorActions();
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
        targets: "test",
        n_targets: "test",
        last_match: "test"
        },
      )
      return [201, JSON.stringify(response)]
    })
    this.mock.onGet("/watchlists/123/targets").reply((_config: any) => {
      const response = mockTargetsByWatchlist;
      return [200, JSON.stringify(response)];
    });
    this.mock.onGet("/watchlist/1").reply((_config: any) => {
      const response = mockSingleWatchlist;
      console.log('response httpService', response)
      return [200, JSON.stringify(response)];
    });
  }
  setErrorActions() {
    this.mock.onGet("/watchlist").networkError();
    this.mock.onPost("/users").networkError();
    this.mock.onPost("/users/login").networkError();
    this.mock.onGet("/users").networkError();
    this.mock.onPost("/watchlists").networkError();
    this.mock.onGet("/watchlists/123/targets").networkError();
  }
  setTimeoutActions() {
    this.mock.onGet("/watchlist").timeout();
    this.mock.onPost("/users").timeout();
    this.mock.onPost("/users/login").timeout();
    this.mock.onGet("/users").timeout();
    this.mock.onPost("/watchlists").timeout();
    this.mock.onGet("/watchlists/123/targets").timeout();
  }
  setParseErrorActions() {
    this.mock.onGet("/watchlists/123/targets").reply((_config: any) => {
      const response = {};
      return [200, JSON.stringify(response)];
    });
  }
}
