import { speech } from "../utils/speech.mjs";
import { flytoview } from "../api/flytoview.mjs";

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
          block-size: 100dvh;
          padding-inline: 30px;
          padding-block-end: 100px;
        }

        .scrollable-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-height: 100%;
          overflow-y: auto;
          padding-block: 20px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scrollable-content::-webkit-scrollbar {
          display: none;
        }

        p {
          color: var(--md-sys-color-on-background);
          font-size: clamp(1rem, 1.5vw + 0.2rem, 1.2rem);
        }

        .headline-small {
          font-size: clamp(1.2rem, 2vw + 0.3rem, 1.5rem);
          font-weight: 500;
          color: var(--md-sys-color-on-background);
        }

        .body-medium {
          font-size: clamp(0.95rem, 1.2vw + 0.2rem, 1rem);
          color: var(--md-sys-color-on-background);
        }

        md-icon-button { /* This style block for the mic button */
          scale: 5;
          margin-block: 80px;
          background-color: color-mix(in srgb, 95% transparent, 5% var(--md-sys-color-on-surface-variant));
          border-radius: 50%;
          z-index: 1;
          cursor: pointer;
        }

        .mic path {
          fill: var(--md-sys-color-primary-container);
        }

        .message {
          inline-size: 100%;
          block-size: 75px;
          overflow-y: scroll;
          word-break: break-word;
          scrollbar-width: none;
          text-align: center;
          color: var(--md-sys-color-tertiary-container);
        }

        .story {
          inline-size: 100%;
          block-size: 200px;
          overflow-y: auto;
          word-break: break-word;
          scrollbar-width: none;
          -ms-overflow-style: none;
          text-align: center;
          color: var(--md-sys-color-on-background);
          margin-block-start: 10px;
          padding: 5px;
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: 8px;
          background-color: var(--md-sys-color-surface-container-low);
        }

        .story::-webkit-scrollbar {
          display: none;
        }

        .manual-input {
          display: flex;
          flex-direction: column; /* Keeps text field and button stacked */
          gap: 10px;
          margin-block-start: 10px;
          inline-size: 100%;
          max-inline-size: 500px;
          color: var(--md-sys-color-tertiary-container);
        }


        .manual-input md-filled-text-field {
            flex-grow: 1;
        }

        .manual-input md-filled-button {
            width: 100%; /* Make the Ask AI button full width */
        }

        audio {
          margin-block-start: 20px;
          inline-size: 100%;
          outline: none;
          border-radius: 8px;
          background-color: var(--md-sys-color-surface-container-high);
          box-shadow: var(--md-elevation-level1);
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

        .ending.ripple::after {
          animation: endRipple 0.5s ease;
        }

        @keyframes ripple {
          0%   { inline-size: 50px; block-size: 50px; }
          25%  { inline-size: 45px; block-size: 45px; }
          50%  { inline-size: 40px; block-size: 40px; }
          75%  { inline-size: 55px; block-size: 55px; }
          100% { inline-size: 50px; block-size: 50px; }
        }

        @keyframes endRipple {
          to { inline-size: 40px; block-size: 40px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ripple::after {
            animation: none !important;
          }
        }
        @media (max-width: 600px) {
          .wrapper { padding-inline: 16px; }
          md-icon-button { scale: 3; margin-block: 40px; } /* Applies to mic button */
          .manual-input {
              max-inline-size: 100%;
              align-items: stretch; /* Stretch items to fill width on small screens */
          }
          .headline-small { font-size: clamp(1rem, 1.5vw + 0.3rem, 1.3rem); }

          /* Removed action-buttons media query as div is gone */
          .manual-input md-filled-button {
              width: 100%; /* Ensure button is full width on small screens too */
          }
        }

        @media (min-width: 601px) and (max-width: 1024px) {
          .wrapper { padding-inline: 40px; }
          md-icon-button { scale: 4; } /* Applies to mic button */
        }

        @media (min-width: 1025px) {
          .wrapper { max-inline-size: 800px; margin-inline: auto; }
        }

        .message { display: block; }
        .message:empty { display: none; }
      </style>

      <div class="wrapper">
        <md-icon-button id="micButton" aria-label="Microphone">
            <svg class="mic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path>
                <path d="m11 18.08h2v3.92h-2z"></path>
                <path d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path>
                <path d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
            </svg>
        </md-icon-button>
        <p class="headline-small">Tap on the Mic to Speak/Stop AI Narration</p>
        <p class="body-medium message"></p>
        <p class="body-medium story" id="story"></p>

        <slot name="voice"></slot>

        <div class="manual-input">
          <md-filled-text-field
            id="questionInput"
            label="Or type your question here..."
            value="">
          </md-filled-text-field>

          <md-filled-button id="submitButton">Ask AI</md-filled-button>
        </div>
        <audio id="soundPlayer" controls hidden></audio>
      </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const micButton = this.shadowRoot.getElementById("micButton");
    const questionInput = this.shadowRoot.getElementById("questionInput");
    const submitButton = this.shadowRoot.getElementById("submitButton");
    const voiceAnimation = document.querySelector(".googleVoice");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Web Speech API is not supported in this browser.");
      this.showToast("Your browser does not support voice recognition.");
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
        this.showToast("");
        this.removeAnimations();
      } else {
        recognition.start();
        isRecognizing = true;
        this.showToast("Start Speaking...");
        micButton.classList.add("ripple");
        voiceAnimation?.classList?.add("animate");
        speech.stop(); // Stop any ongoing narration if mic is tapped
      }
    });

    submitButton.addEventListener("click", () => {
      const typed = questionInput.value.trim();
      if (typed !== "") {
        this.processQuery(typed);
        questionInput.value = "";
        speech.stop(); // Stop any ongoing narration when a new query is submitted
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      this.processQuery(transcript);
      isRecognizing = false;
      this.removeAnimations();
    };

    recognition.onspeechend = () => {
      recognition.stop();
      isRecognizing = false;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      this.showToast("You didn't say anything, try again.");
      isRecognizing = false;
      this.removeAnimations();
    };

    speech.initTTS();
  }

  removeAnimations() {
    const micButton = this.shadowRoot.getElementById("micButton");
    const voiceAnimation = document.querySelector(".googleVoice");

    micButton.classList.add("ending");
    voiceAnimation?.classList?.add("ending");
    setTimeout(() => {
      micButton.classList.remove("ripple", "ending");
      voiceAnimation?.classList?.remove("animate", "ending");
    }, 1200);
  }

  showToast(message) {
    const toast = this.shadowRoot.querySelector(".message");
    toast.textContent = message;
    if (message) {
      toast.style.display = 'block';
    } else {
      toast.style.display = 'none';
    }
  }

  // Fetches coordinates from OpenCage API based on the provided location query
  // Returns an object with latitude and longitude, or null if not found
  async getCoordinatesFromLocation(locationQuery, openCageApiKey) {
    if (!locationQuery || locationQuery.trim() === "") {
        return null;
    }

    const encodedQuery = encodeURIComponent(locationQuery);
    const OPENCAGE_API_ENDPOINT = `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${openCageApiKey}&pretty=0&no_annotations=1`;

    try {
        const response = await fetch(OPENCAGE_API_ENDPOINT);
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`OpenCage API failed: ${response.status} - ${errorBody.status?.message || JSON.stringify(errorBody)}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const firstResult = data.results[0].geometry;
            return { lat: firstResult.lat, lng: firstResult.lng };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error calling OpenCage API:", error);
        return null;
    }
  }

  // Processes the user's query, interacts with Google Gemini API, and handles Liquid Galaxy mapping
  async processQuery(query) {
    const storyEl = this.shadowRoot.getElementById("story");
    const soundPlayer = this.shadowRoot.getElementById("soundPlayer");

    this.showToast("Processing your question...");
    soundPlayer.hidden = true;
    storyEl.textContent = "";

    try {
        const googleGeminiApiKey = localStorage.getItem("gemmaApiKey");
        const openCageApiKey = localStorage.getItem("openCageApiKey");
        const freesoundApiKey = localStorage.getItem("freesoundApiKey");

        if (!googleGeminiApiKey || !openCageApiKey || !freesoundApiKey) {
            this.showToast("Please enter and save all API keys in the Settings tab to proceed.");
            this.removeAnimations();
            return;
        }
//Gemini API endpoint and model integration
        const MODEL_NAME = "models/gemini-1.5-flash-latest";
        const GOOGLE_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${googleGeminiApiKey}`;

        this.showToast("Getting response from Google Gemini...");
        let geminiTextResponse = "";
        try {
            const geminiAnswerRes = await fetch(GOOGLE_API_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: query,
                        }],
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 250,
                        topP: 0.9,
                        topK: 40,
                    },
                }),
            });

            if (!geminiAnswerRes.ok) {
                const errorBody = await geminiAnswerRes.json();
                console.error("Google Gemini Answer API raw error:", errorBody);
                throw new Error(`Google Gemini Answer API failed: ${geminiAnswerRes.status} - ${errorBody.error?.message || JSON.stringify(errorBody)}`);
            }

            const geminiAnswerData = await geminiAnswerRes.json();
            geminiTextResponse = geminiAnswerData.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Google Gemini.";

            if (!geminiTextResponse || geminiTextResponse.trim() === "") {
                this.showToast("Google Gemini did not return a valid response. Please try again.");
                this.removeAnimations();
                return;
            }
            storyEl.textContent = geminiTextResponse;
            console.log("Google Gemini full response:", geminiTextResponse);

            this.showToast("Narrating story...");
            speech.speak(geminiTextResponse, () => {
                this.showToast("Story narration finished.");
            });

        } catch (error) {
            console.error("Error from Google Gemini Answer API call:", error);
            this.showToast(`Error getting answer from Gemini: ${error.message}.`);
            this.removeAnimations();
            return;
        }

        this.showToast("Extracting location for Liquid Galaxy...");
        let identifiedLocation = "";
        try {
            const geminiLocationRes = await fetch(GOOGLE_API_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                          text: `
                                Based on the question and the AI's story, extract only the most specific and relevant 
                                geographic location (like a city, coastline, island, landmark, or rainforest).

                                Question: "${query}"

                                AI's Answer: """${geminiTextResponse}"""

                                Examples:
                                - "How has Mumbai's coastline changed in 50 years?" → "Mumbai"
                                - "Where is the Eiffel Tower?" → "Eiffel Tower, Paris"
                                - If no valid location, return "N/A".

                                Return just the location name — no extra words.
                                `
                        }],
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 50,
                        topP: 0.9,
                        topK: 40,
                    },
                }),
            });

            if (!geminiLocationRes.ok) {
                const errorBody = await geminiLocationRes.json();
                console.error("Google Gemini Location API raw error:", errorBody);
                throw new Error(`Google Gemini Location API failed: ${geminiLocationRes.status} - ${errorBody.error?.message || JSON.stringify(errorBody)}`);
            }

            const geminiLocationData = await geminiLocationRes.json();
            identifiedLocation = geminiLocationData.candidates?.[0]?.content?.parts?.[0]?.text || "N/A";
            identifiedLocation = identifiedLocation.trim();

            if (!identifiedLocation || identifiedLocation === "N/A" || identifiedLocation.toLowerCase() === "n/a") {
                this.showToast("Gemini could not identify a clear location for mapping. Displaying general response.");
                this.removeAnimations();
            } else {
                console.log("Identified Location from Gemini for mapping:", identifiedLocation);

                this.showToast(`Getting coordinates for: ${identifiedLocation}...`);
                const coordinates = await this.getCoordinatesFromLocation(identifiedLocation, openCageApiKey);

                if (coordinates) {
                  this.showToast(`Found coordinates: Lat ${coordinates.lat}, Lng ${coordinates.lng}. Got the Coordinates!`);
                  console.log(`Found coordinates: Lat ${coordinates.lat}, Lng ${coordinates.lng}`);

                  try {
                      await flytoview(coordinates.lat, coordinates.lng, 10);
                      this.showToast("Liquid Galaxy flying to the location!");
                  } catch (flyError) {
                      console.error("Error flying to view:", flyError);
                      this.showToast(`Error flying to LG: ${flyError.message}.`);
                  }

                  const kmlContent = this.generateKmlContent(coordinates.lat, coordinates.lng, identifiedLocation);
                  console.log("Generated KML for placemark:", kmlContent);

                  await this.sendKmlToLiquidGalaxy(kmlContent);

                } else {
                    this.showToast(`Could not find coordinates for "${identifiedLocation}". Displaying general response.`);
                }
            }
        } catch (error) {
            console.error("Error from Google Gemini Location API call or mapping process:", error);
            this.showToast(`Error processing location for LG: ${error.message}.`);
        } finally {
            this.removeAnimations();
        }
    } catch (error) {
        console.error("Error in main process (overall query handling):", error);
        this.showToast(`An unexpected error occurred: ${error.message}.`);
        this.removeAnimations();
    }
  }
