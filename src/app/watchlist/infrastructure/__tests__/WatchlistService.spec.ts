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
    });
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
});
