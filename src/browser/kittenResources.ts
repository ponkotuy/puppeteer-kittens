import {Page} from "puppeteer";

export async function scrapeResources(page: Page): Promise<Resource[]> {
  return await page.evaluate(() => {
    const NAME_RE = /^resource_([a-z]+)$/g;
    const NUMBER_RE = /[-.\d]+/;
    const SI = ["K", "M", "G"];

    function fixSI(text: string): number {
      const idx = SI.indexOf(text.slice(-1));
      const numberText = text.match(NUMBER_RE);
      if (numberText == null) return 0;
      const number = parseFloat(numberText[0]);
      if (idx < 0) return number;
      return Math.pow(1000, idx + 1) * number;
    }

    return [...document.querySelectorAll<HTMLElement>("div.res-row")].map((row) => {
      const name = [...row.classList].flatMap((cls) => [...cls.matchAll(NAME_RE)])[0].slice(1)[0];
      const text = row.querySelector("div.res-cell.resource-name")!.getAttribute("title")!;
      const amountText = row.querySelector("div.res-cell.resAmount")!.textContent!;
      const amount = fixSI(amountText);
      const maxText = row.querySelector("div.res-cell.maxRes")!.textContent!;
      const max = fixSI(maxText);
      const tickText = row.querySelector("div.res-cell.resPerTick")!.textContent!;
      const tick = fixSI(tickText);
      return {name, text, amount, max, tick};
    });
  });
}

export interface Resource {
  name: string;
  text: string;
  amount: number;
  max: number;
  tick: number;
}