// Generates KML content for the identified location
// Uses the provided latitude, longitude, and name for the placemark

  generateKmlContent(latitude, longitude, name) {
    return `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
      <name>${name || 'Identified Location'}</name>
      <Camera>
        <longitude>${longitude}</longitude>
        <latitude>${latitude}</latitude>
        <altitude>5000</altitude>
        <heading>0</heading>
        <tilt>45</tilt>
        <roll>0</roll>
        <altitudeMode>relativeToGround</altitudeMode>
      </Camera>
      <Placemark>
        <name>${name || 'Identified Location'}</name>
        <Point>
          <coordinates>${longitude},${latitude},0</coordinates>
        </Point>
        <Style>
          <IconStyle>
            <scale>1.5</scale>
            <Icon>
              <href>http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png</href>
            </Icon>
          </IconStyle>
        </Style>
      </Placemark>
    </Document>
  </kml>`;
  }

// Sends the generated KML content to Liquid Galaxy for display
  async sendKmlToLiquidGalaxy(kmlContent) {
    try {
        const configs = JSON.parse(localStorage.getItem("lgconfigs"));

        if (!configs || !configs.server || !configs.username || !configs.ip || !configs.port || !configs.password) {
            this.showToast("Liquid Galaxy connection settings are incomplete. Please check settings.");
            console.error("LG configuration missing for KML sending.");
            return;
        }

        const { server, username, ip, port, password } = configs;

        const ENDPOINT = "/api/lg-connection/send-kml";
        const targetFilename = "slave_kml.kml";

        const formData = new FormData();
        formData.append("username", username);
        formData.append("ip", ip);
        formData.append("port", port);
        formData.append("password", password);
        formData.append("filename", targetFilename);

        const kmlFileBlob = new Blob([kmlContent], { type: "application/vnd.google-earth.kml+xml" });

        formData.append("file", kmlFileBlob, targetFilename);

        this.showToast("Sending KML Placemark to Liquid Galaxy...");

        const response = await fetch(server + ENDPOINT, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            console.log("KML Placemark sent successfully:", result.message, result.data);
            this.showToast("KML Placemark displayed on Liquid Galaxy!");
        } else {
            console.error("Error sending KML Placemark:", result.message, result.stack);
            this.showToast(`Failed to display KML: ${result.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error("Unexpected Error during KML Placemark sending:", error);
        this.showToast(`An unexpected error occurred while sending KML: ${error.message}`);
    }
  }

  extractKeywords(text) {
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

customElements.define("lg-voice", LGVoice); 