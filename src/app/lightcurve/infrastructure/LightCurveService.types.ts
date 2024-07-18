import { IDetections, INonDetections } from "../domain/LightCurve.types";

export interface LightCurveApiResult {
  detections: IDetections[];
  non_detections: INonDetections[];
}
