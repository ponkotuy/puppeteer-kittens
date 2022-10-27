import {Page} from "puppeteer";
import {scrapeBuildCount} from "../browser/buildCount.js";
import {Button} from "../browser/button.js";
import {kittenClick} from "../browser/kittenButtons.js";
import {Runner} from "../util/multiInterval.js";

export class RequiredStrategy implements Runner {
  tick: number = 1000;
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async func() {
    const buildCounts = await scrapeBuildCount(this.page);
    buildCounts.data.forEach(bc => {
      const required = RequiredBuilds.get(bc.type);
      if(required && bc.count < required) {
        kittenClick(this.page, bc.type);
      }
    });
  }
}

const RequiredBuilds = new Map<Button, number>([
  [Button.Farm, 50],
  [Button.House, 50]
]);
