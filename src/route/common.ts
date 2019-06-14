import Router from "koa-router";

export function buildCommonRoute(): Router {
  return new Router().get("/common", async ctx => {
    ctx.body = "WIP: 小杠玲的小秘书开发中";
  });
}
