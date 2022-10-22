import {Page} from "puppeteer";
import {Runner} from "./multiInterval.js";

export class ReceiveCommand implements Runner {
  tick = 100;
  page: Page;
  receivers: Command[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  async func() {
    const result = await this.page.$eval('#actor', (elem) => {
      return [...elem.children].map(event => {
        const type = event.getAttribute("data-type");
        const value = event.getAttribute("data-value");
        return type && value ? {type, value} : null;
      });
    });
    await this.page.$eval('#actor', (elem) => {
      [...elem.children].forEach(elem => elem.remove());
    });
    result.filter((x): x is NonNullable<typeof x> => x != null).forEach(command => {
      const target = this.receivers.find(receiver => receiver.name == command.type);
      target?.func(command.value);
    });
  }

  addReceivers(...commands: Command[]) {
    this.receivers = this.receivers.concat(commands);
  }
}

interface Command {
  name: string;
  func: (value: string) => void;
}
