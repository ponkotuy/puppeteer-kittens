import {Page} from "puppeteer";
import {Button, buttonText} from "./button.js";

// Exec attach before using
export async function kittenClick(page: Page, button: Button): Promise<ClickResult> {
  return await page.$$eval(`div.btnContent`, (divs, target) => {
    const div = divs.find((div) => {
      const text = div.textContent!;
      return text.startsWith(target)
    });
    if(div == undefined) return "NotFound";
    if(div.parentElement && div.parentElement.classList.contains("disabled")) return "Disabled";
    try {
      (div as HTMLElement).click();
      return "Success";
    } catch (err) {
      console.log(err);
      return "Failure";
    }
  }, buttonText(button)).catch((err) => {
    console.log(err);
    return "Failure";
  });
}

type ClickResult = "Success" | "Disabled" | "NotFound" | "Failure"
