import { Middleware } from "koa";

import { ERROR_TIP } from "../config";

export function notFound(): Middleware {
  return async (cxk, next) => {
    await next();

    if (cxk.status === 404) {
      cxk.body = ERROR_TIP.notFound;
    }
  };
}
