import { ITargetData } from "@/app/target/domain/Target.types";

export const state = () => ({
    loading: false,
    url: "",
    targets: [] as ITargetData[],
    n_targets: "",
    last_match: "",
    title: "",
    error: null as string | null,
})

export type SingleWatchlistState = ReturnType<typeof state>;