import Router from "koa-router";
import { BotService, DBService } from "../services";
import { ResultHelper } from "../utils";

export function buildBotRoute(
  botService: BotService,
  dbService: DBService
): Router {
  return new Router()
    .get("/qrcode", async ctx => {
      ctx.body = ResultHelper.success(botService.qrcodeUrl);
    })
    .get("/saveNick", async ctx => {
      let { nick } = ctx.query;

      if (!nick) {
        ctx.body = ResultHelper.success(false);
        return;
      }

      dbService.set("nick", nick);
      botService.updateShe();

      ctx.body = ResultHelper.success(true);
    });
}
