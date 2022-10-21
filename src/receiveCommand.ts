import {Page} from "puppeteer";
import {Runner} from "./multiInterval.js";

export class ReceiveCommand implements Runner {
  tick = 100;
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async func() {
    const result = await this.page.$eval('#actor', (elem) => {
      return [...elem.children].map(event => {
        const type = event.getAttribute("data-type");
        const value = event.getAttribute("data-value");
        return {type, value};
      });
    });
    await this.page.$eval('#actor', (elem) => {
      [...elem.children].forEach(elem => elem.remove());
    });
    if(0 < result.length) console.log(result);
  }
}
