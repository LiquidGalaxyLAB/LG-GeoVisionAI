import { cleankml} from "./cleankml.mjs";
import { sendkml } from "./sendkml.mjs";

const ENDPOINT_START_ORBIT = "/api/lg-connection/start-orbit";
const ENDPOINT_STOP_ORBIT = "/api/lg-connection/stop-orbit";

export const startOrbit = async (
  latitude,
  longitude,
  zoom,
  tilt = 0,
  bearing = 0
) => {
  console.log(`Starting orbit at ${latitude}, ${longitude} with altitude ${zoom}`);
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, screens } = configs;

    const elevation = 591657550.5 / Math.pow(2, zoom) / screens;
    

    await cleankml();
    sendkml("playtour=Orbit");

    const response = await fetch(server + ENDPOINT_START_ORBIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        ip,
        port,
        password,
        latitude,
        longitude,
        elevation,
        tilt,
        bearing,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Success:", result.message, result.data);
    } else {
      console.error("Error:", result.message, result.stack);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
};

export const stopOrbit = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password } = configs;

    const response = await fetch(server + ENDPOINT_STOP_ORBIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Success:", result.message, result.data);
    } else {
      console.error("Error:", result.message, result.stack);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
};
