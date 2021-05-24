import "reflect-metadata";
import { container } from "inversify-props";
import {
  AxiosCreator,
  HttpService,
  IAxiosCreator,
  IHttpService,
} from "@/shared/http";
import { IWatchlistRepository } from "@/app/watchlist/domain";
import { WatchlistService } from "@/app/watchlist/infrastructure/WatchlistService";
import { GetAllWatchlists } from "@/app/watchlist/use_case/GetAllWatchlists";
import { UseCaseInteractor } from "@/shared/usecase/UseCaseInteractor.types";
import { IStoreCreator, StoreCreator } from "../store/StoreCreator";
import { Modules, modules } from "../store/RegisterModules";
import { IUserRepository } from "@/app/user/domain/User.types";
import { AuthService } from "@/app/user/infrastructure/AuthService";
import { RegisterUser } from "@/app/user/use_case/RegisterUser";
import { Login } from "@/app/user/use_case/Login";
import { CreateWatchlist } from "@/app/watchlist/use_case/CreateWatchlist";
import { ITargetRepository } from "@/app/target/domain/Target.types";
import { TargetService } from "@/app/target/infrastructure/TargetService";
import { GetTargets } from "@/app/target/use_case/GetTargets";
import {SelectWatchlist} from "@/app/watchlist/use_case/SelectWatchlist";
import {DeleteWatchlist} from "@/app/watchlist/use_case/DeleteWatchlist";

export function containerBuilder() {
  container.addTransient<IAxiosCreator>(AxiosCreator);
  container.addTransient<IHttpService>(HttpService);
  container.addSingleton<IWatchlistRepository>(WatchlistService);
  container.addTransient<UseCaseInteractor>(GetAllWatchlists);
  container.bind<Modules>("Modules").toConstantValue(modules);
  container.addSingleton<IStoreCreator>(StoreCreator);
  container.addSingleton<IUserRepository>(AuthService);
  container.addTransient<UseCaseInteractor>(RegisterUser);
  container.addTransient<UseCaseInteractor>(Login);
  container.addTransient<UseCaseInteractor>(CreateWatchlist);
  container.addSingleton<ITargetRepository>(TargetService);
  container.addTransient<UseCaseInteractor>(GetTargets);
  container.addTransient<UseCaseInteractor>(SelectWatchlist);
  container.addTransient<UseCaseInteractor>(DeleteWatchlist);
}
