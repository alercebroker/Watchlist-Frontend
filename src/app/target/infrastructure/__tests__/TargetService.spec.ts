import { containerBuilder } from "@/ui/plugins/inversify";
import {
  IAxiosCreator,
  IHttpService,
  MockAxiosCreator,
  TestActions,
} from "@/shared/http";
import { cid, container, mockTransient, resetContainer } from "inversify-props";
import { ITargetRepository } from "../../domain/Target.types";
import { Target } from "../../domain/Target";
import { ParseError } from "@/shared/error/ParseError";

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockTransient<IAxiosCreator>(cid.AxiosCreator, MockAxiosCreator);
});

describe("TargetService", () => {
  describe("Get Target List", () => {
    it("should return ok if http request is successful", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.getAllTargets(1);
      expect(result.isOk()).toBeTruthy();
      const expected = [
        new Target({ name: "target", radius: 1, ra: 10, dec: 20, nMatches: 5 }),
      ];
      result.map((res) => {
        expect(res).toStrictEqual(expected);
      });
    });
    it("should return err if http request failed with error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.getAllTargets(1);
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if http request failed with timeout", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.getAllTargets(1);
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if parse error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.getAllTargets(1);
      expect(result.isErr()).toBeTruthy();
      result.mapErr((x) => {
        expect(x).toBeInstanceOf(ParseError);
      });
    });
  });
});
