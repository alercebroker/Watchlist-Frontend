import { containerBuilder } from "@/ui/app.container";
import { IHttpService, MockUserApi, TestActions } from "@/shared/http";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { ITargetRepository } from "../../domain/Target.types";
import { Target } from "../../domain/Target";
import { ParseError } from "@/shared/error/ParseError";

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockSingleton<IHttpService>(cid.UsersApiService, MockUserApi);
});

describe("TargetService", () => {
  describe("Get Target List", () => {
    it("should return ok if http request is successful", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.getAllTargets({ watchlistId: 1 });
      expect(result.isOk()).toBeTruthy();
      const expected = {
        count: 2,
        next: "next",
        prev: "prev",
        targets: [
          new Target({
            id: 1,
            url: "test",
            name: "target",
            radius: 1,
            ra: 10,
            dec: 20,
            nMatches: 5,
            lastMatch: new Date(10, 10, 10).toISOString(),
          }),
          new Target({
            id: 2,
            url: "test2",
            name: "target2",
            radius: 2,
            ra: 20,
            dec: 20,
            nMatches: 2,
            lastMatch: new Date(10, 10, 10).toISOString(),
          }),
        ],
      };
      result.map((res) => {
        expect(res).toStrictEqual(expected);
      });
    });
    it("should return err if http request failed with error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.getAllTargets({ watchlistId: 1 });
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if http request failed with timeout", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.getAllTargets({ watchlistId: 1 });
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if parse error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.getAllTargets({ watchlistId: 1 });
      expect(result.isErr()).toBeTruthy();
      result.mapErr((x) => {
        expect(x).toBeInstanceOf(ParseError);
      });
    });
  });
});
