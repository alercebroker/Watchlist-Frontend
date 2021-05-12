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

export function containerBuilder() {
  container.addTransient<IAxiosCreator>(AxiosCreator);
  container.addTransient<IHttpService>(HttpService);
  container.addSingleton<IWatchlistRepository>(WatchlistService);
  container.addTransient<UseCaseInteractor>(GetAllWatchlists);
  container.bind<Modules>("Modules").toConstantValue(modules);
  container.addSingleton<IStoreCreator>(StoreCreator);
}

containerBuilder();
