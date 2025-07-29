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
  lastCoordinates: null,

  initTTS() {
    if ('speechSynthesis' in window) {
      this._synth = window.speechSynthesis;
      console.log("SpeechSynthesis initialized.");
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

    if (!text || typeof text !== "string") {
      console.error("No valid text provided to speak:", text);
      onEndCallback();
      return;
    }

    setTimeout(() => {
      this.stop(); 

      this._utterance = new SpeechSynthesisUtterance(text);
      this._utterance.lang = 'en-US';
      this._utterance.pitch = 1;
      this._utterance.rate = 1;

      this._utterance.onend = () => {
        console.log("Speech ended.");
        onEndCallback();
      };

      this._utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance error:", event);
        onEndCallback();
      };

      console.log("Speaking:", text);
      this._synth.speak(this._utterance);
    }, 50);
  },

  stop() {
    if (this._synth && this._synth.speaking) {
      console.log("Stopping current speech...");
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
        if (this.lastCoordinates) {
          const { lat, lng } = this.lastCoordinates; 
          console.log(`Starting orbit with coordinates: ${lat}, ${lng}`);
          await startOrbit(lat, lng, 10);
        } else {
          console.error("No coordinates available for orbit.");
        }
        break;
      default:
        break;
    }
  },
};
