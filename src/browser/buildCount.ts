import {Page} from "puppeteer";
import {Button, ButtonObjects} from "./button.js";

export async function scrapeBuildCount(page: Page): Promise<BuildCounts> {
  const result = await page.$$eval("div.btnContent", (buttons, Button) => {
    const NUMBER_RE = /[-.\d]+/;
    return buttons.map((btn) => {
      const text = btn.textContent!;
      const buttonType = Button.find(b => text.startsWith(b.text));
      if(buttonType) {
        const numberText = text.match(NUMBER_RE);
        const count = numberText == null ? 0 : parseInt(numberText[0]);
        return {type: buttonType.name, count};
      }
      return null;
    });
  }, ButtonObjects);
  return new BuildCounts(result.filter((x): x is NonNullable<typeof x> => x != null));
}

export interface BuildCount {
  type: Button;
  count: number;
}

export class BuildCounts {
  data: BuildCount[];

  constructor(data: BuildCount[]) {
    this.data = data;
  }

  getCount(button: Button) {
    return this.data.find(bc => bc.type == button)?.count || 0;
  }
}
