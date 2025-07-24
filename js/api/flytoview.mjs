const ENDPOINT = "/api/lg-connection/flyto";
export const flytoview = async (
  latitude,
  longitude,
  zoom = 20,
  tilt = 41.82725143432617,
  bearing = 61.403038024902344
) => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));

    if (!configs || !configs.server || !configs.username || !configs.ip || !configs.port || !configs.password) {
      console.error("Missing Liquid Galaxy configuration in localStorage.");
      return;
    }

    const { server, username, ip, port, password, screens = 3 } = configs;
    
    const elevation = 591657550.5 / Math.pow(2, zoom) / screens;
    
    console.log("[flytoview] Params:", { latitude, longitude, zoom, tilt, bearing, elevation });

    const response = await fetch(server + ENDPOINT, {
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
      console.log("FlyTo Success:", result.message, result.data);
    } else {
      console.error("FlyTo Error:", result.message, result.stack);
    }
  } catch (error) {
    console.error("FlyTo Unexpected Error:", error);
  }
};

window.flytoview = flytoview; 