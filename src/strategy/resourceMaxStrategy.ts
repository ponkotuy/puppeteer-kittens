import {Runner} from "../util/multiInterval.js";
import {Page} from "puppeteer";
import {Resource, scrapeResources} from "../browser/kittenResources.js";
import {KittenButtons} from "../browser/kittenButtons.js";
import {Button} from "../browser/button.js";

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
