import { indexMap } from "./indexmap.mjs";
const tabs = document.querySelector("md-tabs");

export const pageObserver = () => {
  const sections = document.querySelectorAll("section");
  const options = {
    root: null,
    threshold: 0.5,
  };

  let isObserving = true;

  const observer = new IntersectionObserver((entries) => {
    if (!isObserving) return;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeTabIndex = indexMap.get(entry.target.id);
        tabs.activeTabIndex = activeTabIndex;
      }
    });
  }, options);

  const startObserving = () => {
    isObserving = true;
    sections.forEach((section) => observer.observe(section));
  };

  const stopObserving = () => {
    isObserving = false;
    observer.disconnect();
  };

  tabs.addEventListener("click", () => {
    stopObserving();
    setTimeout(startObserving, 500);
  });

  startObserving();

  return observer;
};
