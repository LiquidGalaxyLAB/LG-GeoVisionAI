import { checkConnection } from "../api/checkconnection.mjs";
import { connecttolg } from "../api/connect.mjs";
import { showlogo } from "../api/logo.mjs";
import { ApiKeysForm } from "./saveapikeys.mjs";

import QrScanner from "../utils/qrscanner.js";

export class Settings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.classList.add("container");

    container.innerHTML = `
        <p>Status: <md-assist-chip label="Not Connected"><md-icon class="disconnect" slot="icon">close</md-icon></md-assist-chip></p>
        <api-keys-form></api-keys-form>
          
            <md-filled-tonal-button id="scan-qr">Scan QR to Connect to LG</md-filled-tonal-button>
            <p class="divider"><span>OR<span><p>
        
          <form class="connect">
            <md-filled-text-field id="server" required label="Server Address" value=""></md-filled-text-field>
            <md-filled-text-field id="username" required label="Username" value=""></md-filled-text-field>
            <md-filled-text-field id="ip" required label="IP Address" value=""></md-filled-text-field>
            <md-filled-text-field id="port" required label="Port Number" value="" type="number" no-spinner></md-filled-text-field>
            <md-filled-text-field id="password" required label="Password" value="" type="password">
            <md-icon-button id="toggle-password" aria-label="toggle password visibility" toggle slot="trailing-icon" type="button">
              <md-icon>visibility</md-icon>
              <md-icon slot="selected">visibility_off</md-icon>
            </md-icon-button>
            </md-filled-text-field>
              <md-filled-text-field id="screens" label="Number of Screens" value="" type="number" no-spinner></md-filled-text-field>
              <md-filled-button type="submit">Connect to LG</md-filled-button>
          </form>
        <video hidden></video>
        <div class="icon-button">
            <md-filled-tonal-icon-button>
                <md-icon>arrow_back</md-icon>
            </md-filled-tonal-icon-button>
        </div>
        <svg class="scan-region-highlight-svg" width="200" height="200" viewBox="0 0 238 238" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_80_2)">
                <path d="M236 207V228C236 230.122 235.157 232.157 233.657 233.657C232.157 235.157 230.122 236 228 236H207" stroke="var(--md-sys-color-primary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M31 236H10C7.87827 236 5.84344 235.157 4.34315 233.657C2.84285 232.157 2 230.122 2 228V207" stroke="var(--md-sys-color-secondary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M207 2H228C230.122 2 232.157 2.84285 233.657 4.34315C235.157 5.84344 236 7.87827 236 10V31" stroke="var(--md-sys-color-tertiary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M32 2H11C8.87827 2 6.84344 2.84285 5.34315 4.34315C3.84285 5.84344 3 7.87827 3 10V31" stroke="var(--md-sys-color-on-surface)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="4" y1="118" x2="233" y2="118" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round"/>
                </g>
                <defs>
                <clipPath id="clip0_80_2">
                <rect width="238" height="238" fill="white"/>
                </clipPath>
                </defs>
        </svg>
        <p class="message"></p>
        `;

    const style = document.createElement("style");
    style.textContent = `
            p {
                color: var(--md-sys-color-primary);
            }
            md-icon.disconnect {
                filter: hue-rotate(110deg);
            }
            .container {
                padding: 20px;
                margin-block-start: 15px;
            }
            form {
                margin-block-start: 25px;
                margin-block-end: 55px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .divider {
                position: relative;
                text-align: center;
            }
            .divider::after {
                position: absolute;
                content: "";
                inline-size: 100%;
                block-size: 1px;
                background-color: var(--md-sys-color-outline);
                inset-inline-start: 0;
                inset-block-start: 1ch;
                z-index: -1;
            }
            .divider span {
                display: inline-block;
                background-color: var(--md-sys-color-background);
                
            }
            md-filled-button {
                inline-size: 100%;
                margin-block: 10px;
            }
            md-filled-tonal-button{
            inline-size: 100%;
            margin-block: 10px;
            }
            
            .icon-button {
                position: fixed;
                display: none;
                inset-inline-start: 20px;
                inset-block-start: 20px;
                z-index: 2;
            }
            video {
                inline-size: 100%;
                block-size: 100dvh;
                object-fit: cover;
                opacity: 1;
                transform: scaleX(1);
                position: fixed;
                inset-block-start: 0;
                inset-inline-start: 0;
                z-index: 1;
                background-color: var(--md-sys-color-background);
            }
            .scan-region-highlight-svg {
                display: none;
                z-index: 2;
                position: fixed;
                inset-block-start: 50%;
                inset-inline-start: 50%;
                translate: -50% -50%;
            }
            line {
                animation: scan 0.8s ease-in-out alternate infinite;
            }
            @keyframes scan {
                0% {
                    translate: 0 -100px;
                }
                100% {
                    translate: 0 100px;
                }
            }
            .message {
                position: fixed;
                inset-inline-end: 20px;
                inset-block-end: 80px;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 999;
                box-shadow: var(--md-sys-color-shadow);
                background-color: var(--md-sys-color-surface-container);
            }
            .message:empty{
                display: none;
            }
          `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
    const apiKeyComponent = this.shadowRoot.querySelector("api-keys-form");
    apiKeyComponent.addEventListener("toast", (e) => {
      this.showToast(e.detail);
    });


    this.loadConfig();

    this.shadowRoot.querySelector("form.connect").addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveConfig();
    });

    this.shadowRoot
      .querySelector("md-icon-button")
      .addEventListener("click", () => {
        const passwordField = this.shadowRoot.getElementById("password");
        if (passwordField.getAttribute("type") === "text")
          passwordField.setAttribute("type", "password");
        else passwordField.setAttribute("type", "text");
      });
      ["toggle-gemma", "toggle-opencage", "toggle-freesound"].forEach((btnId) => {
        const btn = this.shadowRoot.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", () => {
            const field = btn.closest("md-filled-text-field");
            const input = field.shadowRoot.querySelector("input");
            input.type = input.type === "text" ? "password" : "text";
          });
        }
      });

    this.shadowRoot
      .getElementById("scan-qr")
      .addEventListener("click", () => this.startQrScanner());
  }

  static get observedAttributes() {
    return ["active"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active") {
      if (newValue === "true") {
        this.checkConnectionStatus();
      } else {
        this.shadowRoot.querySelector("md-filled-tonal-icon-button").click();
      }
    }
  }

  async checkConnectionStatus(isConnected = undefined) {
    const chip = this.shadowRoot.querySelector("md-assist-chip");
    const icon = chip.querySelector("md-icon");
    if (isConnected ?? (await checkConnection())) {
      chip.setAttribute("label", "Connected");
      icon.classList.remove("disconnect");
      icon.textContent = "check";
    } else {
      chip.setAttribute("label", "Not Connected");
      icon.classList.add("disconnect");
      icon.textContent = "close";
    }
  }
  async saveConfig() { 
    const server = this.shadowRoot.getElementById("server").value;
    const username = this.shadowRoot.getElementById("username").value;
    const ip = this.shadowRoot.getElementById("ip").value;
    const port = this.shadowRoot.getElementById("port").value;
    const password = this.shadowRoot.getElementById("password").value;
    const screens = this.shadowRoot.getElementById("screens").value;
    //const gemmaKey = localStorage.getItem("gemmaApiKey") || "";
    //const openCageKey = localStorage.getItem("openCageApiKey") || "";
    //const freesoundKey = localStorage.getItem("freesoundApiKey") || "";

    const config = {
      server,
      username,
      ip,
      port,
      password,
      screens
    //  gemmaKey,
    //  openCageKey,
    //  freesoundKey
    };

    localStorage.setItem("lgconfigs", JSON.stringify(config));
    const isConnected = await connecttolg();
    if (isConnected) {
      this.showToast("Connected to LG!");
      setTimeout(() => {
        showlogo();
      }, 3000);
    } else {
      this.showToast("Cannot establish a connection to LG");
    }
    this.checkConnectionStatus(isConnected);
  }

  loadConfig() {
    const savedConfig = localStorage.getItem("lgconfigs");
    if (savedConfig) {
      const config = JSON.parse(savedConfig);

      this.shadowRoot.getElementById("username").value = config.username || "";
      this.shadowRoot.getElementById("ip").value = config.ip || "";
      this.shadowRoot.getElementById("port").value = config.port || "";
      this.shadowRoot.getElementById("password").value = config.password || "";
      this.shadowRoot.getElementById("screens").value = config.screens || "";
      this.shadowRoot.getElementById("server").value = config?.server || "";
    }
  }
  

  showToast(message) {
    const toast = this.shadowRoot.querySelector(".message");
    toast.textContent = message;
    setTimeout(() => {
      toast.textContent = "";
    }, 5000);
  }

  startQrScanner() {
    const qrVideo = this.shadowRoot.querySelector("video");
    const scannerSVG = this.shadowRoot.querySelector(
      ".scan-region-highlight-svg"
    );
    const backArrowContainer = this.shadowRoot.querySelector(".icon-button");
    const backButton = this.shadowRoot.querySelector(
      "md-filled-tonal-icon-button"
    );
    qrVideo?.removeAttribute("hidden");
    scannerSVG.style.display = "block";

    const scanner = new QrScanner(
      qrVideo,
      async (result) => {
        // {"server": "https://192.168.194.198:5500", "username": "lg", "ip": "192.168.29.124", "port": "2222", "password": "lg", "screens": "5" }
        scanner.stop();
        qrVideo?.setAttribute("hidden", "");
        scannerSVG.style.display = "none";
        backArrowContainer.style.display = "none";
        try {
          const config = JSON.parse(result.data.trim());
          const existingSettings = JSON.parse(
            localStorage.getItem("lgconfigs") || "{}"
          );
          if (config.server) {
            config.server = config.server.replace(/\/+$/, ""); // Remove slashes at the end
          }
          const updatedSettings = { ...existingSettings, ...config };
        
          localStorage.setItem("lgconfigs", JSON.stringify(updatedSettings));
        
          this.loadConfig();
        
          if (updatedSettings.username) {
            const isConnected = await connecttolg();
            this.checkConnectionStatus(isConnected);
          }
        } catch {
          this.showToast("Your QR code was not valid!");
        }
      },
      {
        onDecodeError: (error) => console.error("QR scanning error:", error),
      }
    );
    backButton.addEventListener("click", () => {
      scanner.stop();
      qrVideo?.setAttribute("hidden", "");
      scannerSVG.style.display = "none";
      backArrowContainer.style.display = "none";
    });

    scanner
      .start()
      .then(() => {
        backArrowContainer.style.display = "block";
      })
      .catch((err) => {
        console.error("Failed to start QR scanner:", err);
      });
  }
}
