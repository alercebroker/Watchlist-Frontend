import { TestActions } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { containerBuilder } from "@/ui/plugins/inversify";
import { cid, container, mockTransient, resetContainer } from "inversify-props";
import { IUserRepository } from "../../domain/User.types";
import {
  MockAuthService,
  mockRegisterApiRequest,
} from "../../infrastructure/__tests__/AuthService.mock";

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockTransient<IUserRepository>(cid.AuthService, MockAuthService);
});

describe("RegisterUserUseCase", () => {
  const callbacks: Callbacks = {
    respondWithSuccess: jest.fn(),
    respondWithClientError: jest.fn(),
    respondWithParseError: jest.fn(),
    respondWithServerError: jest.fn(),
  };
  it("should call success callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const use_case = container.get<UseCaseInteractor>(cid.RegisterUser);
    await use_case.execute(mockRegisterApiRequest, callbacks);
    expect(callbacks.respondWithSuccess).toHaveBeenCalledTimes(1);
  });
  it("should call server error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("serverError");
    const use_case = container.get<UseCaseInteractor>(cid.RegisterUser);
    await use_case.execute(mockRegisterApiRequest, callbacks);
    expect(callbacks.respondWithServerError).toHaveBeenCalledTimes(1);
  });
  it("should call client error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("clientError");
    const use_case = container.get<UseCaseInteractor>(cid.RegisterUser);
    await use_case.execute(mockRegisterApiRequest, callbacks);
    expect(callbacks.respondWithClientError).toHaveBeenCalledTimes(1);
  });
  it("should call parse error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("parseError");
    const use_case = container.get<UseCaseInteractor>(cid.RegisterUser);
    await use_case.execute(mockRegisterApiRequest, callbacks);
    expect(callbacks.respondWithParseError).toHaveBeenCalledTimes(1);
  });
});
