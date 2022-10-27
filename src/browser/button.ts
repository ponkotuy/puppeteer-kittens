export const Button = {
  Harvest: "harvest",
  Refining: "refining",
  Farm: "farm",
  House: "house",
} as const;

export type Button = typeof Button[keyof typeof Button];

export const ButtonValues = Object.values(Button);
export const ButtonObjects = ButtonValues.map(b => {
  return {name: b, text: buttonText(b)};
});

export function buttonText(button: Button): string {
  switch (button) {
    case "harvest":
      return "キャットニップの収穫";
    case "refining":
      return "キャットニップを精製する";
    case "farm":
      return "キャットニップ畑";
    case "house":
      return "小屋";
  }
}
