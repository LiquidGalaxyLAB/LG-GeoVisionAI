export const getFeatures = async () => {
    const data = await fetch(
      "https://yashrajbharti.github.io/lg-web/assets/Fire.geojson"
    );
    const result = await data.json();
    return result;
  };
  