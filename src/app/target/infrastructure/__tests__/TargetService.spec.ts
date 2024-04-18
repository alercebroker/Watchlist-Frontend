import { containerBuilder } from "@/ui/app.container";
import {
  HttpError,
  IHttpService,
  MockUserApi,
  TestActions,
} from "@/shared/http";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { ITargetData, ITargetRepository } from "../../domain/Target.types";
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
            filter: {
              fields: {},
              filters: [
                {
                  params: {
                    constant: "11",
                    field: "mag",
                    op: "greater",
                  },
                  type: "constant",
                },
              ],
            },
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
            filter: {
              fields: {},
              filters: [
                {
                  params: {},
                  type: "no filter",
                },
              ],
            },
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
        expect(x).toBeInstanceOf(HttpError);
      });
    });
  });
  describe("Edit Target", () => {
    it("should return result with edited target if server response is successful", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.editTarget({
        target: {
          id: 1,
          name: "target",
          ra: 10,
          dec: 20,
          radius: 30,
        } as ITargetData,
        watchlist: 1,
      });
      expect(result.isOk()).toBeTruthy();
    });
    it("should work if I pass an url", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.editTarget({
        target: {
          id: 1,
          name: "target",
          ra: 10,
          dec: 20,
          radius: 30,
        } as ITargetData,
        watchlist: 1,
        url: "/watchlists/1/targets/1",
      });
      expect(result.isOk()).toBeTruthy();
    });
    it("should return err if http request failed with error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.editTarget({
        target: {
          id: 1,
          name: "target",
          ra: 10,
          dec: 20,
          radius: 30,
        } as ITargetData,
        watchlist: 1,
        url: "/watchlists/1/targets/1",
      });
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if http request failed with timeout", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.editTarget({
        target: {
          id: 1,
          name: "target",
          ra: 10,
          dec: 20,
          radius: 30,
        } as ITargetData,
        watchlist: 1,
        url: "/watchlists/1/targets/1",
      });
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if parse error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.editTarget({
        target: {
          id: 1,
          name: "target",
          ra: 10,
          dec: 20,
          radius: 30,
        } as ITargetData,
        watchlist: 1,
        url: "/watchlists/1/targets/1",
      });
      expect(result.isErr()).toBeTruthy();
      result.mapErr((x) => {
        expect(x).toBeInstanceOf(ParseError);
      });
    });
  });
  describe("Create Target", () => {
    it("should return result with created target if server response is successful", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.createTarget({
        target: {
          id: 1,
          name: "target",
          ra: 10,
          dec: 20,
          radius: 30,
        } as ITargetData,
        watchlist: 1,
      });
      expect(result.isOk()).toBeTruthy();
    });
    it("should return err if http request failed with error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.createTarget({
        target: {
          id: 1,
          name: "target",
          ra: 10,
          dec: 20,
          radius: 30,
        } as ITargetData,
        watchlist: 1,
      });
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if http request failed with timeout", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.createTarget({
        target: {
          id: 1,
          name: "target",
          ra: 10,
          dec: 20,
          radius: 30,
        } as ITargetData,
        watchlist: 1,
      });
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if parse error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.createTarget({
        target: {
          id: 1,
          name: "target",
          ra: 10,
          dec: 20,
          radius: 30,
          filter: {
            fields: {},
            filters: [
              {
                params: {},
                type: "no filter",
              },
            ],
          },
        } as ITargetData,
        watchlist: 1,
      });
      expect(result.isErr()).toBeTruthy();
      result.mapErr((x) => {
        expect(x).toBeInstanceOf(ParseError);
      });
    });
  });
  describe("Delete Target", () => {
    it("should return ok result with server response is successful", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.deleteTarget({
        target: 1,
        watchlist: 1,
      });
      expect(result.isOk()).toBeTruthy();
      result.map((val) => {
        expect(val).toBe(1);
      });
    });
    it("should return err if http request failed with error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.deleteTarget({
        target: 1,
        watchlist: 1,
      });
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if http request failed with timeout", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.deleteTarget({
        target: 1,
        watchlist: 1,
      });
      expect(result.isErr()).toBeTruthy();
    });
  });
  describe("Bulk Update Targets", () => {
    it("should return ok result with server response is successful", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.bulkUpdateTargets({
        targetsList: [],
        watchlistId: 1,
      });
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
            filter: {
              fields: {},
              filters: [
                {
                  params: {
                    constant: "11",
                    field: "mag",
                    op: "greater",
                  },
                  type: "constant",
                },
              ],
            },
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
            filter: {
              fields: {},
              filters: [
                {
                  params: {},
                  type: "no filter",
                },
              ],
            },
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
      const result = await targetService.bulkUpdateTargets({
        targetsList: [],
        watchlistId: 1,
      });
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if http request failed with timeout", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.bulkUpdateTargets({
        targetsList: [],
        watchlistId: 1,
      });
      expect(result.isErr()).toBeTruthy();
    });
    it("should return err if parse error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const targetService = container.get<ITargetRepository>(cid.TargetService);
      const result = await targetService.bulkUpdateTargets({
        targetsList: [],
        watchlistId: 1,
      });
      expect(result.isErr()).toBeTruthy();
      result.mapErr((x) => {
        expect(x).toBeInstanceOf(HttpError);
      });
    });
  });
});
