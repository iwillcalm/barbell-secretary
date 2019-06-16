import path from "path";
import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import koaStatic from "koa-static";

import { SERVER_PORT } from "./config";
import { buildRoutes } from "./route";
import { Services } from "./services";
import { notFound } from "./utils";

import * as services from "./service-entrances";

const app = new Koa();
const router = new Router({ prefix: "/api" });

router.use(buildRoutes(services as Services).routes());

app
  // 静态文件
  .use(koaStatic(path.join(__dirname, "./static")))
  // 请求解析
  .use(bodyParser())
  // 404
  .use(notFound())
  // router
  .use(router.routes())
  .listen(SERVER_PORT, async () => {
    await services.dbService.ready();
    console.log(`Server running on http://localhost:${SERVER_PORT}`);
  });
