import { containerBuilder } from "@/ui/app.container";
import { IStoreCreator, StoreCreator } from "@/ui/store/StoreCreator";
import { createLocalVue, mount } from "@vue/test-utils";
import { cid, container, resetContainer } from "inversify-props";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex, { Store } from "vuex";
import TargetList from "@/ui/components/watchlist/TargetList.vue";
import flushPromises from "flush-promises";
import { Modules } from "@/ui/store/RegisterModules";
import { IRootState } from "@/ui/store/Store.types";
import { ActionTypes } from "@/ui/store/targets/actions";
import { getters } from "@/ui/store/targets/getters";
import { mockActions } from "@/ui/store/targets/__tests__/actions.mock";

const modules = (): Modules => ({
  modules: {
    singleWatchlist: {
      namespaced: true,
      actions: {},
      mutations: {},
      state: {
        id: 1,
      },
      getters: {},
    },
    targets: {
      namespaced: true,
      actions: mockActions(),
      mutations: {},
      state: {
        targets: [
          {
            id: 1,
            name: "test",
            ra: 1,
            dec: 2,
            radius: 3,
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
          },
        ],
      },
      getters: getters,
    },
  },
});

describe("List Targets", () => {
  containerBuilder();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  let store: Store<IRootState>;

  beforeEach(() => {
    resetContainer();
    containerBuilder();
    vuetify = new Vuetify();
    container.unbind("Modules");
    container.bind<Modules>("Modules").toConstantValue(modules());
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
  });

  it("should mount and not show anything if there aren't targets", async () => {
    const emptyModules = {
      modules: {
        singleWatchlist: {
          namespaced: true,
          actions: {},
          mutations: {},
          state: {
            id: 1,
          },
          getters: {},
        },
        targets: {
          namespaced: true,
          actions: {
            [ActionTypes.getTargets]: jest.fn(),
          },
          mutations: {},
          state: {
            targets: [],
          },
          getters: getters,
        },
      },
    };

    container.unbind("Modules");
    container.bind<Modules>("Modules").toConstantValue(emptyModules);
    container.unbind(cid.StoreCreator);
    container.addSingleton<IStoreCreator>(StoreCreator);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
    const wrapper = mount(TargetList, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const tbody = wrapper.find("tbody");
    const tr = tbody.find("tr");
    expect(tr.find("td").text()).toBe("No data available");
  });
  it("should mount and show targets if store is not empty", async () => {
    const wrapper = mount(TargetList, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const tbody = wrapper.find("tbody");
    const trs = tbody.findAll("tr");
    expect(trs.length).toBe(1);
    trs.wrappers.forEach((tr) => {
      expect(tr.find("td").text()).toBe("test");
    });
  });
});
describe("Edit Targets", () => {
  containerBuilder();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  let store: Store<IRootState>;
  let localModules: Modules;

  beforeEach(() => {
    resetContainer();
    containerBuilder();
    vuetify = new Vuetify();
    container.unbind("Modules");
    localModules = modules();
    container.bind<Modules>("Modules").toConstantValue(localModules);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
  });
  it("should call editTarget action when saving form opened from the edit button", async () => {
    const wrapper = mount(TargetList, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const editBtn = wrapper.find("#edit1");
    await editBtn.trigger("click");
    const saveBtn = wrapper.find("#saveButton");
    await saveBtn.trigger("click");
    expect(
      localModules.modules.targets.actions.editTarget
    ).toHaveBeenCalledTimes(1);
  });
});

describe("Create Target", () => {
  containerBuilder();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  let store: Store<IRootState>;
  let localModules: Modules;

  beforeEach(() => {
    resetContainer();
    containerBuilder();
    vuetify = new Vuetify();
    container.unbind("Modules");
    localModules = modules();
    container.bind<Modules>("Modules").toConstantValue(localModules);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
  });
  it("should call createTarget action when saving form opened from the create button", async () => {
    const wrapper = mount(TargetList, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const createBtn = wrapper.find("#createBtn");
    await createBtn.trigger("click");
    const saveBtn = wrapper.find("#saveButton");
    await saveBtn.trigger("click");
    expect(
      localModules.modules.targets.actions.createTarget
    ).toHaveBeenCalledTimes(1);
  });
});

describe("Delete Target", () => {
  containerBuilder();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  let store: Store<IRootState>;
  let localModules: Modules;

  beforeEach(() => {
    resetContainer();
    containerBuilder();
    vuetify = new Vuetify();
    container.unbind("Modules");
    localModules = modules();
    container.bind<Modules>("Modules").toConstantValue(localModules);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
  });
  it("should call deleteTarget action when dialog opened from the delete button is confirmed", async () => {
    const wrapper = mount(TargetList, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const deleteBtn = wrapper.find("#deleteButton");
    await deleteBtn.trigger("click");
    const okBtn = wrapper.find("#deleteConfirm");
    await okBtn.trigger("click");
    expect(
      localModules.modules.targets.actions.deleteTarget
    ).toHaveBeenCalledTimes(1);
  });
  it("should not call deleteTarget action when dialog opened from the delete button is canceled", async () => {
    const wrapper = mount(TargetList, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const deleteBtn = wrapper.find("#deleteButton");
    await deleteBtn.trigger("click");
    expect(wrapper.vm.$data.dialogDelete).toBeTruthy();
    const okBtn = wrapper.find("#deleteCancel");
    await okBtn.trigger("click");
    expect(
      localModules.modules.targets.actions.deleteTarget
    ).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.$data.dialogDelete).toBeFalsy();
  });
});
