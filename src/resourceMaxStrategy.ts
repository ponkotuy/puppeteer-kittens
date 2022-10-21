import {Runner} from "./multiInterval.js";
import {Page} from "puppeteer";
import {Resource, scrapeResources} from "./kittenResources.js";
import {KittenButtons} from "./kittenButtons.js";
import {Button} from "./button.js";

export class ResourceMaxStrategy implements Runner {
  tick: number = 1000;
  page: Page;
  buttons: KittenButtons;

  constructor(page: Page, buttons: KittenButtons) {
    this.page = page;
    this.buttons = buttons;
  }

  async func() {
    const resources = await scrapeResources(this.page);
    resources.forEach(resource => {
      if (resource.max * 0.95 < resource.amount) this.strategy(resource)
    })
  }

  async strategy(resource: Resource) {
    switch (resource.name) {
      case "catnip":
        await this.buttons.click(Button.Refining);
        break;
    }
  }
}
