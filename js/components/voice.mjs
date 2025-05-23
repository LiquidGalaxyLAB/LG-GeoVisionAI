import { speech } from "../utils/speech.mjs";
export class LGVoice extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = `
          <style>
              .wrapper{
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  block-size: 100dvh;
                  padding-inline: 30px;
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
                0% {
                 inline-size: 50px;
                 block-size: 50px;
                }
                25% {
                 inline-size: 45px;
                 block-size: 45px;
                }
                50% {
                 inline-size: 40px;
                 block-size: 40px;
                }
                75% {
                 inline-size: 55px;
                 block-size: 55px;
                }
                100% {
                 inline-size: 50px;
                 block-size: 50px;
                }
              }
             .ending.ripple::after{
                animation: endRipple 0.5s ease;
             }
              @keyframes endRipple {
               to{
                 inline-size: 40px;
                 block-size: 40px;
               }
              }
            }

          /* --- NEW CSS for manual input --- */  /* CHANGED */
          .manual-input {                          /* CHANGED */
            display: flex;                         /* CHANGED */
            flex-direction: column;                /* CHANGED */
            gap: 10px;                            /* CHANGED */
            margin-top: 20px;                     /* CHANGED */
            width: 100%;                         /* CHANGED */
            max-width: 500px;                    /* CHANGED */
          }                                       /* CHANGED */
          .manual-input input {                    /* CHANGED */
            padding: 10px;                        /* CHANGED */
            font-size: 1rem;                     /* CHANGED */
            border-radius: 8px;                  /* CHANGED */
            border: 1px solid var(--md-sys-color-outline, #ccc); /* CHANGED */
          }                                       /* CHANGED */

          </style>
  
          <div class="wrapper">
               <md-icon-button id="micButton" aria-label="Microphone">
                  <svg class="mic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#4285f4"
                          d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path>
                      <path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path>
                      <path fill="#fbbc04"
                          d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path>
                      <path fill="#ea4335"
                          d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
                  </svg>
              </md-icon-button>
              <p>Tap on Mic to Speak</p>
              <p class="message"></p>

              <!-- ADDED input field + submit button -->    <!-- CHANGED -->
              <slot name="voice"></slot>                    <!-- CHANGED -->
              <div class="manual-input">                      <!-- CHANGED -->
                <input type="text" id="questionInput" placeholder="Or type your question here..." /> <!-- CHANGED -->
                <md-filled-button id="submitButton">Submit</md-filled-button>                          <!-- CHANGED -->
              </div>                                            <!-- CHANGED -->
          </div>
          `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const micButton = this.shadowRoot.getElementById("micButton");
    const messageEl = this.shadowRoot.querySelector(".message");

    // NEW variables for manual input   // CHANGED
    const questionInput = this.shadowRoot.getElementById("questionInput"); // CHANGED
    const submitButton = this.shadowRoot.getElementById("submitButton");   // CHANGED

    const voiceAnimation = document.querySelector(".googleVoice");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Web Speech API is not supported in this browser.");
      messageEl.textContent =
        "Your browser does not support voice recognition.";
      return;
    }

    const recognition = new SpeechRecognition();
    let isRecognizing = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micButton.addEventListener("click", () => {
      if (isRecognizing) {
        messageEl.textContent = "";
        isRecognizing = false;
        recognition.stop();
        removeAnimations();
      } else {
        messageEl.textContent = "Start Speaking...";
        recognition.start();
        isRecognizing = true;
        micButton.classList.add("ripple");
        voiceAnimation.classList.add("animate");
      }
    });

    // NEW event listener for manual submit button  // CHANGED
    submitButton.addEventListener("click", () => {   // CHANGED
      const typedQuestion = questionInput.value.trim();  // CHANGED
      if (typedQuestion !== "") {                          // CHANGED
        messageEl.textContent = typedQuestion;            // CHANGED
        speech(typedQuestion.toLowerCase());               // CHANGED
        questionInput.value = "";                           // CHANGED
      }                                                    // CHANGED
    });                                                   // CHANGED

    const removeAnimations = () => {
      micButton.classList.add("ending");
      voiceAnimation.classList.add("ending");
      setTimeout(() => {
        micButton.classList?.remove("ripple");
        voiceAnimation.classList?.remove("animate");
        micButton.classList.remove("ending");
        voiceAnimation.classList.remove("ending");
      }, 1200);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      speech(transcript.toLowerCase());
      isRecognizing = false;
      messageEl.textContent = transcript;
      removeAnimations();
    };

    recognition.onspeechend = () => {
      recognition.stop();
      isRecognizing = false;
      removeAnimations();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      messageEl.textContent = "You didn't say anything, try again.";
      isRecognizing = false;
      removeAnimations();
    };
  }
}
