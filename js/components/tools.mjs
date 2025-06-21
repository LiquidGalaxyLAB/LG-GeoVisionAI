import { cleankml } from "../api/cleankml.mjs";
import { cleanlogo } from "../api/logo.mjs";
import { cleanballoon } from "../api/balloon.mjs";
import { reboot } from "../api/reboot.mjs";
import { relaunch } from "../api/relaunch.mjs";
import { shutdown } from "../api/shutdown.mjs";

export class LGtools extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.classList.add("container");

    container.innerHTML = `
      <div class="button-wrapper">
          <md-filled-button data-action="clean-logo"> Clean Logo </md-filled-button>
          <md-filled-button data-action="clean-kml"> Clean KML </md-filled-button>
          <md-filled-button data-action="relaunch-lg"> Relaunch LG </md-filled-button>
          <md-filled-button data-action="reboot-lg"> Reboot LG </md-filled-button>
          <md-filled-button data-action="shutdown-lg"> Shutdown LG </md-filled-button>
      </div>
      <md-dialog>
          <form slot="content" id="form-id" method="dialog">Are you sure you want to perform this action?</form>
          <div slot="actions">
              <md-text-button form="form-id" value="cancel">Cancel</md-text-button>
              <md-filled-button form="form-id" value="yes">Proceed</md-filled-button>
          </div>
      </md-dialog>
      `;

    const style = document.createElement("style");
    style.textContent = `
          .container {
              block-size: calc(100dvh - 80px);
              margin: auto;
              display: grid;
              align-items: center;
          }
          .button-wrapper {
              block-size: max-content;
              display: grid;
              gap: 15px;
              justify-content: center;
              align-items: center;
              padding: 30px;
          }
          md-filled-button {
              padding: 40px;
              font-size: 20px;
              max-inline-size: 500px;
              min-inline-size: 200px;
              --md-filled-button-container-color: var(--md-sys-color-primary); /* For the button's background */
              --md-filled-button-label-text-color: var(--md-sys-color-on-primary); /* For the text color */

              /* It's also good practice to include other themed states for completeness */
              --md-filled-button-container-shape: 20px; /* Consistent rounding */
              --md-filled-button-label-text-font: "Roboto", sans-serif;
              --md-filled-button-label-text-weight: 500;
          }
          
        `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }

  connectedCallback() {
    const buttons = this.shadowRoot.querySelectorAll("md-filled-button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action");
        this.handleAction(action);
      });
    });
  }

  handleAction(action) {
    switch (action) {
      case "clean-logo":
        cleanlogo();
        break;
      case "clean-kml":
        cleankml();
        cleanballoon();
        break;
      case "relaunch-lg":
        this.activateDialog(
          "Are you sure you want to relaunch the liquid galaxy?",
          relaunch
        );
        break;
      case "reboot-lg":
        this.activateDialog(
          "Are you sure you want to reboot the liquid galaxy?",
          reboot
        );
        break;
      case "shutdown-lg":
        this.activateDialog(
          "Are you sure you want to shut down the liquid galaxy?",
          shutdown
        );
        break;
      default:
        console.log("Unknown action.");
    }
  }
  activateDialog(content, action) {
    const dialog = this.shadowRoot.querySelector("md-dialog");
    dialog.querySelector("form").textContent = content;
    dialog.open = true;
    const _button = dialog.querySelector("md-filled-button");
    _button.addEventListener("click", action);
  }
}
