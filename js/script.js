import { Home } from "./components/home.mjs";
import { Settings } from "./components/settings.mjs";
import { LGtools } from "./components/tools.mjs";
import { LGVoice } from "./components/voice.mjs";
import { About } from "./components/about.mjs"; 
import { SampleQueriesTab } from "./components/sample-queries-tab.mjs";

customElements.define("lg-tools", LGtools);
customElements.define("home-page", Home);
customElements.define("lg-settings", Settings);
if (!customElements.get("lg-voice")) {
    customElements.define("lg-voice", LGVoice);
  }
if (!customElements.get("lg-about")) { 
    customElements.define("lg-about", About);
}
if (!customElements.get("sample-queries-tab")){
    customElements.define("sample-queries-tab", SampleQueriesTab);
}

changeTabs();
