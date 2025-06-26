export class ApiKeysForm extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      const container = document.createElement("div");
      container.innerHTML = `
        <form id="api-key-form">
          <md-filled-text-field id="gemmaApiKey" required label="Gemini API Key" value="" type="password">
            <md-icon-button id="toggle-gemma" aria-label="toggle gemma visibility" toggle slot="trailing-icon" type="button">
              <md-icon>visibility</md-icon>
              <md-icon slot="selected">visibility_off</md-icon>
            </md-icon-button>
          </md-filled-text-field>
  
          <md-filled-text-field id="openCageApiKey" required label="OpenCage API Key" value="" type="password">
            <md-icon-button id="toggle-opencage" aria-label="toggle openCage visibility" toggle slot="trailing-icon" type="button">
              <md-icon>visibility</md-icon>
              <md-icon slot="selected">visibility_off</md-icon>
            </md-icon-button>
          </md-filled-text-field>
  
          <md-filled-text-field id="freesoundApiKey" required label="Freesound API Key" value="" type="password">
            <md-icon-button id="toggle-freesound" aria-label="toggle freesound visibility" toggle slot="trailing-icon" type="button">
              <md-icon>visibility</md-icon>
              <md-icon slot="selected">visibility_off</md-icon>
            </md-icon-button>
          </md-filled-text-field>
  
          <md-filled-button id="saveApiKeysButton">Save API Keys</md-filled-button>
        </form>
      `;
  
      const style = document.createElement("style");
      style.textContent = `
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-block-end: 25px;
        }
        md-filled-button {
          inline-size: 100%;
        }
      `;
  
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(container);
  
      this.shadowRoot
        .getElementById("saveApiKeysButton")
        .addEventListener("click", (e) => {
          e.preventDefault();
          this.saveApiKeys();
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
  
      this.loadApiKeys();
    }
  
    saveApiKeys() {
      const gemmaKey = this.shadowRoot.getElementById("gemmaApiKey").value;
      const openCageKey = this.shadowRoot.getElementById("openCageApiKey").value;
      const freesoundKey = this.shadowRoot.getElementById("freesoundApiKey").value;
  
      if (!gemmaKey || !openCageKey || !freesoundKey) {
        this.dispatchEvent(new CustomEvent("toast", { detail: "Please fill in all API key fields!" }));
        return;
      }
  
      localStorage.setItem("gemmaApiKey", gemmaKey);
      localStorage.setItem("openCageApiKey", openCageKey);
      localStorage.setItem("freesoundApiKey", freesoundKey);
  
      this.dispatchEvent(new CustomEvent("toast", { detail: "API Keys saved successfully!" }));
    }
  
    loadApiKeys() {
      this.shadowRoot.getElementById("gemmaApiKey").value =
        localStorage.getItem("gemmaApiKey") || "";
      this.shadowRoot.getElementById("openCageApiKey").value =
        localStorage.getItem("openCageApiKey") || "";
      this.shadowRoot.getElementById("freesoundApiKey").value =
        localStorage.getItem("freesoundApiKey") || "";
    }
  }
  
  customElements.define("api-keys-form", ApiKeysForm);
  