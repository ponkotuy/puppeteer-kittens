import puppeteer from "puppeteer";
import {RequiredStrategy} from "./strategy/requiredStrategy.js";
import {StartupStrategy} from "./strategy/startupStrategy.js";
import {MultiInterval, Runner, RunnerResult} from "./util/multiInterval.js";
import {loadStorage, saveStorage} from "./browser/localStorage.js";
import {ResourceMaxStrategy} from "./strategy/resourceMaxStrategy.js";
import {cheatUI} from "./browser/cheatUI.js";
import {ReceiveCommand} from "./browser/receiveCommand.js";

const AUTO_SAVE_FILE = "auto-save.json";

type GlobalState = "OFF" | "Startup" | "Main"
let global = "Startup" as GlobalState;

(async () => {
  const page = await launch();

  await cheatUI(page);
  const commander = new ReceiveCommand(page);
  commander.addReceivers({
    name: "cheat",
    func: value => {
      const b = value == 'true';
      if(b) global = "Startup"
      else global = "OFF"
    }
  });

  const defaults: ((state: GlobalState) => Runner[]) = state => [
      {tick: 10000, func: async () => { await saveStorage(page, AUTO_SAVE_FILE) }},
      commander,
      new ChangeGlobalState(state)
  ]

  const off = new MultiInterval(100);
  off.add(...defaults("OFF"));

  const startup = new MultiInterval(100);
  startup.add(...defaults("Startup"));
  startup.add(new StartupStrategy(page));

  const main = new MultiInterval(100);
  main.add(...defaults("Main"));
  main.add(new ResourceMaxStrategy(page), new RequiredStrategy(page));

// noinspection InfiniteLoopJS
  while(true) {
    switch (global) {
      case "Startup":
        await startup.run();
        global = "Main";
        break;
      case "Main":
        await main.run();
        break;
      case "OFF":
        await off.run();
        break;
    }
  }
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

class ChangeGlobalState implements Runner {
  tick: number = 100;
  state: GlobalState;

  constructor(state: GlobalState) {
    this.state = state;
  }

  async func() {
    if(this.state != global) return RunnerResult.Exit;
    return RunnerResult.Continue;
  }
}
