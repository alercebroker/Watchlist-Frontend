import { containerBuilder } from "@/ui/app.container";
import { TestActions } from "@/shared/http";
import { cid, container, mockTransient, resetContainer } from "inversify-props";
import { IWatchlistRepository } from "../../domain";
import { MockWatchlistService } from "../../infrastructure/__tests__/WatchlistService.mock";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockTransient<IWatchlistRepository>(
    cid.WatchlistService,
    MockWatchlistService
  );
});

describe("GetAllWatchlists", () => {
  const callbacks: Callbacks = {
    respondWithSuccess: jest.fn(),
    respondWithClientError: jest.fn(),
    respondWithParseError: jest.fn(),
    respondWithServerError: jest.fn(),
  };
  it("should call success callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const use_case = container.get<UseCaseInteractor>(cid.GetAllWatchlists);
    await use_case.execute({}, callbacks);
    expect(callbacks.respondWithSuccess).toHaveBeenCalledTimes(1);
  });
  it("should call server error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("serverError");
    const use_case = container.get<UseCaseInteractor>(cid.GetAllWatchlists);
    await use_case.execute({}, callbacks);
    expect(callbacks.respondWithServerError).toHaveBeenCalledTimes(1);
  });
  it("should call client error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("clientError");
    const use_case = container.get<UseCaseInteractor>(cid.GetAllWatchlists);
    await use_case.execute({}, callbacks);
    expect(callbacks.respondWithClientError).toHaveBeenCalledTimes(1);
  });
  it("should call parse error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("parseError");
    const use_case = container.get<UseCaseInteractor>(cid.GetAllWatchlists);
    await use_case.execute({}, callbacks);
    expect(callbacks.respondWithParseError).toHaveBeenCalledTimes(1);
  });
});
