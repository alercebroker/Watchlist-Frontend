import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";

export interface IDetections {
  aid: number;
  candid: number;
  corrected: boolean;
  dec: number;
  dubious: boolean;
  e_dec: number;
  e_mag: number;
  e_mag_corr: number;
  e_mag_corr_ext: number;
  e_ra: number;
  extra_fields: IExtraFields;
  fid: number;
  has_stamp: boolean;
  isdiffpos: number;
  mag: number;
  mag_corr: number;
  mjd: number;
  oid: string;
  parent_candid: number;
  pid: number;
  ra: number;
  sid: string;
  tid: string;
}

export interface IExtraFields {
  diffmaglim: number;
  distnr: number;
  drb: number;
  drbversion: string;
  magap: number;
  magapbig: number;
  nid: number;
  rb: number;
  rbversion: string;
  rfid: number;
  sigmagap: number;
  sigmagapbig: number;
  step_id_corr: string;
}

export interface INonDetections {
  aid: number;
  diffmaglim: number;
  fid: number;
  mjd: number;
  oid: string;
  sid: null;
  tid: string;
}

export interface ILightCurveData {
  detections: IDetections[];
  nonDetections: INonDetections[];
}

export interface ILightCurveRepository {
  getLightCurve(
    params?: string
  ): Promise<Result<ILightCurveData, ParseError | HttpError>>;
}
