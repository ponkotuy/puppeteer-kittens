import {Page} from "puppeteer";
import * as fs from "node:fs/promises";

// noinspection SpellCheckingInspection
const KEY_NAME = "com.nuclearunicorn.kittengame.savedata";

export async function saveStorage(page: Page, fName: string): Promise<boolean> {
  const storage: any = await page.evaluate((key) => {
    return localStorage.getItem(key);
  }, KEY_NAME);

  // check type
  if (typeof storage !== "string") return false;

  // check if there is a difference
  let existing = "";
  try {
    existing = await fs.readFile(fName, "utf-8");
  } catch (err) {}
  if (existing !== storage) {
    await fs.writeFile(fName, storage);
    console.log(`Successfully saved ${fName}`);
    return true;
  } else return false;
}

export async function loadStorage(page: Page, fName: string) {
  const data = await fs.readFile(fName, "utf-8").catch(err => null);
  if(data == null) return;
  await page.evaluate(
    (key, storage) => {
      localStorage.setItem(key, storage);
    },
    KEY_NAME,
    data
  );
}
