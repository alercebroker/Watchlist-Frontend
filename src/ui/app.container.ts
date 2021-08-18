import "reflect-metadata";
// import { cid, container, mockSingleton } from "inversify-props";
// import { IHttpService, TestActions } from "@/shared/http";
import { container } from "inversify-props";
import { IHttpService } from "@/shared/http";
import { IWatchlistRepository } from "@/app/watchlist/domain";
import { WatchlistService } from "@/app/watchlist/infrastructure/WatchlistService";
import { GetAllWatchlists } from "@/app/watchlist/use_case/GetAllWatchlists";
import { UseCaseInteractor } from "@/shared/usecase/UseCaseInteractor.types";
import { IUserRepository } from "@/app/user/domain/User.types";
import { AuthService } from "@/app/user/infrastructure/AuthService";
import { RegisterUser } from "@/app/user/use_case/RegisterUser";
import { Login } from "@/app/user/use_case/Login";
import { CreateWatchlist } from "@/app/watchlist/use_case/CreateWatchlist";
import { ITargetRepository } from "@/app/target/domain/Target.types";
import { TargetService } from "@/app/target/infrastructure/TargetService";
import { GetTargets } from "@/app/target/use_case/GetTargets";
import { BulkUpdateTargets } from "@/app/target/use_case/BulkUpdateTargets";
import { SelectWatchlist } from "@/app/watchlist/use_case/SelectWatchlist";
import { DeleteWatchlist } from "@/app/watchlist/use_case/DeleteWatchlist";
import { Logout } from "@/app/user/use_case/Logout";
import { IMatchRepository } from "@/app/match/domain/Match.types";
import { MatchService } from "@/app/match/infrastructure/MatchService";
import { GetMatches } from "@/app/match/use_case/GetMatches";
import { UsersApiService } from "@/shared/http/UsersApiService";
import { modules, Modules } from "./store/RegisterModules";
import { IStoreCreator, StoreCreator } from "./store/StoreCreator";
import { Activate } from "@/app/user/use_case/Activate";
import { EditTarget } from "@/app/target/use_case/EditTarget";
import { CreateTarget } from "@/app/target/use_case/CreateTarget";
// import { MockTargetService } from "@/app/target/infrastructure/__tests__/TargetService.mock";
import { DeleteTarget } from "@/app/target/use_case/DeleteTarget";

export function containerBuilder(): void {
  container.addSingleton<IHttpService>(UsersApiService);
  container.addSingleton<IUserRepository>(AuthService);
  container.addSingleton<UseCaseInteractor>(RegisterUser);
  container.addSingleton<UseCaseInteractor>(Login);
  container.addSingleton<UseCaseInteractor>(Logout);
  container.addSingleton<IWatchlistRepository>(WatchlistService);
  container.addSingleton<UseCaseInteractor>(GetAllWatchlists);
  container.addSingleton<UseCaseInteractor>(CreateWatchlist);
  container.addSingleton<UseCaseInteractor>(SelectWatchlist);
  container.addSingleton<UseCaseInteractor>(DeleteWatchlist);
  container.addSingleton<ITargetRepository>(TargetService);
  container.addSingleton<UseCaseInteractor>(GetTargets);
  container.addSingleton<UseCaseInteractor>(EditTarget);
  container.addSingleton<UseCaseInteractor>(CreateTarget);
  container.addSingleton<UseCaseInteractor>(DeleteTarget);
  container.addSingleton<UseCaseInteractor>(BulkUpdateTargets);
  container.addSingleton<UseCaseInteractor>(DeleteWatchlist);
  container.addSingleton<IMatchRepository>(MatchService);
  container.addSingleton<UseCaseInteractor>(GetMatches);
  container.addSingleton<UseCaseInteractor>(Activate);
  container.bind<Modules>("Modules").toConstantValue(modules);
  container.addSingleton<IStoreCreator>(StoreCreator);

  // container.bind<TestActions>("ActionType").toConstantValue("clientError");
  // mockSingleton<ITargetRepository>(cid.TargetService, MockTargetService);
}
