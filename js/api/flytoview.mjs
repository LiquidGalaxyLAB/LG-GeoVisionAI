const ENDPOINT = "/api/lg-connection/flyto";
export const flytoview = async (
  latitude,
  longitude,
  zoom = 10,
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

    
    const safeElevation = (zoom) => {
      const levels = {
        4: 3000000,
        5: 1500000,
        6: 800000,
        7: 400000,
        8: 200000,
        9: 100000,
        10: 50000,
        11: 30000,
        12: 15000,
        13: 10000,
        14: 5000,
        15: 3000,
        16: 1500,
        17: 1000,
        18: 500,
        19: 300,
        20: 100
      };
      return levels[zoom] || 100000;
    };
    
    const elevation = safeElevation(zoom);
    
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