import { BotService, DrinkService, DBService } from "./services";

export const dbService = new DBService();

export const drinkService = new DrinkService(dbService);

export const botService = new BotService(dbService, drinkService);
