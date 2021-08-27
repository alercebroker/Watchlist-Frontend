import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { inject } from "inversify-props";
import { HttpService } from "./HttpService";
import { mockTargetsByWatchlist } from "./mocks/target.mocks";
import {
  mockLoginResponse,
  mockRegisterUser,
  mockUsersResponse,
} from "./mocks/user.mocks";
import {
  mockApiWatchlists,
  mockCreateWatchlistResponse,
  mockSingleWatchlist,
} from "./mocks/watchlist.mocks";

export type TestActions =
  | "ok"
  | "error"
  | "timeout"
  | "parseError"
  | "clientError"
  | "serverError"
  | "accessTokenExpired";

export class MockUserApi extends HttpService {
  mock!: MockAdapter;
  actionType: TestActions;

  constructor(@inject("ActionType") actionType: TestActions) {
    super(process.env.VUE_APP_USER_API || "test");
    this.mock = new MockAdapter(this.axiosService);
    this.actionType = actionType;
    if (this.actionType === "ok") this.setMockActions();
    if (this.actionType === "error") this.setErrorActions();
    if (this.actionType === "serverError") this.setServerErrorActions();
    if (this.actionType === "clientError") this.setClientErrorActions();
    if (this.actionType === "timeout") this.setTimeoutActions();
    if (this.actionType === "parseError") this.setParseErrorActions();
    if (this.actionType === "accessTokenExpired")
      this.setAccessTokenExpiredActions();
  }

  setMockActions(): void {
    this.mock.onGet("/watchlists/").reply((_config: any) => {
      const response = mockApiWatchlists;
      return [200, JSON.stringify(response)];
    });
    this.mock.onPost("/users/").reply((_config: any) => {
      const response = mockRegisterUser;
      return [201, JSON.stringify(response)];
    });
    this.mock.onPost("/users/login/").reply((_config: any) => {
      const response = mockLoginResponse;
      return [201, JSON.stringify(response)];
    });
    this.mock.onGet("/users/current/").reply((_config: any) => {
      return [200, JSON.stringify(mockUsersResponse)];
    });
    this.mock.onPost("/users/activation/").reply((_config: any) => {
      return [204];
    });
    this.mock.onGet("/users/").reply((_config: any) => {
      const response = mockUsersResponse;
      return [200, JSON.stringify(response)];
    });
    this.mock.onPost("/watchlists/").reply((_config: any) => {
      const response = mockCreateWatchlistResponse;
      return [201, JSON.stringify(response)];
    });
    this.mock.onGet("/watchlists/1/targets").reply((_config: any) => {
      const response = mockTargetsByWatchlist;
      return [200, JSON.stringify(response)];
    });
    this.mock.onGet("/watchlists/1").reply((_config: any) => {
      const response = mockSingleWatchlist;
      return [200, JSON.stringify(response)];
    });
    this.mock.onDelete("/watchlists/1").reply((_config: any) => {
      return [204];
    });
    this.mock.onGet(/\/watchlists\/\w+\/targets\/\w+/).reply((_config: any) => {
      const response = {
        url:
          "https://6k5dhpzcdg.execute-api.us-east-1.amazonaws.com/dev/watchlists/32/targets/103303/",
        id: 103303,
        name: "M-00-103-01-0",
        radius: 0.008055555555555555,
        ra: 0.960746,
        dec: -11.47467,
        matches: [
          {
            object_id: "ZTF18abtmgfn",
            candid: "1643456821815010006",
            date: "2021-07-02T11:05:27.454545Z",
          },
        ],
      };
      return [200, JSON.stringify(response)];
    });
    this.mock.onPut(/\/watchlists\/\w+\/targets\/\w+/).reply((_config: any) => {
      const response = {
        id: 103303,
        name: "M-00-103-01-0",
        radius: 0.008055555555555555,
        ra: 0.960746,
        dec: -11.47467,
      };
      return [200, JSON.stringify(response)];
    });
    this.mock.onPost(/\/watchlists\/\w+\/targets\//).reply(() => {
      const response = {
        id: 103303,
        name: "M-00-103-01-0",
        radius: 0.008055555555555555,
        ra: 0.960746,
        dec: -11.47467,
      };
      return [201, JSON.stringify(response)];
    });
    this.mock.onDelete(/\/watchlists\/\w+\/targets\/\w+/).reply(() => {
      return [204];
    });
    
