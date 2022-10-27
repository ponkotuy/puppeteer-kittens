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
    const done: boolean[] = [];
    let exit: boolean = false;
    for await (const _ of setInterval(this.baseTick)) {
      this.runners.map(async (runner, idx) => {
        const elapsed = Date.now() - (lastRun[idx] || 0);
        if ((!done[idx]) && (runner.tick <= elapsed || runner.tick <= this.baseTick)) {
          const result = await runner.func();
          lastRun[idx] = Date.now();
          if(result == RunnerResult.Done) done[idx] = true;
          if(result == RunnerResult.Exit) exit = true;
        }
      });
      if(exit) break;
    }
  }
}

export interface Runner {
  tick: number;
  func: () => Promise<RunnerResult | void>;
}

export const RunnerResult = {
  Continue: "continue",
  Done: "done",
  Exit: "exit"
} as const;

export type RunnerResult = typeof RunnerResult[keyof typeof RunnerResult]
