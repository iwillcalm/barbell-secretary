import Router from "koa-router";
import { BotService } from "../services";
import { ResultHelper } from "../utils";

export function buildBotRoute(botService: BotService): Router {
  return new Router().get("/qrcode", async ctx => {
    ctx.body = ResultHelper.success(botService.qrcodeUrl);
  });
}
