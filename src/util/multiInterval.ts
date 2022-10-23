import {setInterval} from "node:timers/promises";

export class MultiInterval {
  baseTick: number;
  runners: Runner[] = [];

  constructor(baseTick: number) {
    this.baseTick = baseTick;
  }

  add(...runner: Runner[]) {
    this.runners.push(...runner);
  }

  async run() {
    const lastRun: number[] = [];
    for await (const _ of setInterval(this.baseTick)) {
      this.runners.forEach((runner, idx) => {
        const elapsed = Date.now() - (lastRun[idx] || 0);
        if (runner.tick <= elapsed || runner.tick <= this.baseTick) {
          runner.func();
          lastRun[idx] = Date.now();
        }
      });
    }
  }
}

export interface Runner {
  tick: number;
  func: () => void;
}

export class SwitchingRunner implements Runner {
  tick: number;
  func: () => void;
  enabled: boolean = true;

  constructor(runner: Runner) {
    this.tick = runner.tick;
    this.func = () => {
      if(this.enabled) runner.func();
    }
  }

  switching(value: boolean) {
    this.enabled = value;
  }
}
