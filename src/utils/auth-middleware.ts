import { Middleware } from "koa";

import { API_PREFIX } from "../config";

const USERS = ["boen", "dl"];

const ALLOWED_PATH = ["/initialize", "/saveToken"].map(
  path => API_PREFIX + path
);

type AuthToken = () => Promise<string> | string;

export function auth(tokenGetter: AuthToken): Middleware {
  return async (cxk, next) => {
    let path = cxk.path;

    if (
      !path.startsWith(API_PREFIX) ||
      ALLOWED_PATH.includes(path) ||
      (await checkAuthorization(cxk.request.get("authorization"), tokenGetter))
    ) {
      return next();
    }

    cxk.status = 401;
    cxk.set("WWW-Authenticate", "Basic realm=/");
  };
}

async function checkAuthorization(
  authorization: string,
  tokenGetter: AuthToken
): Promise<boolean> {
  if (!authorization) {
    return false;
  }

  let token = await (typeof tokenGetter === "string"
    ? tokenGetter
    : tokenGetter());

  let [username, password] = Buffer.from(authorization.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (!USERS.includes(username) || password !== token) {
    return false;
  }

  return true;
}
