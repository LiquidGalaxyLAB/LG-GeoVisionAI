const ENDPOINT = "/api/lg-connection/send-kml";
const filename = "Fire";

const getKML = async () => {
  const res = await fetch(
    "https://yashrajbharti.github.io/lg-web/assets/Fire.kml"
  );
  return await res.text();
};

export const sendkml = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password } = configs;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("ip", ip);
    formData.append("port", port);
    formData.append("password", password);
    formData.append("filename", filename);

    const kml = await getKML();

    const kmlContent = kml;
    const kmlFileAsTxt = new File([kmlContent], "Fire.txt", {
      type: "text/plain",
    });
    formData.append("file", kmlFileAsTxt);

    const response = await fetch(server + ENDPOINT, {
      method: "POST",
      body: formData,
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
