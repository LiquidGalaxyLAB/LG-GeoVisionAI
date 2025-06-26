import { Home } from "./components/home.mjs";
import { Settings } from "./components/settings.mjs";
import { LGtools } from "./components/tools.mjs";
import { changeTabs } from "./utils/tabs.mjs";
import { LGVoice } from "./components/voice.mjs";
import { pageObserver } from "./utils/intersection-observer.mjs";
import { About } from "./components/about.mjs"; 

customElements.define("lg-tools", LGtools);
customElements.define("home-page", Home);
customElements.define("lg-settings", Settings);
if (!customElements.get("lg-voice")) {
    customElements.define("lg-voice", LGVoice);
  }
if (!customElements.get("lg-about")) { 
    customElements.define("lg-about", About);
}

changeTabs();
pageObserver();