import { DBService } from "./dbService";
import { scheduleJob, Job } from "node-schedule";
import { Contact } from "wechaty";

const DRINK_START_KEY = "drink_start";
const DRINK_TIMES_KEY = "drink_times";
const DRINK_INTERVAL_KEY = "drink_interval";

const DRINK_TIP = `
  ☕ 1.喝水功能
    🚥 hs:on 开启喝水提示
    🚧 hs:off 关闭喝水提示
    📝 hs:c20 每日最多提醒次数
    ⏰ hs:t15 每次提醒间隔分钟
    🕘 hs:09:00 每日提醒开始时间
`;

export class DrinkService {
  private processJob: Job | undefined;
  private drinkJob: Job | undefined;
  private contact: Contact | undefined;
  private todayTimes = 0;

  constructor(private dbService: DBService) {
    scheduleJob("0 0 2 * * * ", async () => {
      let [hour, minute] = (await this.dbService.get<[] | undefined>(
        DRINK_START_KEY
      )) || [9, 0];

      this.todayTimes = 0;
      this.cancelSchedule();

      if (this.processJob) {
        this.processJob.cancel();
      }

      this.processJob = scheduleJob({ hour, minute }, this.createSchedule);
    });
  }

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
        if (this.drinkJob) {
          return "喝水功能正在运行中，无需再次开启哦";
        }

        this.createSchedule().catch(console.error);
        return "喝水提醒已打开";
      case "off":
        this.cancelSchedule();
        return "喝水提醒已关闭";
      default:
        if (command.startsWith("c")) {
          let times = Math.floor(+command.slice(1));

          if (isNaN(times) || times < 0 || times > 100) {
            return "次数不对头 ！";
          }

          this.dbService.set(DRINK_TIMES_KEY, times);
          this.restartJob();

          return `设置成功，每天会提醒你 ${times} 次噢`;
        } else if (command.startsWith("t")) {
          let interval = Math.floor(+command.slice(1));

          if (isNaN(interval) || interval < 0) {
            return "时间间隔不对头 ！";
          }

          if (interval >= 120) {
            return "咋能两个小时都不喝水 ！";
          }

          this.dbService.set(DRINK_INTERVAL_KEY, interval);
          this.restartJob();

          return `设置成功，每 ${interval} 分钟提醒你喝一次水`;
        } else {
          let [hour, minute] = command.split(":").map(Number);

          if (
            isNaN(hour) ||
            hour < 0 ||
            hour > 24 ||
            isNaN(minute) ||
            minute < 0 ||
            minute > 60
          ) {
            return "时间格式不对哦 ~";
          }

          if (hour < 6) {
            return "六点之前还是睡觉觉比较好 ~";
          }

          this.dbService.set(DRINK_START_KEY, [hour, minute]);

          return `时间设置成功，明天开始就 ${command} 开始提醒你噢~`;
        }
    }
  }

  async createSchedule(): Promise<void> {
    let interval = (await this.dbService.get(DRINK_INTERVAL_KEY)) || 15;

    this.drinkJob = scheduleJob(`0 */${interval} * * * *`, async () => {
      this.sendToContact("小秘书提醒：该喝水啦 ~");

      this.todayTimes++;

      let times = (await this.dbService.get<number>(DRINK_TIMES_KEY)) || 20;

      if (this.todayTimes >= times) {
        this.sendToContact(
          `小秘书提醒：今日共 ${this.todayTimes} 次提醒已完成 ~`
        );

        this.cancelSchedule();
      }
    });
  }

  cancelSchedule(): void {
    if (this.drinkJob) {
      this.drinkJob.cancel();
      this.drinkJob = undefined;
    }
  }

  sendToContact(text: string): void {
    let contact = this.contact;

    if (!contact) {
      return;
    }

    contact.say(text);
  }

  private restartJob(): void {
    this.cancelSchedule();
    this.createSchedule();
  }

  registerContact = (contact: Contact): void => void (this.contact = contact);
}
