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
                block-size: 80dvh;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0px;
                padding-top: 100px;
                padding-bottom: 0px;
                padding-block-end: 100px;
            }
            md-elevated-button {
                inline-size: 200px;
                padding: 10px 10px;
            }
            md-icon.disconnect {
                filter: hue-rotate(110deg);
            }

            .sample-buttons {
              margin-top: 20px;
              padding: 16px;
              border-radius: 12px;
              display: flex;
              flex-direction: column;
              gap: 10px;
            }

            .sample-buttons md-filled-tonal-button {
              flex: 1;
              inline-size: 100%;
            }

            .marquee-container {
              margin-bottom: 10px; 
              margin-top: 5px; 
            }

            .marquee {
              margin: 0;
              padding-bottom: 0;
              padding-top: 0;
            }

            @keyframes scroll {
              from {
                transform: translateX(100%); 
              }
              to {
                transform: translateX(-100%); 
              }
            }

        </style>
        <div>
            <img class="animate" src="/assets/2.webp" alt="My Logo" width="350" height="350">
            <p>Status: <md-assist-chip label="Not Connected"><md-icon class="disconnect" slot="icon">close</md-icon></md-assist-chip></p>
            <md-elevated-button>Have a Question?</md-elevated-button>
            
            <div class="sample-buttons">
              <p>Sample Queries:</p>
              <md-filled-tonal-button id="sampleKML1">What is the capital of the USA?</md-filled-tonal-button>
              <md-filled-tonal-button id="sampleKML2">Tell me about rising sea levels in Maldives.</md-filled-tonal-button>
              <md-filled-tonal-button id="sampleKML3">How has Mumbai's coastline changed in 50 years?</md-filled-tonal-button>
              </div>
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
        this.shadowRoot.querySelector("img").classList.add("animate");
        this.checkConnectionStatus();
      } else {
        this.shadowRoot.querySelector("img").classList.remove("animate");
      }
    }
  }

  connectedCallback() {
    const button = this.shadowRoot.querySelector("md-elevated-button");
  
    button.addEventListener("click", () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click(); 
      } else {
        console.error("Gemini tab not found");
      }
    });
    
    const sampleKML1Button = this.shadowRoot.getElementById("sampleKML1");
    sampleKML1Button.addEventListener("click", async () => {
      await flytoview(38.8950368,-77.0365427,10);
      await sendkml();
      speakText("The capital of the United States is Washington, D.C.");
      await showballoon();

    });

    const sampleKML2Button = this.shadowRoot.getElementById("sampleKML2");
    sampleKML2Button.addEventListener("click", async () => {
      await flytoview(4.1755,73.5093,10);
      await sendkml();
      speakText("The Maldives, a low-lying island nation, faces an existential threat from rising sea levels caused by climate change.  Continued sea level rise threatens to inundate islands and displace its population.");
      const customKML = await fetch('./assets/samplekml2.kml').then(res => res.text());
      await showballoon(customKML);
    });

    const sampleKML3Button = this.shadowRoot.getElementById("sampleKML3");
    sampleKML3Button.addEventListener("click", async () => {
      await flytoview(19.0760,72.8777,10);
      await sendkml();
      speakText("Over the last 50 years, Mumbai's coastline has undergone significant transformations due to land reclamation, infrastructure development, and rising sea levels.");
      const customKML = await fetch('./assets/samplekml3.kml').then(res => res.text());
      await showballoon(customKML);
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

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

