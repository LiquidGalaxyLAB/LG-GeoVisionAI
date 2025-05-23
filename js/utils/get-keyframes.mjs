import { getNumberBetweenTwoNumbers } from "./get-number.mjs";

export const getKeyframes = () => {
  let keyframesString = "@keyframes voice {\n";

  const gradBlueRed = getNumberBetweenTwoNumbers(0, 66);
  const gradRedBlue = getNumberBetweenTwoNumbers(gradBlueRed, 66);
  const gradRedYellow = getNumberBetweenTwoNumbers(50, gradRedBlue);
  const gradYellowRed = getNumberBetweenTwoNumbers(gradRedYellow, 50);
  const gradYellowGreen = getNumberBetweenTwoNumbers(gradYellowRed, 33);
  const gradGreenYellow = getNumberBetweenTwoNumbers(gradYellowGreen, 33);

  for (const keyframe of ["0%", "25%", "50%", "100%"]) {
    keyframesString += `
          ${keyframe} {
              --gradBlueRed: ${gradBlueRed}%;
              --gradRedBlue: ${gradRedBlue};
              --gradRedYellow: ${gradRedYellow}%;
              --gradYellowRed: ${gradYellowRed}%;
              --gradYellowGreen: ${gradYellowGreen}%;
              --gradGreenYellow: ${gradGreenYellow}%;
          }\n`;
  }

  keyframesString += "}";

  console.log(keyframesString);

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(keyframesString);
  document.adoptedStyleSheets.push(sheet);
};
