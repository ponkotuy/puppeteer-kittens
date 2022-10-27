import {Page} from "puppeteer";
import {scrapeBuildCount} from "../browser/buildCount.js";
import {Button} from "../browser/button.js";
import {kittenClick} from "../browser/kittenButtons.js";
import {Runner, RunnerResult} from "../util/multiInterval.js";

export class StartupStrategy implements Runner {
  tick: number = 100;
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async func(): Promise<RunnerResult> {
    await kittenClick(this.page, Button.Harvest);
    const buildCounts = await scrapeBuildCount(this.page);
    if (3 <= buildCounts.getCount(Button.House)) return RunnerResult.Exit;
    if (buildCounts.getCount(Button.Farm) < 30) await kittenClick(this.page, Button.Farm);
    else {
      await kittenClick(this.page, Button.Refining);
      await kittenClick(this.page, Button.House);
    }
    return RunnerResult.Continue;
  }
}
