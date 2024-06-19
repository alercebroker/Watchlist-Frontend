import { IDetections, INonDetections } from "../domain";

export interface LightCurveApiResult {
  detections: IDetections[];
  nonDetections: INonDetections[];
}
