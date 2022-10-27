import {kittenClick} from "../browser/kittenButtons.js";
import {Runner} from "../util/multiInterval.js";
import {Page} from "puppeteer";
import {Resource, scrapeResources} from "../browser/kittenResources.js";
import {Button} from "../browser/button.js";

export class ResourceMaxStrategy implements Runner {
  tick: number = 1000;
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async func(): Promise<void> {
    const resources = await scrapeResources(this.page);
    resources.forEach(resource => {
      if (resource.max * 0.95 < resource.amount) this.strategy(resource)
    });
  }

  async strategy(resource: Resource) {
    switch (resource.name) {
      case "catnip":
        await kittenClick(this.page, Button.Refining);
        break;
    }
  }
}
