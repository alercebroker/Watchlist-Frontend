export interface WatchlistRequestModel {
    title: string,
    owner: string,
    date: Date
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
