import { Services } from "../services";
import { buildCommonRoute } from "./common";
import Router from "koa-router";

export function buildRoutes({ botService }: Services): Router {
  return new Router().use(buildCommonRoute().routes());
}
