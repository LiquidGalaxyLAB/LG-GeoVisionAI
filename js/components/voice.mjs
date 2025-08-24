import { speech } from "../utils/speech.mjs";
import { flytoview } from "../api/flytoview.mjs";
import { startOrbit } from "../api/orbit.mjs";
import { stopOrbit } from "../api/orbit.mjs";
import { showballoon } from "../api/balloon.mjs";
import ReadAloudComponent from "./read-aloud.mjs";
customElements.define("read-aloud", ReadAloudComponent);

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
          max-block-size: 100%;
          overflow-y: auto;
          padding-block: 20px;
          scrollbar-inline-size: none;
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
          scrollbar-inline-size: none;
          text-align: center;
          text-wrap: wrap;
          color: var(--md-sys-color-tertiary-container);
          padding-left: 5px;
          padding-right: 5px;
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

        .manual-input md-filled-text-field {
            flex-grow: 1;
        }

        .manual-input md-filled-button {
            inline-size: 100%; 
        }

        audio {
          margin-block-start: 20px;
          inline-size: 100%;
          outline: none;
          border-radius: 8px;
          background-color: var(--md-sys-color-surface-container-high);
          box-shadow: var(--md-elevation-level1);
        }

        .orbit-buttons {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 10px;
          inline-size: 100%;
        }

        .orbit-buttons md-filled-tonal-button {
          flex: 1;
        }

        .highlighted-read-out {
          text-decoration: underline;
          color: var(--md-sys-color-primary);
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
          .manual-input {
              max-inline-size: 100%;
              align-items: stretch;
          }
          .headline-small { font-size: clamp(1rem, 1.5vw + 0.3rem, 1.3rem); }

          .manual-input md-filled-button {
              inline-size: 100%; 
          }
        }

        .readAloudWrapper {
          inline-size: 100%;
          max-inline-size: 500px; /* max width */
          margin-inline: auto; /* center horizontally */
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
                  <path fill="var(--md-sys-color-primary)"
                      d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path>
                  <path fill="var(--md-sys-color-secondary)" d="m11 18.08h2v3.92h-2z"></path>
                  <path fill="var(--md-sys-color-tertiary)"
                      d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path>
                  <path fill="var(--md-sys-color-on-surface)"
                      d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
            </svg>
        </md-icon-button>
        <p class="headline-small">Tap on the Mic to Speak!</p>
        

        <p class="body-medium message"></p>
    
        <div class="readAloudWrapper">
          <read-aloud id="storyReader">
            <p slot="paragraph" class="body-medium story" id="story"></p>
            <md-filled-tonal-button slot="speaker-btn"></md-filled-tonal-button>
            <md-filled-tonal-button slot="pause-resume-btn"></md-filled-tonal-button>
          </read-aloud>
        </div>

        <div class="manual-input">
          <md-filled-text-field
            id="questionInput"
            label="Or type your question here..."
            placeholder="E.g.-- What is the capital of the USA?"
            value="">
          </md-filled-text-field>
          <md-filled-button id="submitButton">Ask AI</md-filled-button>

          <div class="orbit-buttons">
            <md-filled-tonal-button id="startOrbitButton">Start Orbit</md-filled-tonal-button>
            <md-filled-tonal-button id="stopOrbitButton">Stop Orbit</md-filled-tonal-button>
          </div>

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

    const startOrbitButton = this.shadowRoot.getElementById("startOrbitButton");
    const stopOrbitButton = this.shadowRoot.getElementById("stopOrbitButton");

    // Stores the last coordinates after each Gemini location extraction
    this.lastCoordinates = null;

    startOrbitButton.addEventListener("click", async () => {
      if (!this.lastCoordinates) {
        this.showToast("No location available for orbit.");
        return;
      }
    
      let { lat, lng } = this.lastCoordinates;
    
      // Ensure they are valid numbers
      lat = parseFloat(lat);
      lng = parseFloat(lng);
    
      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid lat/lng values:", lat, lng);
        this.showToast("Invalid location coordinates. Cannot start orbit.");
        return;
      }
      console.log("Calling startOrbit with:", lat, lng);
    
      try {
        this.showToast("Stopping any existing orbit...");
        await stopOrbit();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Orbit command received with:", { lat, lng });
      
        if (
          typeof lat !== "number" ||
          typeof lng !== "number" ||
          isNaN(lat) ||
          isNaN(lng)
        ) {
          throw new Error(`Invalid coordinates for orbit: lat=${lat}, lng=${lng}`);
        }
      
        this.showToast("Starting new orbit...");
        await startOrbit(lat, lng, 10);
        this.showToast(`Orbit started at ${lat}, ${lng}.`);
      } catch (error) {
        console.error("Start Orbit Error:", error);
        this.showToast("Failed to start orbit.");
      }
    });

    stopOrbitButton.addEventListener("click", async () => {
      try {
        await stopOrbit();
        this.showToast("Orbit stopped.");
      } catch (error) {
        console.error("Stop Orbit Error:", error);
        this.showToast("Failed to stop orbit.");
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

  // Fetches coordinates from OpenCage API based on the provided location query
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
  
  //Hnadling queries like take me to, show me, send me to, fly to...along with general queries for Gemini
  async processQuery(query) {
    const storyEl = this.shadowRoot.getElementById("story");
    const soundPlayer = this.shadowRoot.getElementById("soundPlayer");
  
    this.showToast("Processing your question...");
    soundPlayer.hidden = true;
    storyEl.textContent = "";
    let imageUrl = ""; //for dynamically changing image on the balloon
    let imageUrl1 = ""; //for direct location queries
  
    const showOnlyPattern = /^take me to\s+|^show me\s+|^send me to+|^fly to/i;
    let geminiTextResponse = ""; //for gemini response
    let geminiResponse = ""; //for direct location queries
    let identifiedLocation = "";
    const isDirectLocation = showOnlyPattern.test(query.trim());
  
    const googleGeminiApiKey = localStorage.getItem("gemmaApiKey");
    const openCageApiKey = localStorage.getItem("openCageApiKey");
    const freesoundApiKey = localStorage.getItem("freesoundApiKey");
  
    if (!googleGeminiApiKey || !openCageApiKey || !freesoundApiKey) {
      this.showToast("Please enter and save all API keys in the Settings tab to proceed.");
      this.removeAnimations();
      return;
    }

    // Check if the query is a direct location command
    if (isDirectLocation) {
      console.log("Processing direct location query...");
      identifiedLocation = query.toLowerCase().replace(/^(take me to|show me|send me to|fly to)\s*/i, "").trim().replace(/\s+/g, " ");
      console.log("Identified location:", identifiedLocation);

      geminiResponse = `You're now viewing ${identifiedLocation}.`;
      storyEl.textContent = geminiResponse;
      this.showToast(`Detected direct location fly to command: "${identifiedLocation}"`);

      console.log("Fetching coordinates for:", identifiedLocation);
      const coordinates = await this.getCoordinatesFromLocation(identifiedLocation, openCageApiKey);
      console.log("Coordinates fetched:", coordinates);

      if (!coordinates || isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
        this.showToast(`Could not find valid coordinates for "${identifiedLocation}".`);
        this.removeAnimations();
        return;
      }

      this.lastCoordinates = {
        lat: parseFloat(coordinates.lat),
        lng: parseFloat(coordinates.lng),
      };

      this.showToast(`Coordinates found: ${coordinates.lat}, ${coordinates.lng}`);

      this.showToast(`Flying to location...`);
      await flytoview(coordinates.lat, coordinates.lng, 15); 
      console.log("Sent flytoview command.");

      const prompt = `A breathtaking, scenic aerial view of ${identifiedLocation}, showcasing its most iconic landmarks, unique architecture, and surrounding natural beauty. Include dynamic elements such as bustling city life or serene nature, depending on the location. Use a professional photography style with rich, vibrant colors, dramatic shadows, golden hour lighting, and a cinematic, high-definition finish. Emphasize depth, realism, and emotional impact to create a visually compelling image.`;
      imageUrl1 = await this.generateImageUrlFromText(prompt, identifiedLocation);

      if (!imageUrl1 || imageUrl1.includes("political-map-of-the-world")) {
        imageUrl1 = "https://raw.githubusercontent.com/Anishka2006/lg-geovisionai/main/high-detail-political-map-of-the-world-blue-and-white-vector.jpg"; 
      }
      await new Promise(r => setTimeout(r, 1500));
      
      const balloonKml1 = this.generateBalloonKml(
        coordinates,
        identifiedLocation,
        geminiResponse,
        imageUrl,
        imageUrl1
      );
      this.showToast(`Sending balloon data and showing...`);
      await this.sendDirectBalloonToLG(balloonKml1); 
      await showballoon(balloonKml1); 

      setTimeout(() => {
        speech.speak(geminiResponse, () => {
          this.showToast("Story narration finished.");
        });
      }, 800);

    } else {
      //Gemini API call
      const MODEL_NAME = "models/gemini-1.5-flash-latest";
      const GOOGLE_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${googleGeminiApiKey}`;
  
      try {
        this.showToast("Getting response from Google Gemini...");
  
        const geminiAnswerRes = await fetch(GOOGLE_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: query }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250,
              topP: 0.9,
              topK: 40,
            },
          }),
        });
  
        const geminiAnswerData = await geminiAnswerRes.json();
        geminiTextResponse = geminiAnswerData.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Google Gemini.";
        if (!geminiTextResponse || geminiTextResponse.trim() === "") {
          this.showToast("Gemini returned an empty response.");
          this.removeAnimations();
          return;
        }
  
        storyEl.textContent = geminiTextResponse;
        this.showToast("Narrating story...");
        setTimeout(() => {
          speech.speak(geminiTextResponse, () => {
            this.showToast("Story narration finished.");
          });
        }, 150);
        
        //Function to ask Gemini to extract the location from the response
        const geminiLocationRes = await fetch(GOOGLE_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `
                Extract the main location mentioned.
                Question: "${query}"
                AI Answer: """${geminiTextResponse}"""
                Only return the place name. No extra words.
                `
              }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 50,
              topP: 0.9,
              topK: 40,
            },
          }),
        });
  
        const geminiLocationData = await geminiLocationRes.json();
        identifiedLocation = geminiLocationData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "N/A";
  
        if (!identifiedLocation || identifiedLocation.toLowerCase() === "n/a") {
          this.showToast("No valid location extracted from Gemini.");
          this.removeAnimations();
          return;
        }
      } catch (error) {
        console.error("Gemini API error:", error);
        this.showToast(`Gemini error: ${error.message}`);
        this.removeAnimations();
        return;
      }
    }
  
    try {
      this.showToast(`Fetching coordinates for: ${identifiedLocation}...`);
      const fixedLocations = {
        "amazon rainforest": { lat: -3.4653, lng: -62.2159 },
        "sahara desert": { lat: 23.4162, lng: 25.6628 },
        "himalayas": { lat: 28.5983, lng: 83.9311 },
        "antarctica": { lat: -82.8628, lng: 135.0000 },
        "pacific ocean": { lat: 0.0, lng: -160.0 },
        "atlantic ocean": { lat: 0.0, lng: -30.0 },
        "ganges river": { lat: 25.3097, lng: 83.0104 },
        "great barrier reef": { lat: -18.2871, lng: 147.6992 },
      };
  
      let coordinates;
      const key = identifiedLocation.toLowerCase();
      if (fixedLocations[key]) {
        coordinates = fixedLocations[key];
      } else {
        coordinates = await this.getCoordinatesFromLocation(identifiedLocation, openCageApiKey);
      }
  
      if (coordinates) {
        this.lastCoordinates = {
          lat: parseFloat(coordinates.lat),
          lng: parseFloat(coordinates.lng)
        };
        this.showToast(`Coordinates found: ${coordinates.lat}, ${coordinates.lng}`);
        this.showToast(`Flying to ${identifiedLocation}...`);
        await flytoview(coordinates.lat, coordinates.lng, 15);
        playSoundscapeBasedOnText(geminiTextResponse);
        imageUrl = await this.generateImageUrlFromText(geminiTextResponse, identifiedLocation);
  
        const balloonKml = this.generateBalloonKml(coordinates, identifiedLocation, geminiTextResponse,imageUrl, imageUrl1);
        await this.sendBalloonToLG(balloonKml);
        
        await flytoview(coordinates.lat, coordinates.lng, 15); // forces the balloon to appear
      } else {
        this.showToast(`No coordinates found for "${identifiedLocation}".`);
      }
    } catch (error) {
      console.error("Location processing error:", error);
      this.showToast(`Error processing location: ${error.message}`);
    } finally {
      this.removeAnimations();
    }

    //  AI Narration of the generated story
    const storyReader = this.shadowRoot.getElementById("storyReader");
    const paragraph = storyReader.querySelector('[slot="paragraph"]');
    paragraph.textContent = geminiResponse || geminiTextResponse || "";

  }

  //function for generating image dynamically
  async generateImageUrlFromText(text, locationHint = "") {
    const baseUrl = "https://raw.githubusercontent.com/Anishka2006/lg-geovisionai/main/";
  
    const keywordMap = {
      "ocean": "ocean.jpg",
      "mountain": "mountains.jpg",
      "himalayas": "mount_everest.jpg",
      "mount everest": "mount_everest.jpg",
      "forest": "forest.jpeg",
      "desert": "desert.jpg",
      "volcano": "volcano.jpg",
      "island": "island.jpg",
      "tokyo": "tokyo.jpg",
      "Japan": "tokyo.jpg",
      "japan": "tokyo.jpg",
      "paris": "paris.jpg",
      "new delhi": "delhi.jpg",
      "usa": "usa.jpg",
      "washington dc": "usa.jpg",
      "washington d c": "usa.jpg",
      "india": "delhi.jpg",
      "mumbai": "mumbai.jpg",
      "barcelona": "barcelona.jpg",
      "spain": "barcelona.jpg",
      "hague": "barcelona.jpg",
      "great barrier reef": "great_barrier_reef.jpeg"
    };
  
    //normalizing input by removing punctuation and extra spaces
    const lower = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");
  
    for (const key in keywordMap) {
      if (lower.includes(key)) {
        return `${baseUrl}${keywordMap[key]}`;
      }
    }
    // Fallback image
    return `${baseUrl}high-detail-political-map-of-the-world-blue-and-white-vector.jpg`;
  }
  
  sanitizeForKML(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  
  generateBalloonKml(coordinates, name, geminiTextResponse, imageUrl, imageUrl1) {
    const selectedImage = geminiTextResponse ? imageUrl : imageUrl1;
    console.log("Selected image for balloon:", selectedImage);
    const safeText = this.sanitizeForKML(geminiTextResponse);
  
    return `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2"
        xmlns:gx="http://www.google.com/kml/ext/2.2"
        xmlns:kml="http://www.opengis.net/kml/2.2"
        xmlns:atom="http://www.w3.org/2005/Atom">
      <Document>
        <Style id="custom_pin">
          <IconStyle>
            <Icon>
              <href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href>
            </Icon>
          </IconStyle>
          <BalloonStyle>
            <text>$[description]</text>
            <bgColor>ffffffff</bgColor>
          </BalloonStyle>
        </Style>
  
        <Placemark>
          <name>${name}</name>
          <description><![CDATA[
            <div style="width:500px; padding:20px; font-family:sans-serif; text-align:center; font-size:18px; overflow-y:auto;">
              <h2 style="font-size:26px; margin-bottom:15px; font-weight:bold; color:#000;">${name}</h2>
              <img src="${selectedImage}" alt="Map" width="460" height="280" style="margin-bottom:15px;" />
  
              <div style="font-size:18px; color:#000; margin-bottom:10px;">
                <b>Latitude:</b> ${coordinates.lat} &nbsp;&nbsp; | &nbsp;&nbsp; <b>Longitude:</b> ${coordinates.lng}
              </div>
  
              <div style="text-align:left; margin-top:10px; padding:10px; font-size:22px; line-height:1.5; border-top:2px solid #333; color:#111;">
                ${safeText}
              </div>
            </div>
          ]]></description>
          <styleUrl>#custom_pin</styleUrl>
          <gx:balloonVisibility>1</gx:balloonVisibility>
          <Point>
            <coordinates>${coordinates.lng},${coordinates.lat},0</coordinates>
          </Point>
        </Placemark>
      </Document>
    </kml>`;
  }
  
  async sendBalloonToLG(kmlContent) {
    try {
      const configs = JSON.parse(localStorage.getItem("lgconfigs"));

      if (!configs || !configs.server || !configs.username || !configs.ip || !configs.port || !configs.password || !configs.screens) {
        this.showToast("Liquid Galaxy connection settings are incomplete. Please check settings.");
        console.error("LG configuration missing for balloon sending.");
        return;
      }

      const { server, username, ip, port, password, screens } = configs;
      const ENDPOINT_SHOW_BALLOON = "/api/lg-connection/show-balloon";

      this.showToast("Sending balloon to Liquid Galaxy...");

      const response = await fetch(server + ENDPOINT_SHOW_BALLOON, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          ip,
          port,
          password,
          screens,
          kml: kmlContent,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Balloon sent successfully:", result.message, result.data);
        this.showToast("Balloon Placemark displayed on Liquid Galaxy!");
      } else {
        console.error("Error sending balloon:", result.message, result.stack);
        this.showToast(`Failed to display Balloon: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during balloon sending:", error);
      this.showToast(`Error sending balloon: ${error.message}`);
    }
  }

  async sendDirectBalloonToLG(kmlContent) {
    try {
      const configs = JSON.parse(localStorage.getItem("lgconfigs"));
  
      if (
        !configs ||
        !configs.server ||
        !configs.username ||
        !configs.ip ||
        !configs.port ||
        !configs.password ||
        !configs.screens
      ) {
        this.showToast("Liquid Galaxy connection settings are incomplete. Please check settings.");
        console.error("LG configuration missing for direct balloon sending.");
        return;
      }
  
      const { server, username, ip, port, password, screens } = configs;
      const ENDPOINT_SHOW_BALLOON = "/api/lg-connection/show-balloon";
  
      this.showToast("Sending direct query balloon to Liquid Galaxy...");
  
      const response = await fetch(server + ENDPOINT_SHOW_BALLOON, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          ip,
          port,
          password,
          screens,
          kml: kmlContent,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Direct balloon sent successfully:", result.message, result.data);
        console.log("Direct Balloon KML Content:\n" + kmlContent);
        this.showToast("Direct Balloon Placemark displayed on Liquid Galaxy!");
      } else {
        console.error("Error sending direct balloon:", result.message, result.stack);
        this.showToast(`Failed to display Direct Balloon: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during direct balloon sending:", error);
      this.showToast(`Error sending direct balloon: ${error.message}`);
    }
  }
}

const oceanSound = new Audio('./assets/ocean.mp3');
const fireSound = new Audio('./assets/fire.mp3');

oceanSound.loop = true;
fireSound.loop = true;
fireSound.volume = 0.15;
oceanSound.volume = 0.15;

function stopAllSounds() {
  oceanSound.pause();
  fireSound.pause();
  oceanSound.currentTime = 0;
  fireSound.currentTime = 0;
}

function playSoundscapeBasedOnText(text) {
  stopAllSounds();

  const lower = text.toLowerCase();
  let soundToPlay = null;

  if (lower.includes("ocean") || lower.includes("sea") || lower.includes("wave") || lower.includes("beach") || lower.includes("coast") || lower.includes("island") || lower.includes("tsunami") || lower.includes("flood") || lower.includes("water")) {
    soundToPlay = oceanSound;
  } else if (lower.includes("fire") || lower.includes("burning") || lower.includes("flame") || lower.includes("campfire") || lower.includes("wildfire")) {
    soundToPlay = fireSound;
  }

  if (soundToPlay) {
    soundToPlay.play().then(() => {
      console.log("Sound started");
    }).catch(err => {
      console.error("Play error:", err);
    });

    setTimeout(() => {
      soundToPlay.pause();
      soundToPlay.currentTime = 0;
      console.log("Sound stopped");
    }, 10000);
  }
}

customElements.define("lg-voice", LGVoice); 

export async function exportprocessQueryExternally(query) {
  const lgVoiceInstance = document.querySelector("lg-voice");
  if (!lgVoiceInstance) throw new Error("lg-voice not found");
  return lgVoiceInstance.processQuery(query);
}