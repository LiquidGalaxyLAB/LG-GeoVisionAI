const ENDPOINT_CLEAN_BALLOON = "/api/lg-connection/clean-balloon";
const ENDPOINT_SHOW_BALLOON = "/api/lg-connection/show-balloon";
let kml = "";

const getBalloonKML = async () => {
  const res = await fetch(
    "/assets/samplekml1.kml"
  );
  return await res.text();
};

export const cleanballoon = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, screens } = configs;

    const response = await fetch(server + ENDPOINT_CLEAN_BALLOON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password, screens }),
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

export const showballoon = async (customKML = null) => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, screens } = configs;

    const kml = customKML || await getBalloonKML();  // Use the custom KML if there

    const response = await fetch(server + ENDPOINT_SHOW_BALLOON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password, screens, kml }),
    });

    const contentType = response.headers.get("Content-Type");

    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();  
      console.error("Server did not return JSON:", errorText);
      return;
    }

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


