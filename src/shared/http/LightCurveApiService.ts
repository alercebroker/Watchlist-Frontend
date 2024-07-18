import { HttpServiceLightCurve } from "./HttpServiceLightCurve";

export class LightCurveApiService extends HttpServiceLightCurve {
  constructor() {
    super(process.env.VUE_APP_LC_API || "");
  }
}
