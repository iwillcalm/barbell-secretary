import { Services } from "../services";
import { buildCommonRoute } from "./common";
import Router from "koa-router";

export function buildRoutes({ dbService }: Services): Router {
  return new Router().use(buildCommonRoute(dbService).routes());
}
