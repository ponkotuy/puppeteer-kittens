const Harvest = {name: "harvest", text: "キャットニップの収穫"};
const Refining = {name: "refining", text: "キャットニップを精製する"};

export const Button = {
  Harvest: Harvest,
  Refining: Refining,
  values: [Harvest, Refining],
};

export type ButtonType = typeof Harvest | typeof Refining;
