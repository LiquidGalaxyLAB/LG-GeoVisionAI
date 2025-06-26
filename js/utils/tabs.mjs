import { indexMap } from "./indexmap.mjs";
import { scrollToPage } from "./scrollTo.mjs";

export const changeTabs = () => {
  const tabs = document.querySelector("md-tabs");

  tabs.addEventListener("change", (event) => {
    if (event.target.activeTabIndex === 0) {
      document?.querySelector("home-page")?.setAttribute("active", "true");
    } else {
      document?.querySelector("home-page")?.setAttribute("active", "false");
    }
    if (event.target.activeTabIndex === 1) {
      document?.querySelector("lg-voice")?.setAttribute("active", "true");
    } else {
      document?.querySelector("lg-voice")?.setAttribute("active", "false");
    }
    if (event.target.activeTabIndex === 3) {
      document?.querySelector("lg-tools")?.setAttribute("active", "true");
    } else {
      document?.querySelector("lg-tools")?.setAttribute("active", "false");
    }
    if (event.target.activeTabIndex === 4) {
      document?.querySelector("lg-settings")?.setAttribute("active", "true");
    } else {
      document?.querySelector("lg-settings")?.setAttribute("active", "false");
    }
    if (event.target.activeTabIndex === 5) {
      document?.querySelector("lg-about")?.setAttribute("active", "true");
    } else {
      document?.querySelector("lg-about")?.setAttribute("active", "false");
    }
  });

  tabs.addEventListener("click", (event) => {
    switch (indexMap.get(event.target.dataset.tab)) {
      case 0:
        scrollToPage("home");
        break;
      case 1:
        scrollToPage("voice");
        break;
      case 2:
        scrollToPage("tools");
        break;
      case 3:
        scrollToPage("settings");
        break;
      case 4:
        scrollToPage("about");
        break;
      default:
        console.error("page doesn't exist");
    }
  });
};
