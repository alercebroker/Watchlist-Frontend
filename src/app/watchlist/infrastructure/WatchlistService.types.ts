export interface WatchlistRequestModel {
    title: string,
    owner: string,
}

export interface WatchlistApiResult {
    url: string,
    title: string,
    targets: string
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

export interface CreateWatchlistTargetApiResult 
{
    url: string,
    name: string,
    radius: Number,
    ra: Number,
    dec: Number,
    n_matches: Number,
}