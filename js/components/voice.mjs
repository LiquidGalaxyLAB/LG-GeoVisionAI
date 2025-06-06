import { speech } from "../utils/speech.mjs";

export class LGVoice extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-block-size: 100vh;
          height: auto;
          padding-inline: 30px;
          scroll-behavior: smooth;
        }
        p {
          color: var(--md-sys-color-on-background);
          font-size: 1.2rem;
        }
        md-icon-button {
          scale: 5;
          margin-block: 80px;
          background-color: color-mix(in srgb, 95% transparent, 5% var(--md-sys-color-on-surface-variant));
          border-radius: 50%;
          cursor: pointer;
        }
        .message {
          text-align: center;
          block-size: 120px;
          inline-size: 100%;
          overflow-y: scroll;
          word-break: break-word;
          scrollbar-width: none;
          color: var(--md-sys-color-tertiary-container);
        }
        .ripple::after {
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          content: "";
          background-color: color-mix(in srgb, 95% transparent, 5% var(--md-sys-color-on-surface-variant));
          border-radius: 50%;
          z-index: -1;
          animation: ripple 0.8s ease-in-out alternate infinite;
        }
        @keyframes ripple {
          0% { inline-size: 50px; block-size: 50px; }
          25% { inline-size: 45px; block-size: 45px; }
          50% { inline-size: 40px; block-size: 40px; }
          75% { inline-size: 55px; block-size: 55px; }
          100% { inline-size: 50px; block-size: 50px; }
        }
        .ending.ripple::after {
          animation: endRipple 0.5s ease;
        }
        @keyframes endRipple {
          to { inline-size: 40px; block-size: 40px; }
        }
        .manual-input {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
          width: 100%;
          max-width: 500px;
        }
        .manual-input input {
          padding: 10px;
          font-size: 1rem;
          border-radius: 8px;
          border: 1px solid var(--md-sys-color-outline, #ccc);
          background-color: var(--md-sys-color-surface-container-high); /* Using theme colors */
          color: var(--md-sys-color-on-surface);
        }
        .manual-input input::placeholder {
            color: var(--md-sys-color-on-surface-variant);
        }
        .manual-input input:focus {
            border-color: var(--md-sys-color-primary);
            box-shadow: 0 0 0 3px rgba(179, 213, 255, 0.3);
            outline: none;
        }
        /* Style for the button inside manual-input */
        .manual-input md-filled-button {
            --md-sys-color-primary: var(--md-sys-color-primary);
            --md-sys-color-on-primary: var(--md-sys-color-on-primary);
            border-radius: 8px;
            padding: 10px 20px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.1s ease;
        }
        .manual-input md-filled-button:hover {
            background-color: var(--md-sys-color-inverse-primary);
            transform: translateY(-1px);
        }


        audio {
            margin-top: 20px;
            width: 100%;
            outline: none;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            background-color: var(--md-sys-color-surface-container-high);
            filter: invert(0.9) hue-rotate(180deg); /* Adjust for dark theme if needed */
        }

        /* Material Design Web Components specific styling */
        md-icon-button, md-filled-button {
          --md-sys-color-primary: var(--md-sys-color-primary);
          --md-sys-color-on-primary: var(--md-sys-color-on-primary);
          --md-sys-color-surface: var(--md-sys-color-surface-container-low);
          --md-sys-color-on-surface: var(--md-sys-color-on-surface);
          --md-sys-color-outline: var(--md-sys-color-outline);
          --md-sys-color-surface-variant: var(--md-sys-color-surface-container-low);
          --md-sys-color-on-surface-variant: var(--md-sys-color-on-surface-variant);
        }
      </style>

      <div class="wrapper">
        <md-icon-button id="micButton" aria-label="Microphone">
          <svg class="mic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"/>
            <path fill="#34a853" d="m11 18.08h2v3.92h-2z"/>
            <path fill="#fbbc04" d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"/>
            <path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"/>
          </svg>
        </md-icon-button>
        <p>Tap on Mic to Speak</p>
        <p class="message"></p>

        <p id="story" class="story"></p>


        <slot name="voice"></slot>

        <div class="manual-input">
          <input type="text" id="questionInput" placeholder="Or type your question here..." />
          <md-filled-button id="submitButton">Submit</md-filled-button>
        </div>
        <audio id="soundPlayer" controls hidden></audio>
      </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const micButton = this.shadowRoot.getElementById("micButton");
    const messageEl = this.shadowRoot.querySelector(".message");
    const questionInput = this.shadowRoot.getElementById("questionInput");
    const submitButton = this.shadowRoot.getElementById("submitButton");

    const voiceAnimation = document.querySelector(".googleVoice"); 

    // Added API key elements
    const saveApiKeysBtn = this.shadowRoot.getElementById("saveApiKeys");
    const gemmaInput = this.shadowRoot.getElementById("gemmaApiKey");
    const openCageInput = this.shadowRoot.getElementById("openCageApiKey");
    const freesoundInput = this.shadowRoot.getElementById("freesoundApiKey");
    const soundPlayer = this.shadowRoot.getElementById("soundPlayer");
    const apiKeyInputsDiv = this.shadowRoot.querySelector(".api-key-inputs");

    // Load saved API keys on component load
    gemmaInput.value = localStorage.getItem("gemmaApiKey") || "";
    openCageInput.value = localStorage.getItem("openCageApiKey") || "";
    freesoundInput.value = localStorage.getItem("freesoundApiKey") || "";

    // Show API key inputs only if any key is missing
    if (!gemmaInput.value || !openCageInput.value || !freesoundInput.value) {
        apiKeyInputsDiv.classList.add("show");
    }


    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Web Speech API is not supported in this browser.");
      messageEl.textContent = "Your browser does not support voice recognition.";
      // Disable mic button if no support is there
      micButton.disabled = true;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    let isRecognizing = false;

    micButton.addEventListener("click", () => {
      if (isRecognizing) {
        recognition.stop();
        isRecognizing = false;
        messageEl.textContent = "";
        removeAnimations();
      } else {
        recognition.start();
        isRecognizing = true;
        messageEl.textContent = "Start Speaking...";
        micButton.classList.add("ripple");
        voiceAnimation?.classList?.add("animate");
      }
    });

    submitButton.addEventListener("click", () => {
      const typed = questionInput.value.trim();
      if (typed !== "") {
        // Now calling processQuery for typed input
        processQuery(typed);
        questionInput.value = "";
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      // Now calling processQuery for voice input
      processQuery(transcript);
      isRecognizing = false;
      removeAnimations();
    };

    recognition.onspeechend = () => {
      recognition.stop();
      isRecognizing = false;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      messageEl.textContent = "You didn't say anything, try again.";
      isRecognizing = false;
      removeAnimations();
    };

    function removeAnimations() {
      // Add 'ending' class for the end ripple animation
      micButton.classList.add("ending");
      voiceAnimation?.classList?.add("ending");
      setTimeout(() => {
        micButton.classList.remove("ripple", "ending");
        voiceAnimation?.classList?.remove("animate", "ending");
      }, 1200); 
    }

    // --- API Integration Logic ---
    const processQuery = async (query) => {
      messageEl.textContent = "Processing your question...";
      soundPlayer.hidden = true; // Hide player while processing
      try {
        const gemmaApiKey = localStorage.getItem("gemmaApiKey");
        const openCageApiKey = localStorage.getItem("openCageApiKey");
        const freesoundApiKey = localStorage.getItem("freesoundApiKey");

        if (!gemmaApiKey || !openCageApiKey || !freesoundApiKey) {
          messageEl.textContent = "Please enter and save all API keys to proceed.";
          apiKeyInputsDiv.classList.add("show"); // Ensure API inputs are visible if keys are missing
          removeAnimations(); // Stop animations if API keys are needed
          return;
        } else {
            apiKeyInputsDiv.classList.remove("show"); // Hide inputs if keys are present
        }


        // 1. Hugging Face text generation API I'm using google/flan-t5-base as a public alternative as of now)
      messageEl.textContent = "Asking Gemma...";
      let story = "";
      try {
        const gemmaRes = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-base", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${gemmaApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: query }),
        });

        if (!gemmaRes.ok) {
          const errorText = await gemmaRes.text();
          throw new Error(`Gemma API failed: ${gemmaRes.status} - ${errorText}`);
        }

        const gemmaData = await gemmaRes.json();


        // Flan-T5 returns an array of completions with a 'generated_text' property
        story = Array.isArray(gemmaData) 

          ? gemmaData[0]?.generated_text 
          : gemmaData.generated_text || "No response from Gemma.";

        if (!story || story.trim() === "") {
          messageEl.textContent = "Gemma did not return a valid response. Please try again.";
          removeAnimations();
          return;
        }
        console.log("Story content before setting:", story);

          storyEl.textContent = story;
          console.log("Gemma response:", story);

        } catch (error) {
          console.error(error);
          messageEl.textContent = `Error: ${error.message}`;
          removeAnimations();
        }


        // 4. Speak the story
        storyEl.textContent = story;              
        console.log("Gemma response:", story);
        messageEl.textContent = "Speaking response...";
        
        await speech(story);
        messageEl.textContent = "Ready.";


      } catch (err) {
        console.error("Error in processQuery:", err);
        messageEl.textContent = "Error: " + err.message;
      } finally {
          removeAnimations();
      }
    }

    function extractKeywords(text) {
      const keywords = ["ocean", "sea", "river", "lake", "wave", "storm", "tsunami", "coast", "island", "flood", "beach",
                        "forest", "mountain", "city", "jungle", "desert", "rain", "wind", "thunder", "bird", "animal", "music", "ambience", "nature", "urban", "waterfall", "desert", "crowd", "street"];
      for (const keyword of keywords) {
          if (text.toLowerCase().includes(keyword)) {
              return keyword;
          }
      }
      return null;
    }
  }
} 
