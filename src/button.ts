
const Harvest = {name: "harvest", text: "キャットニップの収穫"};

export const Button = {
  Harvest: Harvest,
  values: [Harvest]
};

export type ButtonType = typeof Harvest;
