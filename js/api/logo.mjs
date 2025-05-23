const ENDPOINT_CLEAN_LOGO = "/api/lg-connection/clean-logos";
const ENDPOINT_SHOW_LOGO = "/api/lg-connection/show-logo";
const kml = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom"><Document>	<name>LG Web</name>	<open>1</open>	<description>The logo it located in the bottom left hand corner</description>	<Folder>		<name>tags</name>		<Style>			<ListStyle>				<listItemType>checkHideChildren</listItemType>				<bgColor>00ffffff</bgColor>				<maxSnippetLines>2</maxSnippetLines>			</ListStyle>		</Style>		<ScreenOverlay id="abc">			<name>LG Web</name>			<Icon>				<href>https://yashrajbharti.github.io/lg-web/assets/Logo.jpg</href>			</Icon>			<overlayXY x="0" y="1" xunits="fraction" yunits="fraction"/>			<screenXY x="0" y="0.98" xunits="fraction" yunits="fraction"/>			<rotationXY x="0" y="0" xunits="fraction" yunits="fraction"/>			<size x="0" y="0" xunits="pixels" yunits="fraction"/>		</ScreenOverlay>	</Folder></Document></kml>`;

export const cleanlogo = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, screens } = configs;

    const response = await fetch(server + ENDPOINT_CLEAN_LOGO, {
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

export const showlogo = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, screens } = configs;

    const response = await fetch(server + ENDPOINT_SHOW_LOGO, {
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
