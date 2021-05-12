import { inject } from "inversify-props";
import { Store } from "vuex";
import { Modules } from "./RegisterModules";
import { IRootState } from "./Store.types";

export interface IStoreCreator {
  create(): Store<IRootState>;
}

export class StoreCreator implements IStoreCreator {
  private modules: Modules;

  constructor(@inject("Modules") modules: Modules) {
    this.modules = modules;
  }

  create(): Store<IRootState> {
    return new Store(this.modules);
  }
}
