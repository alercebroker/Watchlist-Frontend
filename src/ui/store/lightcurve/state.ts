import {
  IDetections,
  INonDetections,
} from "@/app/lightcurve/domain/LightCurve.types";

export type LightCurveState = {
  loading: boolean;
  detections: IDetections[];
  nonDetections: INonDetections[];
  selectedDetection: null;
  error: Error | null;
};

export const state = (): LightCurveState => ({
  loading: false,
  detections: [],
  nonDetections: [],
  selectedDetection: null,
  error: null,
});
