import puppeteer from "puppeteer";
import {KittenButtons} from "./kittenButtons.js";
import {Button} from "./button.js";
import {MultiInterval, SwitchingRunner} from "./multiInterval.js";
import {loadStorage, saveStorage} from "./localStorage.js";
import {ResourceMaxStrategy} from "./resourceMaxStrategy.js";
import {cheatUI} from "./cheatUI.js";
import {ReceiveCommand} from "./receiveCommand.js";

const AUTO_SAVE_FILE = "auto-save.json";

(async () => {
  const page = await launch();

  const buttons = new KittenButtons(page);
  await buttons.attach();

  await cheatUI(page);
  const commander = new ReceiveCommand(page);

  const runners = [
    new SwitchingRunner({tick: 1000, func: () => buttons.click(Button.Harvest, {retry: true})}),
    new SwitchingRunner({tick: 10000, func: () => saveStorage(page, AUTO_SAVE_FILE)}),
    new SwitchingRunner(new ResourceMaxStrategy(page, buttons))
  ];

  const interval = new MultiInterval(100);
  interval.add(commander);
  interval.add(...runners);
  commander.addReceivers({
    name: "cheat",
    func: value => {
      const b = value == 'true';
      runners.forEach(r => r.switching(b));
    }
  });
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
