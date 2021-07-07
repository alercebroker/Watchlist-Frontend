import { IMatchData } from "../domain/Match.types";

export interface TargetAPIResponse {
    url: string
    id: number
    name: string
    radius: number
    ra: number
    dec: number
    matches: IMatchData[]
}
