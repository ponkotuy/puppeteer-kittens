import puppeteer from "puppeteer";
import {KittenButtons} from "./kittenButtons.js";
import {Button} from "./button.js";
import {MultiInterval, Runner} from "./multiInterval.js";
import {loadStorage, saveStorage} from "./localStorage.js";

const AUTO_SAVE_FILE = "auto-save.json";

(async () => {
  const page = await launch();

  const buttons = new KittenButtons(page);
  await buttons.attach();

  const interval = new MultiInterval(100);
  interval.add(new Runner(500, () => buttons.click(Button.Harvest, {retry: true})));
  interval.add(new Runner(10000, () => saveStorage(page, AUTO_SAVE_FILE)));
  await interval.run();
})();

async function launch() {
  const settings = {
    headless: false,
    defaultViewport: null,
  };
  const browser = await puppeteer.launch(settings);
  const page = await browser.newPage();
  await page.goto("http://kittensgame.com/web/");

  const fName = process.argv[2] || AUTO_SAVE_FILE;
  await loadStorage(page, fName);

  await page.waitForSelector("#game", {visible: true});
  return page;
}
