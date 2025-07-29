import { cleankml } from "./cleankml.mjs";
import { cleanlogo } from "./logo.mjs";
import { cleanballoon } from "./balloon.mjs";
const ENDPOINT = "/api/lg-connection/relaunch-lg";

export const relaunch = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, screens } = configs;

    const response = await fetch(server + ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password, screens }),
      
    });

    //cleankml();
    //cleanlogo();
    const result = await response.json();
    
    cleanballoon();
    
    if (response.ok) {
      console.log("Success:", result.message, result.data);
    } else {
      console.error("Error:", result.message, result.stack);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
};