    this.mock.onPut('watchlists/1').reply(() => {
      const response = {
        url: "watchlists/1",
        id: 1,
        title: "Test1",
        targets: "test",
        n_targets: "test",
        last_match: "test",
        notification_rate: "hourly",
        last_notified: "date"
      };
      return [200, JSON.stringify(response)];
    })
  }

  setErrorActions(): void {
    this.mock.onGet("/watchlists/").networkError();
    this.mock.onPost("/users/").networkError();
    this.mock.onPost("/users/login/").networkError();
    this.mock.onPost("/users/activation/").networkError();
    this.mock.onGet("/users/").networkError();
    this.mock.onPost("/watchlists/").networkError();
    this.mock.onGet("/watchlists/1/targets").networkError();
    this.mock.onGet("/watchlists/1").networkError();
    this.mock.onGet(/\/watchlists\/\w+\/targets\/\w+/).networkError();
    this.mock.onPut(/\/watchlists\/\w+\/targets\/\w+/).networkError();
    this.mock.onPost(/\/watchlists\/\w+\/targets\//).networkError();
    this.mock.onDelete(/\/watchlists\/\w+\/targets\/\w+/).networkError();
  }

  setClientErrorActions(): void {
    this.mock.onPost("/users/login/").reply(401, {
      detail: "No active account found with the given credentials",
    });
    this.mock.onPost("/users").reply(400, {
      username: ["This field may not be blank."],
      password: ["This field may not be blank."],
      name: ["This field may not be blank."],
      last_name: ["This field may not be blank."],
      institution: ["This field may not be blank."],
      role: ["This field may not be blank."],
    });
  }

  setServerErrorActions(): void {
    this.mock.onPost("/users/login/").reply(500);
    this.mock.onPost("/users/").reply(500);
    this.mock.onPost("/users/activation/").reply(500);
  }

  setTimeoutActions(): void {
    this.mock.onGet("/watchlists/").timeout();
    this.mock.onPost("/users/").timeout();
    this.mock.onPost("/users/login/").timeout();
    this.mock.onPost("/users/activation/").networkError();
    this.mock.onGet("/users/").timeout();
    this.mock.onPost("/watchlists/").timeout();
    this.mock.onGet("/watchlists/1/targets").timeout();
    this.mock.onGet("/watchlists/1").timeout();
    this.mock.onGet(/\/watchlists\/\w+\/targets\/\w+/).timeout();
    this.mock.onPut(/\/watchlists\/\w+\/targets\/\w+/).timeout();
    this.mock.onDelete(/\/watchlists\/\w+\/targets\/\w+/).timeout();
    this.mock.onPost(/\/watchlists\/\w+\/targets\//).timeout();
  }

  setParseErrorActions(): void {
    this.mock.onGet("/watchlists/1/targets").reply((_config: any) => {
      const response = {};
      return [200, JSON.stringify(response)];
    });
    this.mock.onPut(/\/watchlists\/\w+\/targets\/\w+/).reply((_config: any) => {
      const response = {};
      return [200, JSON.stringify(response)];
    });
    this.mock.onPost(/\/watchlists\/\w+\/targets\//).reply(() => {
      return [200, JSON.stringify({})];
    });
  }

  setAccessTokenExpiredActions(): void {
    localStorage.setItem("refresh_token", "token");
    this.mock.onPost("/users/refresh/").reply((_config: any) => {
      return [200, JSON.stringify({ access: "access_token" })];
    });
    this.mock
      .onGet("/watchlists/")
      .replyOnce(401)
      .onGet("/watchlists/")
      .reply((_config: any) => {
        return [200, JSON.stringify(mockApiWatchlists)];
      });
  }

  setRefreshTokenExpiredActions(): void {
    this.mock.onGet("/watchlists").reply(401);
  }
}
