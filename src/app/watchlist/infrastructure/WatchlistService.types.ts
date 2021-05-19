export interface WatchlistRequestModel {
    title: string,
    owner: string,
}

export interface WatchlistApiResult {
    url: string,
    title: string,
    targets: string,
    n_targets: string,
    last_match: string
}

export interface WatchlistApiResponse {
    count: Number,
    next: string,
    previous: string,
    results: WatchlistApiResult[]
}
export interface CreateWatchlistTargetRequest{
    name: string,
    radius: Number,
    ra: Number,
    dec: Number,
}
export interface CreateWatchlistRequestModel {
    title: string,
    targets: CreateWatchlistTargetRequest[]
}

export interface CreateWatchlistApiResponse {
    url: string,
    title: string,
    owner: string,
    targets: CreateWatchlistTargetApiResult[]
}

export interface OneWatchlistApiResponse {
    url: string,
    title: string,
    owner: string,
    targets: string,
    n_targets: number,
    last_match: string,
}

export interface CreateWatchlistTargetApiResult 
{
    url: string,
    name: string,
    radius: Number,
    ra: Number,
    dec: Number,
    n_matches: Number,
}