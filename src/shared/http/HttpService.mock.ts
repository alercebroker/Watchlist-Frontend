import { WatchlistApiResponse } from "@/app/watchlist/infrastructure/WatchlistService.types";
import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { inject } from "inversify-props";
import { IAxiosCreator } from ".";

export const mockApiWatchlists: WatchlistApiResponse = {
    count: 2,
    next: "watchlist/?page=1",
    previous: "",
    results: [
        {
            url: "watchlist/1",
            title: "Test1",
            targets: "watchlist/1/targets"
        },
        {
            url: "watchlist/2",
            title: "Test2",
            targets: "watchlist/2/targets"
        },
    ],
};

export type TestActions =
    | "ok"
    | "error"
    | "timeout"
    | "parseError"
    | "clientError"
    | "serverError";

export class MockAxiosCreator implements IAxiosCreator {
    mock!: MockAdapter;
    actionType: TestActions;
    constructor(@inject("ActionType") actionType: TestActions) {
        this.actionType = actionType;
    }

    createAxiosInstance(_baseUrl: string): AxiosInstance {
        const instance = axios.create({ baseURL: _baseUrl });
        this.mock = new MockAdapter(instance);
        if (this.actionType === "ok") this.setMockActions();
        if (this.actionType === "error") this.setErrorActions();
        if (this.actionType === "timeout") this.setTimeoutActions();
        return instance;
    }

    setMockActions() {
        this.mock.onGet("/watchlist").reply((_config: any) => {
            const response = mockApiWatchlists
            return [200, JSON.stringify(response)];
        });
    }
    setErrorActions() {
        this.mock.onGet("/watchlist").networkError();
    }
    setTimeoutActions() {
        this.mock.onGet("/watchlist").timeout();
    }
}
