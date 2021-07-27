import { containerBuilder } from "@/ui/app.container";
import { HttpError, MockUserApi, TestActions } from "@/shared/http";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { Match } from "../../domain/Match";
import { IMatchRepository } from "../../domain/Match.types";

beforeAll(() => {
  resetContainer();
  containerBuilder();
  mockSingleton(cid.UsersApiService, MockUserApi);
});
describe("MatchService", () => {
  describe("getMatchesFromUrl", () => {
    it("should return matches when request is successful", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const matchService = container.get<IMatchRepository>(cid.MatchService);
      const result = await matchService.getMatchesFromUrl(
        "/watchlists/1/targets/1"
      );
      expect(result.isOk()).toBeTruthy();
      const expected = [
        new Match({
          object_id: "ZTF18abtmgfn",
          candid: "1643456821815010006",
          date: "2021-07-02T11:05:27.454545Z",
        }),
      ];
      result.map((matchList) => {
        expect(matchList).toStrictEqual(expected);
      });
    });
    it("should return client error when request fails with client error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const matchService = container.get<IMatchRepository>(cid.MatchService);
      const result = await matchService.getMatchesFromUrl(
        "/watchlist/1/targets/1"
      );
      expect(result.isErr()).toBeTruthy();
      result.mapErr((err) => {
        expect(err).toBeInstanceOf(HttpError);
      });
    });
    it("should return server error when request fails with server error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const matchService = container.get<IMatchRepository>(cid.MatchService);
      const result = await matchService.getMatchesFromUrl(
        "/watchlist/1/targets/1"
      );
      expect(result.isErr()).toBeTruthy();
      result.mapErr((err) => {
        expect(err).toBeInstanceOf(HttpError);
      });
    });
    it("should return error when request fails with timeout", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const matchService = container.get<IMatchRepository>(cid.MatchService);
      const result = await matchService.getMatchesFromUrl(
        "/watchlist/1/targets/1"
      );
      expect(result.isErr()).toBeTruthy();
      result.mapErr((err) => {
        expect(err).toBeInstanceOf(HttpError);
      });
    });
  });
});
