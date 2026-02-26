import { autoUserDetected } from "@constants/autoUserCookies";

export default class AutoUserOperations {
  static async setCookies(context) {
    await context.addCookies([autoUserDetected()]);
  }
}
