const ENDPOINT_CLEAN_BALLOON = "/api/lg-connection/clean-balloon";
const ENDPOINT_SHOW_BALLOON = "/api/lg-connection/show-balloon";
let kml = "";

const getBalloonKML = async () => {
  const res = await fetch(
    "https://yashrajbharti.github.io/lg-web/assets/Balloon.kml"
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

export const showballoon = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, screens } = configs;
    
    const kml = await getBalloonKML();  // Get the KML

    const response = await fetch(server + ENDPOINT_SHOW_BALLOON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password, screens, kml }),
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
