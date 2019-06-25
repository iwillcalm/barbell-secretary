import Router from "koa-router";
import { DBService } from "../services";
import { ResultHelper } from "../utils";

export function buildCommonRoute(dbService: DBService): Router {
  return new Router()
    .get("/initialize", async ctx => {
      let token = await dbService.get("token");

      ctx.body = ResultHelper.success(!!token);
    })
    .get("/saveToken", async ctx => {
      let { token: initToken } = ctx.query;
      let token = await dbService.get("token");

      if (token) {
        ctx.body = ResultHelper.success(false);
        return;
      }

      await dbService.set("token", initToken);

      ctx.body = ResultHelper.success(true);
    })
    .get("/common", async ctx => {
      ctx.body = "WIP: 小杠玲的小秘书开发中";
    });
}
