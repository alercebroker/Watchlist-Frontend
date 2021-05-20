import { containerBuilder } from "@/ui/plugins/inversify";
import { TestActions } from "@/shared/http";
import { cid, container, mockTransient, resetContainer } from "inversify-props";
import {
    Callbacks,
    UseCaseInteractor,
  } from "@/shared/usecase/UseCaseInteractor.types";
import { ITargetRepository } from "../../domain/Target.types";
import { MockTargetService } from "../../infrastructure/__tests__/TargetService.mock";

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockTransient<ITargetRepository>(
      cid.TargetService,
      MockTargetService,
  );
});

describe("GetTargets", () => {
  const callbacks: Callbacks = {
    respondWithSuccess: jest.fn(),
    respondWithClientError: jest.fn(),
    respondWithParseError: jest.fn(),
    respondWithServerError: jest.fn(),
  };
  it("should call success callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const use_case = container.get<UseCaseInteractor>(cid.GetTargets);
    await use_case.execute("watchlists/1/targets", callbacks);
    expect(callbacks.respondWithSuccess).toHaveBeenCalledTimes(1);
  });
  it("should call server error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("serverError");
    const use_case = container.get<UseCaseInteractor>(cid.GetTargets);
    await use_case.execute("watchlists/1/targets", callbacks);
    expect(callbacks.respondWithServerError).toHaveBeenCalledTimes(1);
  });
  it("should call client error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("clientError");
    const use_case = container.get<UseCaseInteractor>(cid.GetTargets);
    await use_case.execute("watchlists/1/targets", callbacks);
    expect(callbacks.respondWithClientError).toHaveBeenCalledTimes(1);
  });
  it("should call parse error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("parseError");
    const use_case = container.get<UseCaseInteractor>(cid.GetTargets);
    await use_case.execute("watchlists/1/targets", callbacks);
    expect(callbacks.respondWithParseError).toHaveBeenCalledTimes(1);
  });
});
