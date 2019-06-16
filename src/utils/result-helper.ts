export class ResultHelper {
  static success(data?: unknown) {
    return {
      status: "success",
      data
    };
  }
}
