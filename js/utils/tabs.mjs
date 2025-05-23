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
    if (event.target.activeTabIndex === 4) {
      document?.querySelector("lg-settings")?.setAttribute("active", "true");
    } else {
      document?.querySelector("lg-settings")?.setAttribute("active", "false");
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
        scrollToPage("maps");
        break;
      case 3:
        scrollToPage("tools");
        break;
      case 4:
        scrollToPage("settings");
        break;
      default:
        console.error("page doesn't exist");
    }
  });
};
