import { cleankml } from "../api/cleankml.mjs";
import { cleanlogo, showlogo } from "../api/logo.mjs";
import { cleanballoon, showballoon } from "../api/balloon.mjs";
import { reboot } from "../api/reboot.mjs";
import { relaunch } from "../api/relaunch.mjs";
import { sendkml } from "../api/sendkml.mjs";
import { shutdown } from "../api/shutdown.mjs";
import { startOrbit, stopOrbit } from "../api/orbit.mjs";

export const speech = {
  _synth: null,
  _utterance: null,

  initTTS() {
    if ('speechSynthesis' in window) {
      this._synth = window.speechSynthesis;
    } else {
      console.warn("SpeechSynthesis API not supported in this browser. AI narration will not work.");
    }
  },

  speak(text, onEndCallback = () => {}) {
    if (!this._synth) {
      console.error("SpeechSynthesis API not initialized or not supported. Cannot speak.");
      onEndCallback();
      return;
    }

    this.stop();

    this._utterance = new SpeechSynthesisUtterance(text);

    this._utterance.lang = 'en-US';
    this._utterance.pitch = 1;
    this._utterance.rate = 1;

    this._utterance.onend = () => {
      onEndCallback();
    };

    this._utterance.onerror = (event) => {
      console.error("SpeechSynthesisUtterance error:", event);
      onEndCallback();
    };

    this._synth.speak(this._utterance);
  },

  stop() {
    if (this._synth && this._synth.speaking) {
      this._synth.cancel();
    }
  },

  processCommand: async (words) => {
    const lowerCaseWords = (words || "").toLowerCase();

    switch (true) {
      case lowerCaseWords.includes("clean") && lowerCaseWords.includes("logos"):
        await cleanlogo();
        break;
      case lowerCaseWords.includes("clean") && lowerCaseWords.includes("balloon"):
        await cleanballoon();
        break;
      case lowerCaseWords.includes("clean") && lowerCaseWords.includes("kml"):
        await cleankml();
        break;
      case lowerCaseWords.includes("clean") &&
        (lowerCaseWords.includes("visualization") || lowerCaseWords.includes("visualisation")):
        await cleankml();
        await cleanlogo();
        break;
      case lowerCaseWords.includes("reboot"):
        await reboot();
        break;
      case lowerCaseWords.includes("relaunch") || lowerCaseWords.includes("launch"):
        await relaunch();
        break;
      case (lowerCaseWords.includes("send") || lowerCaseWords.includes("show")) &&
        lowerCaseWords.includes("kml"):
        await sendkml();
        break;
      case (lowerCaseWords.includes("send") || lowerCaseWords.includes("show")) &&
        lowerCaseWords.includes("balloon"):
        await showballoon();
        break;
      case (lowerCaseWords.includes("send") || lowerCaseWords.includes("show")) &&
        lowerCaseWords.includes("logo"):
        await showlogo();
        break;
      case (lowerCaseWords.includes("shut") && lowerCaseWords.includes("down")) ||
        (lowerCaseWords.includes("turn") && lowerCaseWords.includes("off")):
        await shutdown();
        break;
      case (lowerCaseWords.includes("stop") && lowerCaseWords.includes("orbit")) ||
        (lowerCaseWords.includes("stop") && lowerCaseWords.includes("spin")):
        await stopOrbit();
        break;
      case lowerCaseWords.includes("orbit") || lowerCaseWords.includes("spin"):
        await startOrbit(34.07022, -118.54453, 10);
        break;
      default:
        break;
    }
  },
};