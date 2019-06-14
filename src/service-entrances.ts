import { BotService, DrinkService } from "./services";

// import * as config from "./config";
// import { DBService, BotService } from "./services";

// export const dbService = new DBService(config.MONGO_OPTIONS);

export const drinkService = new DrinkService();

export const botService = new BotService(drinkService);
