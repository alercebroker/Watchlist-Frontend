import { HttpService } from "./HttpService";

export class UsersApiService extends HttpService {
  constructor() {
    super(process.env.VUE_APP_USER_API || "");
  }
}
