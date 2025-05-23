import { cleankml } from "../api/cleankml.mjs";
import { cleanlogo, showlogo } from "../api/logo.mjs";
import { cleanballoon, showballoon } from "../api/balloon.mjs";
import { reboot } from "../api/reboot.mjs";
import { relaunch } from "../api/relaunch.mjs";
import { sendkml } from "../api/sendkml.mjs";
import { shutdown } from "../api/shutdown.mjs";
import { startOrbit, stopOrbit } from "../api/orbit.mjs";

export const speech = async (words) => {
  switch (true) {
    case words.includes("clean") && words.includes("logos"):
      await cleanlogo();
      break;
    case words.includes("clean") && words.includes("balloon"):
      await cleanballoon();
      break;
    case words.includes("clean") && words.includes("kml"):
      await cleankml();
      break;
    case words.includes("clean") &&
      (words.includes("visualization") || words.includes("visualisation")):
      await cleankml();
      await cleanlogo();
      break;
    case words.includes("reboot"):
      await reboot();
      break;
    case words.includes("relaunch") || words.includes("launch"):
      await relaunch();
      break;
    case (words.includes("send") || words.includes("show")) &&
      words.includes("kml"):
      await sendkml();
      break;
    case (words.includes("send") || words.includes("show")) &&
      words.includes("balloon"):
      await showballoon();
      break;
    case (words.includes("send") || words.includes("show")) &&
      words.includes("logo"):
      await showlogo();
      break;
    case (words.includes("shut") && words.includes("down")) ||
      (words.includes("turn") && words.includes("off")):
      await shutdown();
      break;
    case (words.includes("stop") && words.includes("orbit")) ||
      (words.includes("stop") && words.includes("spin")):
      await stopOrbit();
      break;
    case words.includes("orbit") || words.includes("spin"):
      await startOrbit(34.07022, -118.54453, 10);
      break;
    default:
      console.log("No matching command found.");
  }
};
