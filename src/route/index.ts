import { Services } from "../services";
import { buildCommonRoute } from "./common";
import Router from "koa-router";
import { buildBotRoute } from "./bot";

export function buildRoutes({ dbService, botService }: Services): Router {
  return new Router().use(
    buildCommonRoute(dbService).routes(),
    buildBotRoute(botService).routes()
  );
}
