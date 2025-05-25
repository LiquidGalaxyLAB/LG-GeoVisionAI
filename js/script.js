import { Home } from "./components/home.mjs";
import { InteractiveMap } from "./components/maps.mjs";
import { Settings } from "./components/settings.mjs";
import { LGtools } from "./components/tools.mjs";
import { changeTabs } from "./utils/tabs.mjs";
import { LGVoice } from "./components/voice.mjs";
import { pageObserver } from "./utils/intersection-observer.mjs";

customElements.define("interactive-map", InteractiveMap);
customElements.define("lg-tools", LGtools);
customElements.define("home-page", Home);
customElements.define("lg-settings", Settings);
if (!customElements.get("lg-voice")) {
    customElements.define("lg-voice", LGVoice);
}
  
changeTabs();
pageObserver();
