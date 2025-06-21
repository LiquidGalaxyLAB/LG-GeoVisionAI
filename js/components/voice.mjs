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
          block-size: 100dvh;      
          padding-inline: 30px;   
           
        }

        .scrollable-content {
          display: flex;
          flex-direction: column;
          align-items: center; 
          width: 100%; 
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

        md-icon-button {
          scale: 5;
          margin-block: 80px;
          background-color: color-mix(in srgb, 95% transparent, 5% var(--md-sys-color-on-surface-variant));
          border-radius: 50%;
          z-index: 1;
          cursor: pointer;
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
          flex-direction: column;
          gap: 10px;
          margin-block-start: 10px;
          inline-size: 100%;
          max-inline-size: 500px;
          color: var(--md-sys-color-tertiary-container); 
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
          md-icon-button { scale: 3; margin-block: 40px; }
          .manual-input { max-inline-size: 100%; }
          .headline-small { font-size: clamp(1rem, 1.5vw + 0.3rem, 1.3rem); }
        }

        @media (min-width: 601px) and (max-width: 1024px) {
          .wrapper { padding-inline: 40px; }
          md-icon-button { scale: 4; }
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
                      <path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path>
                      <path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path>
                      <path fill="#fbbc04" d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path>
                      <path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
                  </svg>
              </md-icon-button>
        <p class="headline-small">Tap on the Mic to Speak</p>
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
      }
    });

    submitButton.addEventListener("click", () => {
      const typed = questionInput.value.trim();
      if (typed !== "") {
        this.processQuery(typed);
        questionInput.value = "";
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

  // Function for OpenCage API
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

  // Main query processing method
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

        const MODEL_NAME = "models/gemini-1.5-flash-latest";
        const GOOGLE_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${googleGeminiApiKey}`;

        // FIRST CALL TO GEMINI : To get the story response
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

        } catch (error) {
            console.error("Error from Google Gemini Answer API call:", error);
            this.showToast(`Error getting answer from Gemini: ${error.message}.`);
            this.removeAnimations();
            return;
        }


        //SECOND CALL TO GEMINI: For extracting the location 
        this.showToast("Extracting location for Liquid Galaxy...");
        let identifiedLocation = "";
        try {
            const geminiLocationRes = await fetch(GOOGLE_API_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Identify the main geographical location mentioned in this query: "${query}". Respond with only the place name, and nothing else. If no clear location, respond with "N/A".`,
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

                //OpenCage API Integration
                this.showToast(`Getting coordinates for: ${identifiedLocation}...`);
                const coordinates = await this.getCoordinatesFromLocation(identifiedLocation, openCageApiKey);

                if (coordinates) {
                    this.showToast(`Found coordinates: Lat ${coordinates.lat}, Lng ${coordinates.lng}. Got the Coordinates!`);
                    console.log(`Found coordinates: Lat ${coordinates.lat}, Lng ${coordinates.lng}`);

                    // --- Generate the KML content ---
                    const kmlContent = this.generateKmlContent(coordinates.lat, coordinates.lng, identifiedLocation);
                    console.log("Generated KML:", kmlContent);

                    //Sending KML to Liquid Galaxy
                    //await this.sendKmlToLiquidGalaxy(kmlContent);
                    //this.showToast("KML sent to Liquid Galaxy successfully!");

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

  //KML Generation
  generateKmlContent(latitude, longitude, name) {
    return `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
  <Document>
    <name>${name || 'Generated Location'}</name>
    <LookAt>
        <longitude>${longitude}</longitude>
        <latitude>${latitude}</latitude>
        <altitude>10000</altitude>
        <range>15000</range>
        <tilt>45</tilt>
        <heading>0</heading>
        <gx:altitudemode>relativeToGround</gx:altitudemode>
    </LookAt>
    <Placemark>
      <name>${name || 'Identified Location'}</name>
      <Point>
        <coordinates>${longitude},${latitude},0</coordinates>
      </Point>
    </Placemark>
  </Document>
  </kml>`;
  }

  //Sending KML to Liquid Galaxy
  async sendKmlToLiquidGalaxy(kmlContent) {
    console.log("KML content prepared for LG. Please integrate your LG client code here.");
    //rest of code to be written 
  }

  //Keyword Extraction Method
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