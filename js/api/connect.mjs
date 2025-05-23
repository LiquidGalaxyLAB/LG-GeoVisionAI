const ENDPOINT = "/api/lg-connection/connect-lg";

export const connecttolg = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password } = configs;

    const response = await fetch(server + ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Success:", result.message, result.data);
      return true;
    } else {
      console.error("Error:", result.message, result.stack);
      return false;
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    return false;
  }
};
