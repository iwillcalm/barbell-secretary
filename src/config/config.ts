import { DBServiceOptions } from "../services";

export const MONGO_OPTIONS: DBServiceOptions = {
  host: "localhost",
  name: "barbell",
  port: 27017
};

export const SERVER_PORT = 3000;

export const ERROR_TIP = {
  notFound: "瞎看啥",
  busy: "没空理你"
};
