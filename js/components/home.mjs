import { checkConnection } from "../api/checkconnection.mjs";
import { sendkml } from "../api/sendkml.mjs";
import { showballoon } from "../api/balloon.mjs";
import { flytoview } from "../api/flytoview.mjs";

export class Home extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            p {
                color: var(--md-sys-color-primary);
            }
            .animate .google {
                animation: reveal 1.2s ease 1 forwards;
                transform-origin: 52px 28px;
            }

            @keyframes reveal {
                to{
                    rotate: 0deg
                }
            }

            .animate .google:nth-last-of-type(1) {
                rotate: -215deg;
            }
            .animate .google:nth-last-of-type(2) {
                rotate: -155deg;
            }
            .animate .google:nth-last-of-type(3) {
                animation-delay: 60ms;
                rotate: -55deg;
            }

            .animate .line {
                animation: scale 1.2s ease 1 forwards;
            }
            .animate .line:nth-of-type(1) {
                scale: 1 0;
                transform-origin: 0px 40px;
            }
            .animate .line:nth-of-type(2) { 
                scale: 0 1;
                transform-origin: 11px -11px;
            }

            @keyframes scale {
                to {
                    scale: 1;
                }
            }
            div {
                display: flex;
                block-size: 100dvh;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 25px;
            }
            md-elevated-button {
                inline-size: 200px;
                padding: 10px 20px;
            }
            md-icon.disconnect {
                filter: hue-rotate(110deg);
            }
        </style>
        <div>
            <img class="animate" src="/assets/GeoVisionAI-2.png" alt="My Logo" width="350" height="350">
            <p>Status: <md-assist-chip label="Not Connected"><md-icon class="disconnect" slot="icon">close</md-icon></md-assist-chip></p>
            <md-elevated-button>Send KML</md-elevated-button>
        </div>
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const animateAttribute = this.getAttribute("animate");

    if (animateAttribute === "true") {
      this.shadowRoot.querySelector("svg").classList.add("animate");
    }
    this.checkConnectionStatus();
  }
  static get observedAttributes() {
    return ["active"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active") {
      if (newValue === "true") {
        this.shadowRoot.querySelector("svg").classList.add("animate");
        this.checkConnectionStatus();
      } else {
        this.shadowRoot.querySelector("svg").classList.remove("animate");
      }
    }
  }

  connectedCallback() {
    const button = this.shadowRoot.querySelector("md-elevated-button");
    button.addEventListener("click", async () => {
      await flytoview(34.07022, -118.54453, 10);
      await sendkml();
      await showballoon();
    });
  }

  async checkConnectionStatus() {
    const chip = this.shadowRoot.querySelector("md-assist-chip");
    const icon = chip.querySelector("md-icon");
    if (await checkConnection()) {
      chip.setAttribute("label", "Connected");
      icon.classList.remove("disconnect");
      icon.textContent = "check";
    } else {
      chip.setAttribute("label", "Not Connected");
      icon.classList.add("disconnect");
      icon.textContent = "close";
    }
  }
}
