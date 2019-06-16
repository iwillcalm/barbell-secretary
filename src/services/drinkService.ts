import { DBService } from "./dbService";

const DRINK_TIP = `小杠玲小秘书：喝水功能
 - 回复 hs:on 开启喝水提示
 - 回复 hs:off 开启喝水提示
 - 回复 hs:09:00 修改每日提醒为 9 点开始
`;

export class DrinkService {
  constructor(private dbService: DBService) {}

  getTip(): string {
    return DRINK_TIP;
  }

  getReply(message: string): string | undefined {
    let result = message.match(/^\hs\:([a-z0-9\:]+)/);

    if (!result) {
      return;
    }

    let [_, command] = result;

    if (!command) {
      return;
    }

    switch (command) {
      case "on":
        return "喝水功能已打开";

      case "off":
        return "喝水功能已关闭";
      default:
        return "时间设置成功";
    }
  }
}
