import { flytoview } from "../api/flytoview.mjs";
import { getFeatures } from "../utils/get-features.mjs";

export class InteractiveMap extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.initMap();
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
        #map {
          inline-size: 100%;
          block-size: 100dvh;
        }
        .leaflet-control-attribution.leaflet-control {
          display: none;
        }
      `;

    const mapDiv = document.createElement("div");
    mapDiv.id = "map";

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(mapDiv);
  }

  initMap() {
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet/dist/leaflet.css";
    this.shadowRoot.appendChild(leafletCSS);

    const leafletJS = document.createElement("script");
    leafletJS.src = "https://unpkg.com/leaflet/dist/leaflet.js";
    leafletJS.onload = () => this.initializeLeafletMap();
    this.shadowRoot.appendChild(leafletJS);
  }

  async initializeLeafletMap() {
    const mapContainer = this.shadowRoot.getElementById("map");

    const map = L.map(mapContainer, {
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: true,
    }).setView([34.07022, -118.54453], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
    }).addTo(map);

    const features = await getFeatures();

    const customIcon = L.icon({
      iconUrl: "https://yashrajbharti.github.io/lg-web/assets/Fire.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    L.geoJSON(features, {
      style: {
        color: "#ff0000",
        weight: 5,
        opacity: 0.65,
        radius: 8,
        fillColor: "#ffa500",
        fillOpacity: 0.5,
      },
      pointToLayer: function (_, latlng) {
        return L.marker(latlng, { icon: customIcon });
      },
    }).addTo(map);

    let idleTimeout;

    const onIdle = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      flytoview(center.lat, center.lng, zoom);
    };

    map.on("movestart", () => {
      if (idleTimeout) {
        clearTimeout(idleTimeout);
      }
    });

    map.on("moveend", () => {
      idleTimeout = setTimeout(onIdle, 1000);
    });
  }
}
