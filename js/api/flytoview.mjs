const ENDPOINT = "/api/lg-connection/flyto";

export const flytoview = async (
  latitude,
  longitude,
  zoom,
  tilt = 41.82725143432617,
  bearing = 61.403038024902344
) => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, screens } = configs;

    const elevation = 591657550.5 / Math.pow(2, zoom) / screens;

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
      console.log("Success:", result.message, result.data);
    } else {
      console.error("Error:", result.message, result.stack);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
};
