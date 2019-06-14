import { DBService } from "./dbService";
import { BotService } from "./botService";
import { DrinkService } from "./drinkService";

export * from "./dbService";
export * from "./botService";
export * from "./drinkService";

export type Services = {
  dbService: DBService;
  botService: BotService;
  drinkService: DrinkService;
};
