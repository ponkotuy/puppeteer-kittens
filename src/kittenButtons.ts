import puppeteer from "puppeteer";
import {Button, ButtonType} from "./button.js";

const ATTR = "data-ponkotuy-button";

// Exec attach before using
export class KittenButtons {
  page: puppeteer.Page;

  constructor(page: puppeteer.Page) {
    this.page = page;
  }

  async attach() {
    await this.page.$$eval(`div.btnContent:not([${ATTR}])`, (divs, buttons, ATTR) => {
      const determine = (content: string) => {
        const entry = buttons.find(btn => content.startsWith(btn.text));
        return entry?.name;
      }

      divs.forEach(div => {
        if (div.textContent) {
          const buttonType = determine(div.textContent);
          div.setAttribute(ATTR, buttonType || "");
        } else {
          div.setAttribute(ATTR, "");
        }
      });
    }, Button.values, ATTR);
  }


  async click(type: ButtonType, options?: ClickOptions): Promise<boolean> {
    const btn = await this.page.$(`div.btnContent[${ATTR}="${type.name}"]`);
    if(btn === null && options?.retry) {
      await this.attach();
      return await this.click(type);
    }
    await btn?.click();
    return btn !== null;
  }
}

export interface ClickOptions {
  retry: boolean;
}
