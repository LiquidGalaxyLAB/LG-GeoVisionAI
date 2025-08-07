import { exportprocessQueryExternally } from "./voice.mjs";
import "./voice.mjs";

export class SampleQueriesTab extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .container {
          block-size: calc(100dvh - 80px);
          margin: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 20px;
          padding-block-end: 200px;
        }

        p {
            color: var(--md-sys-color-primary);
            font-size: 1.5rem;
            font-weight: bold;
        }

        .sample-buttons {
          margin-top: 20px;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          inline-size: 100%;
          max-inline-size: 600px;
        }

        .sample-buttons md-filled-tonal-button {
          inline-size: 100%;
        }

        .back-button {
          margin-top: 20px;
          inline-size: 100%;
          max-inline-size: 600px;
        }
      </style>

      <div class="container">
        <p>Sample Queries</p>
        <div class="sample-buttons">
          <md-filled-tonal-button id="query1">How has Mumbai's temprature changed in 50 years?</md-filled-tonal-button>
          <md-filled-tonal-button id="query2">Which is the hottest desert on Earth?</md-filled-tonal-button>
          <md-filled-tonal-button id="query3">Take me to the Himalayas.</md-filled-tonal-button>
          <md-filled-tonal-button id="query4">Tell me about rising sea levels in Indian Ocean.</md-filled-tonal-button>
          <md-filled-tonal-button id="query5">Tell me a fun fact about Great Barrier Reef.</md-filled-tonal-button>
          <md-filled-tonal-button id="query6">Tell me about deforestation in the Amazon.</md-filled-tonal-button>
          <md-filled-tonal-button id="query7">Tell me a fun fact about Sahara desert</md-filled-tonal-button>
          <md-filled-tonal-button id="query8">Send me to Pacific Ocean.</md-filled-tonal-button>
          <md-filled-tonal-button id="query9">What is the capital of Japan?</md-filled-tonal-button>
          <md-filled-tonal-button id="query10">Take me to Mount Everest.</md-filled-tonal-button>

        </div>
        <md-filled-button class="back-button">Back to Home</md-filled-button>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const backBtn = this.shadowRoot.querySelector(".back-button");
    backBtn.addEventListener("click", () => {
      document.querySelector('md-primary-tab[data-tab="home"]')?.click();
    });

    const query1button = this.shadowRoot.getElementById("query1");
    query1button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("How has Mumbai's temprature changed in 50 years? Answer in 2 lines");
    });

    const query2button = this.shadowRoot.getElementById("query2");
    query2button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("Which is the hottest desert on Earth?");
    });

    const query3button = this.shadowRoot.getElementById("query3");
    query3button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("Take me to Himalayas");
    });

    const query4button = this.shadowRoot.getElementById("query4");
    query4button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("Tell me about rising sea levels in Indian Ocean. Answer in 2 lines");
    });

    const query5button = this.shadowRoot.getElementById("query5");
    query5button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("Tell me a fun fact about Great Barrier Reef. Answer in 2 lines");
    });

    const query6button = this.shadowRoot.getElementById("query6");
    query6button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("Tell me about deforestation in the Amazon Rainforest. Answer in 3 lines");
    });

    const query7button = this.shadowRoot.getElementById("query7");
    query7button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("Tell me a fun fact about Sahara Desert. Answer in 2 lines");
    });

    const query8button = this.shadowRoot.getElementById("query8");
    query8button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("Send me to Pacific Ocean");
    });

    const query9button = this.shadowRoot.getElementById("query9");
    query9button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("What is the capital of japan?");
    });

    const query10button = this.shadowRoot.getElementById("query10");
    query10button.addEventListener("click", async () => {
      const geminiTab = document.querySelector('md-primary-tab[data-tab="voice"]');
      if (geminiTab) {
        geminiTab.click();
      } else {
        console.error("Gemini tab not found");
      }
      await exportprocessQueryExternally("Take me to Mount Everest");
    });
  }
}

customElements.define("sample-queries-tab", SampleQueriesTab);

