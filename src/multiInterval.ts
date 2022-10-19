
import {setInterval} from "node:timers/promises"

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
    const lastRun: number[] = []
    for await (const _ of setInterval(this.baseTick)) {
      this.runners.forEach((runner, idx) => {
        const elapsed = Date.now() - (lastRun[idx] || 0);
        if(runner.tick <= elapsed || runner.tick <= this.baseTick) {
          runner.func();
          lastRun[idx] = Date.now();
        }
      });
    }
  }
}

export class Runner {
  tick: number;
  func: () => void;

  constructor(tick: number, func: () => void) {
    this.tick = tick;
    this.func = func;
  }
}
