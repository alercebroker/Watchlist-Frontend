import { containerBuilder } from "@/ui/plugins/inversify";
import {
  IAxiosCreator,
  IHttpService,
  MockAxiosCreator,
  TestActions,
} from "@/shared/http";
import { cid, container, mockTransient, resetContainer } from "inversify-props";
import { WatchlistService } from "../WatchlistService";
import { Watchlist } from "../../domain";
import { CreateWatchlistRequestModel } from "../WatchlistService.types";

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockTransient<IAxiosCreator>(cid.AxiosCreator, MockAxiosCreator);
});

describe("WatchlistService", () => {
  describe("GetAllWatchlists", () => {
    it("should return list of watchlists", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const httpService = container.get<IHttpService>(cid.HttpService);
      const service = new WatchlistService(httpService);
      const result = await service.getAllWatchlists();
      expect(result.isOk()).toBeTruthy();
      const expected = [
        new Watchlist({ owner: "owner", title: "Test1", targets: "test" }),
        new Watchlist({ owner: "owner", title: "Test2", targets: "test" }),
      ];
      result.map((watchlists) => {
        expect(watchlists).toStrictEqual(expected);
      });
    }),
    it("should return errored result", async () => {
        container.bind<TestActions>("ActionType").toConstantValue("error");
        const httpService = container.get<IHttpService>(cid.HttpService);
        const service = new WatchlistService(httpService);
        const result = await service.getAllWatchlists();
        expect(result.isOk()).toBeFalsy();
    });
    it("should return errored result", async () => {
        container.bind<TestActions>("ActionType").toConstantValue("timeout");
        const httpService = container.get<IHttpService>(cid.HttpService);
        const service = new WatchlistService(httpService);
        const result = await service.getAllWatchlists();
        expect(result.isOk()).toBeFalsy();
    });
  });

  describe("CreateWatchlist", () => {
    it("should return list of watchlists", async () => {
        container.bind<TestActions>("ActionType").toConstantValue("ok");
        const request: CreateWatchlistRequestModel = {
            title: "Test3",
            targets: [
                {
                  name: "target",
                  radius: 1.0,
                  ra: 1.0,
                  dec: 1.0
                }]
        };
        const httpService = container.get<IHttpService>(cid.HttpService);
        const service = new WatchlistService(httpService);
        const result = await service.createWatchlist(request);
        expect(result.isOk()).toBeTruthy();
        const expected = [
            new Watchlist({ owner: "owner", title: "Test1", targets: "test" }),
            new Watchlist({ owner: "owner", title: "Test2", targets: "test" }),
            new Watchlist({ owner: "owner", title: "Test3", targets: "test" })
        ]
        // console.log(result)
        result.map(watchlists => {
            expect(watchlists).toStrictEqual(expected)
        })
    });
    it("should return server error", async () => {
        container.bind<TestActions>("ActionType").toConstantValue("error");
        const request: CreateWatchlistRequestModel = {
            title: "Test3",
            targets: [
                {
                    name: "target",
                    radius: 1.0,
                    ra: 1.0,
                    dec: 1.0
                }
            ]
        };
        const httpService = container.get<IHttpService>(cid.HttpService);
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
            targets: [
                {
                    name: "target",
                    radius: 1.0,
                    ra: 1.0,
                    dec: 1.0
                }
            ]
        };
        const httpService = container.get<IHttpService>(cid.HttpService);
        const service = new WatchlistService(httpService);
        const result = await service.createWatchlist(request);
        expect(result.isErr()).toBeTruthy();
        result.mapErr((error) => {
          expect(error.message).toContain("timeout");
        });
    });
  });
});

