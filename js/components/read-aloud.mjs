import "./voice.mjs";
class ReadAloudComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const container = document.createElement("div");

    container.innerHTML = `

        <div class="container">
          <slot name="paragraph"></slot>
          <div class="control-buttons">
            <slot name="retry-btn"></slot>
            <slot name="start-btn"></slot>
            <slot name="speaker-btn"></slot>
            <slot name="pause-resume-btn"></slot>
          </div>
        </div>
      `;

    const style = document.createElement("style");

    style.textContent = `

      ::slotted(p.body-medium.story) {
        inline-size: 100%;          
        block-size: 30vh;
        max-inline-size: 500px;
        max-block-size: 60vh;
        overflow-y: auto;
        word-break: break-word;
        scrollbar-width: none;
        -ms-overflow-style: none;
        text-align: center;
        color: var(--md-sys-color-on-background);
        margin-block-start: 10px;
        padding-start: 5px;
        padding-end: 5px;
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 8px;
        background-color: var(--md-sys-color-surface-container-low);
      }

      ::slotted(p.body-medium.story::-webkit-scrollbar) {
        display: none;
      }

      @media (max-width: 600px) {
        ::slotted(p.body-medium.story) {
          inline-size: 100%;
          max-inline-size: 100%;
          block-size: 25vh;
        }
      }

      .control-buttons {
        display: flex;
        flex-direction: row;      
        justify-content: space-between; 
        gap: 10px;                
        inline-size: 100%; 
      }

      .control-buttons ::slotted(md-filled-tonal-button) {
        flex: 1;                  
      }

    `;

    this.shadowRoot.append(style);
    
    shadow.appendChild(container);  

    this.highlight = true;
    this.speechRate = 1.1;
    this.selectedVoice = "default";
    this.isSpeaking = false;
    this.isPaused = false;
    this.synthesisUtterance = null;
    this.recognition = null;
    this.currentWordIndex = 0;
    this.words = [];
    this.paragraphElement = null;
  }

  static get observedAttributes() {
    return ["lang", "highlight", "voice", "rate"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "highlight" && newValue === "false") {
      this.highlight = false;
    }
    if (name === "rate") {
      this.speechRate = parseFloat(newValue);
    }
    if (name === "voice") {
      this.selectedVoice = newValue;
    }
  }

  connectedCallback() {
    const paragraphSlot = this.shadowRoot.querySelector(
      'slot[name="paragraph"]'
    );
    paragraphSlot.addEventListener("slotchange", () => {
      this.initSpeechRecognition();
    });

    const startBtn = this.shadowRoot.querySelector('slot[name="start-btn"]');
    startBtn.addEventListener("slotchange", () => {
      this.attachStartButton();
    });

    const retryBtn = this.shadowRoot.querySelector('slot[name="retry-btn"]');
    retryBtn.addEventListener("slotchange", () => {
      this.attachRetryButton();
    });

    const speakerBtn = this.shadowRoot.querySelector(
      'slot[name="speaker-btn"]'
    );
    speakerBtn.addEventListener("slotchange", () => {
      this.attachSpeakerButton();
    });

    const pauseResumeBtn = this.shadowRoot.querySelector(
      'slot[name="pause-resume-btn"]'
    );
    pauseResumeBtn.addEventListener("slotchange", () => {
      this.attachPauseResumeButton();
    });
  }

  attachStartButton() {
    const startBtn = this.querySelector('[slot="start-btn"]');
    if (!startBtn) {
      console.error("No start button found!");
      return;
    }

    startBtn.addEventListener("click", () => {
      if (this.recognition) {
        this.recognition.start();
      }
    });
  }

  attachRetryButton() {
    const retryBtn = this.querySelector('[slot="retry-btn"]');
    if (!retryBtn) {
      console.error("No retry button found!");
      return;
    }

    retryBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }

  attachSpeakerButton() {
    const speakerBtn = this.querySelector('[slot="speaker-btn"]');
    if (!speakerBtn) {
      console.error("No speaker button found!");
      return;
    }

    speakerBtn.textContent = "Start Speaker";

    speakerBtn.addEventListener("click", () => {
      if (this.isSpeaking) {
        this.stopSpeechSynthesis(speakerBtn);
      } else {
        this.startSpeechSynthesis(speakerBtn);
      }
    });
  }

  attachPauseResumeButton() {
    const pauseResumeBtn = this.querySelector('[slot="pause-resume-btn"]');
    if (!pauseResumeBtn) {
      console.error("No pause-resume button found!");
      return;
    }

    pauseResumeBtn.textContent = "Pause Speaker";

    pauseResumeBtn.addEventListener("click", () => {
      if (this.isSpeaking && !this.isPaused) {
        this.pauseSpeechSynthesis(pauseResumeBtn);
      } else if (this.isSpeaking && this.isPaused) {
        this.resumeSpeechSynthesis(pauseResumeBtn);
      }
    });
  }

  startSpeechSynthesis(button) {
    const paragraphElement = this.querySelector('[slot="paragraph"]');
    if (!paragraphElement) {
      console.error("No paragraph found!");
      return;
    }

    const text = paragraphElement.textContent.trim();
    if (!text) {
      console.error("No text to speak!");
      return;
    }

    // Store data for pause/resume functionality
    this.words = text.split(" ");
    this.paragraphElement = paragraphElement;
    this.currentWordIndex = 0;
    this.isPaused = false;

    this.isSpeaking = true;
    button.textContent = "Stop Speaker";

    // Update pause/resume button when speaking starts
    const pauseResumeBtn = this.querySelector('[slot="pause-resume-btn"]');
    if (pauseResumeBtn) {
      pauseResumeBtn.textContent = "Pause Speaker";
    }

    this.startSpeechFromIndex(0);
  }

  startSpeechFromIndex(startIndex) {
    if (!this.words || !this.paragraphElement) {
      console.error("No words or paragraph element available!");
      return;
    }

    const language = this.getAttribute("lang") || "en-US";
    const voiceName = this.selectedVoice;
    const rate = this.speechRate;

    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = language;
    utterance.rate = rate;

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      const selectedVoice = voices.find((v) => v.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    const speakCurrentWord = () => {
      // Check if we're still supposed to be speaking and not paused
      if (
        this.currentWordIndex < this.words.length &&
        this.isSpeaking &&
        !this.isPaused
      ) {
        utterance.text = this.words[this.currentWordIndex];
        console.log("highlighting word:");
        this.highlightCurrentWord(
          this.paragraphElement,
          this.words,
          this.currentWordIndex
        );
        speechSynthesis.speak(utterance);
        this.currentWordIndex++;
      } else if (
        this.currentWordIndex >= this.words.length &&
        this.isSpeaking
      ) {
        // Finished speaking all words
        const speakerBtn = this.querySelector('[slot="speaker-btn"]');
        if (speakerBtn) {
          this.stopSpeechSynthesis(speakerBtn);
        }
      }
    };

    utterance.onend = () => {
      if (this.isSpeaking && !this.isPaused) {
        speakCurrentWord();
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
    };

    this.synthesisUtterance = utterance;
    this.currentWordIndex = startIndex;
    speakCurrentWord();
  }

  stopSpeechSynthesis(button) {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentWordIndex = 0;
    this.words = [];
    this.paragraphElement = null;
    button.textContent = "Start Speaker";

    // Reset pause/resume button when speaking stops
    const pauseResumeBtn = this.querySelector('[slot="pause-resume-btn"]');
    if (pauseResumeBtn) {
      pauseResumeBtn.textContent = "Pause Speaker";
    }
  }

  pauseSpeechSynthesis(button) {
    if (speechSynthesis.speaking) {
      // Use cancel instead of pause due to Android WebKit issues
      speechSynthesis.cancel();
      this.isPaused = true;
      button.textContent = "Resume Speaker";
    }
  }

  resumeSpeechSynthesis(button) {
    if (this.isPaused && this.words.length > 0 && this.paragraphElement) {
      // Restart from where we left off
      this.isPaused = false;
      button.textContent = "Pause Speaker";
      this.startSpeechFromIndex(this.currentWordIndex);
    }
  }

  highlightCurrentWord(paragraphElement, words, currentWordIndex) {
    if (this.highlight) {
      const content = words
        .map((word, index) =>
          index === currentWordIndex
            ? `<span class="highlighted-read-out">${word}</span>`
            : word
        )
        .join(" ");
      paragraphElement.innerHTML = content;
    }
  }

  initSpeechRecognition() {
    const paragraphElement = this.querySelector('[slot="paragraph"]');
    if (!paragraphElement) {
      console.error("No paragraph found!");
      return;
    }

    const paragraphText = paragraphElement.textContent.trim().split(" ");
    let currentWordIndex = 0;

    const language = this.getAttribute("lang") || "en-US";

    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if ("SpeechRecognition" in window) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = language;
      this.recognition.interimResults = true;
      this.recognition.continuous = true;

      let timeoutId = null;

      const resetTimeout = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          currentWordIndex++;
          if (currentWordIndex < paragraphText.length) {
            this.highlightCurrentWord(
              paragraphElement,
              paragraphText,
              currentWordIndex
            );
          } else {
            this.recognition.stop();
            this.dispatchEvent(
              new CustomEvent("reading-complete", {
                detail: { message: "Reading completed" },
              })
            );
          }
        }, 5000);
      };

      resetTimeout();

      this.recognition.onresult = (event) => {
        let transcript = event.results[event.resultIndex][0].transcript
          .trim()
          .toLowerCase();

        const currentWord = paragraphText[currentWordIndex]
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
          .toLowerCase();

        if (transcript.includes(currentWord)) {
          currentWordIndex++;
          this.highlightCurrentWord(
            paragraphElement,
            paragraphText,
            currentWordIndex
          );

          if (currentWordIndex >= paragraphText.length) {
            clearTimeout(timeoutId);
            this.recognition.stop();
            this.dispatchEvent(
              new CustomEvent("reading-complete", {
                detail: { message: "Reading completed" },
              })
            );
          } else {
            resetTimeout();
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.error(`Error occurred: ${event.error}`);
        clearTimeout(timeoutId);
      };

      this.recognition.onend = () => {
        if (currentWordIndex < paragraphText.length) {
          this.recognition.start();
          resetTimeout();
        } else {
          clearTimeout(timeoutId);
        }
      };
    } else {
      console.log("Web Speech API is not supported in this browser.");
      paragraphElement.textContent =
        "Web Speech API is not supported in this browser.";
    }
  }
}
export default ReadAloudComponent;