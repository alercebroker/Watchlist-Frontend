import { containerBuilder } from "@/ui/app.container";
import { HttpService, MockUserApi, TestActions } from "@/shared/http";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { WatchlistService } from "../WatchlistService";
import { Watchlist } from "../../domain";
import { CreateWatchlistRequestModel, EditWatchlistRequestModel } from "../WatchlistService.types";

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockSingleton<HttpService>(cid.UsersApiService, MockUserApi);
});

describe("WatchlistService", () => {
  describe("GetAllWatchlists", () => {
    it("should return list of watchlists", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.getAllWatchlists();
      expect(result.isOk()).toBeTruthy();
      const expected = [
        new Watchlist({
          id: 1,
          owner: "owner",
          title: "Test1",
          notificationRate: "hourly",
          lastNotified: "date",
          targets: "test",
          nTargets: "test",
          url: "watchlists/1",
          lastMatch: "test",
        }),
        new Watchlist({
          id: 2,
          owner: "owner",
          title: "Test2",
          notificationRate: "hourly",
          lastNotified: "date",
          targets: "test",
          nTargets: "test",
          url: "watchlists/2",
          lastMatch: "test",
        }),
      ];
      result.map((watchlists) => {
        expect(watchlists.watchlists).toStrictEqual(expected);
      });
    });
    it("should return errored result", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.getAllWatchlists();
      expect(result.isOk()).toBeFalsy();
    });
    it("should return errored result on timeout", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.getAllWatchlists();
      expect(result.isOk()).toBeFalsy();
    });
    it("should return list of watchlist if access token expired", async () => {
      container
        .bind<TestActions>("ActionType")
        .toConstantValue("accessTokenExpired");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.getAllWatchlists();
      expect(result.isOk()).toBeTruthy();
      const expected = [
        new Watchlist({
          id: 1,
          owner: "owner",
          title: "Test1",
          notificationRate: "hourly",
          lastNotified: "date",
          targets: "test",
          nTargets: "test",
          url: "watchlists/1",
          lastMatch: "test",
        }),
        new Watchlist({
          id: 2,
          owner: "owner",
          title: "Test2",
          notificationRate: "hourly",
          lastNotified: "date",
          targets: "test",
          nTargets: "test",
          url: "watchlists/2",
          lastMatch: "test",
        }),
      ];
      result.map((watchlists) => {
        expect(watchlists.watchlists).toStrictEqual(expected);
      });
    });
  });

  describe("CreateWatchlist", () => {
    it("should return list of watchlists", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const request: CreateWatchlistRequestModel = {
        title: "Test3",
        notification_rate: "hourly",
        targets: [
          {
            name: "target",
            radius: 1.0,
            ra: 1.0,
            dec: 1.0,
          },
        ],
      };
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.createWatchlist(request);
      expect(result.isOk()).toBeTruthy();
      const expected = [
        new Watchlist({
          id: 1,
          owner: "owner",
          title: "Test1",
          notificationRate: "hourly",
          lastNotified: "date",
          targets: "test",
          nTargets: "test",
          url: "watchlists/1",
          lastMatch: "test",
        }),
        new Watchlist({
          id: 2,
          owner: "owner",
          title: "Test2",
          targets: "test",
          notificationRate: "hourly",
          lastNotified: "date",
          nTargets: "test",
          url: "watchlists/2",
          lastMatch: "test",
        }),
      ];
      result.map((watchlists) => {
        expect(watchlists.watchlists).toStrictEqual(expected);
      });
    });
    it("should return server error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const request: CreateWatchlistRequestModel = {
        title: "Test3",
        notification_rate: "hourly",
        targets: [
          {
            name: "target",
            radius: 1.0,
            ra: 1.0,
            dec: 1.0,
          },
        ],
      };
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.createWatchlist(request);
      expect(result.isErr()).toBeTruthy();
      result.mapErr((error) => {
        expect(error.message).toEqual("Network Error");
      });
    });
    it("should return timeout error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const request: CreateWatchlistRequestModel = {
        title: "Test3",
        notification_rate: "hourly",
        targets: [
          {
            name: "target",
            radius: 1.0,
            ra: 1.0,
            dec: 1.0,
          },
        ],
      };
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.createWatchlist(request);
      expect(result.isErr()).toBeTruthy();
      result.mapErr((error) => {
        expect(error.message).toContain("timeout");
      });
    });
  });

  describe("GetOneWatchlist", () => {
    it("should return onewatchlists", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.getOneWatchlist("watchlists/1");
      expect(result.isOk()).toBeTruthy();
      const expected = new Watchlist({
        id: 1,
        owner: "owner",
        title: "title",
        notificationRate: "hourly",
        lastNotified: "date",
        targets: "watchlists/1/targets",
        nTargets: "test",
        url: "watchlists/1",
        lastMatch: "test",
      });
      result.map((watchlist) => {
        expect(watchlist).toStrictEqual(expected);
      });
    }),
      it("should return errored result", async () => {
        container.bind<TestActions>("ActionType").toConstantValue("error");
        const httpService = container.get<HttpService>(cid.UsersApiService);
        const service = new WatchlistService(httpService);
        const result = await service.getOneWatchlist("watchlists/1");
        expect(result.isOk()).toBeFalsy();
      });
    it("should return errored result", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.getOneWatchlist("watchlists/1");
      expect(result.isOk()).toBeFalsy();
    });
  });

  describe("DeleteWatchlist", () => {
    it("should return list of watchlists", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.deleteWatchlist("watchlists/1");
      expect(result.isOk()).toBeTruthy();
      const expected = [
        new Watchlist({
          id: 1,
          owner: "owner",
          title: "Test1",
          notificationRate: "hourly",
          lastNotified: "date",
          targets: "test",
          nTargets: "test",
          url: "watchlists/1",
          lastMatch: "test",
        }),
        new Watchlist({
          id: 2,
          owner: "owner",
          title: "Test2",
          notificationRate: "hourly",
          lastNotified: "date",
          targets: "test",
          nTargets: "test",
          url: "watchlists/2",
          lastMatch: "test",
        }),
      ];
      result.map((watchlists) => {
        expect(watchlists.watchlists).toStrictEqual(expected);
      });
    });

    it("should return errored result", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.deleteWatchlist("watchlists/1");
      expect(result.isOk()).toBeFalsy();
    });

    it("should return errored result", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.deleteWatchlist("watchlists/1");
      expect(result.isOk()).toBeFalsy();
    });
  });

  describe("EditWatchlist", () => {
    it("should return watchlists", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const params = {
        params: {
          title: "watchlist 1",
          notification_rate: "hourly"
        },
        watchlist: 1,
      }
      const result = await service.editWatchlist(params);
      console.log(result);
      expect(result.isOk()).toBeTruthy();
      const expected = 
        new Watchlist({
          id: 1,
          owner: "owner",
          title: "Test1",
          notificationRate: "hourly",
          lastNotified: "date",
          targets: "test",
          nTargets: "test",
          url: "watchlists/1",
          lastMatch: "test",
        });
      result.map((watchlists) => {
        expect(watchlists).toStrictEqual(expected);
      });
    });

    it("should return errored result", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.deleteWatchlist("watchlists/1");
      expect(result.isOk()).toBeFalsy();
    });

    it("should return errored result", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const httpService = container.get<HttpService>(cid.UsersApiService);
      const service = new WatchlistService(httpService);
      const result = await service.deleteWatchlist("watchlists/1");
      expect(result.isOk()).toBeFalsy();
    });
  });
});
