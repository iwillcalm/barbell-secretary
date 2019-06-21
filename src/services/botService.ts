import { Wechaty, Message } from "wechaty";
import { ContactSelf, Contact } from "wechaty/dist/src/user";
import { DrinkService } from "./drinkService";
import Qrcode from "qrcode-terminal";

export class BotService {
  qrcodeUrl: string | undefined;

  private bot: Wechaty;
  private she: Contact | undefined;

  constructor(private drinkService: DrinkService) {
    this.bot = Wechaty.instance();
    this.init();
  }

  private onScan = (qrcode: string) => {
    // console qrcode to terminal
    Qrcode.generate(qrcode, { small: true });

    this.qrcodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrcode
    )}`;
  };

  private onLogin = async (user: ContactSelf) => {
    console.log("微信已登录 ...");

    let contact = await this.bot.Contact.find({ alias: "小杠玲" });

    if (!contact) {
      return;
    }

    this.she = contact;

    let tip = `
    -- 小秘书已登录 --
    ${this.drinkService.getTip()}
    `;
    contact.say(tip);

    this.drinkService.registerContact(contact);
  };

  private onMessage = (message: Message) => {
    let from = message.from();
    let she = this.she;

    if (!she || !from || from.id !== she.id) {
      return;
    }

    this.handleMessage(message);
  };

  private init() {
    this.bot
      .on("scan", this.onScan)
      .on("login", this.onLogin)
      .on("message", this.onMessage)
      .start()
      .catch(console.error);
  }

  private handleMessage(message: Message): void {
    this.handleDrink(message.text());
  }

  private handleDrink(text: string): void {
    let reply = this.drinkService.getReply(text);

    if (!reply) {
      return;
    }

    this.sendToShe(reply);
  }

  private sendToShe(text: string): void {
    let she = this.she;

    if (!she) {
      return;
    }

    she.say(text);
  }
}
