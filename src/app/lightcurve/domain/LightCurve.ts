import {
  IDetections,
  INonDetections,
  ILightCurveData,
} from "./LightCurve.types";

export class LightCurve implements ILightCurveData {
  detections: IDetections[];
  nonDetections: INonDetections[];

  constructor(data: ILightCurveData) {
    this.detections = data.detections;
    this.nonDetections = data.nonDetections;
  }
  validate(): boolean {
    return this.detections != undefined && this.nonDetections != undefined;
  }
}
