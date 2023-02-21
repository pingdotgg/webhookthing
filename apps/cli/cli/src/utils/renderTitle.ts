import gradient from "gradient-string";
import { TITLE_TEXT } from "../consts";

// colors brought in from vscode poimandres theme
const poimandresTheme = {
  blue: "#add7ff",
  cyan: "#89ddff",
  green: "#5de4c7",
  magenta: "#fae4fc",
  red: "#d0679d",
  yellow: "#fffac2",
};

export const renderTitle = () => {
  const captGradient = gradient(Object.values(poimandresTheme));

  // eslint-disable-next-line no-console
  console.log(captGradient.multiline(TITLE_TEXT));
};
