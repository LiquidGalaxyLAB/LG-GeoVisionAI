export class About extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .container {
          max-width: 43.75rem; 
          margin: 0 auto;
          padding: 1.875rem; 
          border-radius: 12px;
          text-align: center;
          padding-block-end: 6.25rem;
        }

        img {
          max-width: 100%; 
          block-size: auto; 
          border-radius: 8px;
          margin-bottom: 1.875rem; 
          box-shadow: var(--md-elevation-level1);
          object-fit: contain;
        }

        p {
          font-size: clamp(1rem, 1.2vw + 0.2rem, 1.1rem);
          line-height: 1.6;
          margin-bottom: 0.9375rem; 
          color: var(--md-sys-color-on-surface);
        }

        strong {
          color: var(--md-sys-color-tertiary);
        }

        h2 {
          font-size: 1.5rem;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          color: var(--md-sys-color-primary);
        }

        ul {
          text-align: left;
          margin: 0 auto;
          max-width: 37.5rem;
          padding-left: 1.25rem;
          color: var(--md-sys-color-on-surface);
        }

        li {
          margin-bottom: 0.75rem;
          font-size: clamp(1rem, 1.2vw + 0.2rem, 1.1rem);
          line-height: 1.5;
        }

        .footer {
          text-align: center;
          margin-top: 2rem;
          font-size: 1rem;
          color: var(--md-sys-color-on-surface);
        }


        @media (max-width: 48rem) { 
          .container {
            padding: 1.25rem; 
          }
        }

        @media (max-width: 30rem) { 
          .container {
            padding: 0.9375rem; 
            margin: 0 0.625rem; 
          }
        }
      </style>
      <div class="container">
        <img src="/assets/logo.jpg" alt="GeoVisionAI Logo" height="350px" width="350px"/>

        <p>
          <strong>GeoVisionAI</strong> enhances the Liquid Galaxy platform by integrating AI for
          real-time analysis and visualization of geospatial data.
        </p>
        <p>
          Users can interact via text or voice—asking questions and receive visual and contextual AI-generated responses.
          Using the Web Speech API and dynamic KML visualizations, the system makes complex geographic data accessible to
          researchers, students, and policymakers.
        </p>
        <p>
          For more immersive experience, AI-generated soundscapes
          (e.g., wind or fire) accompany the environmental data. GeoVisionAI offers a practical, interactive,
          and intuitive way to explore global insights.
        </p>
        <h2>How to Use GeoVisionAI?</h2>
        <ul>
          <li><strong>Step 1: Get Your API Keys</strong></li>
          <div>
            <p><strong><u>Gemini API Key:</u></strong> Go to Google AI Studio --> Click “Get API Key” --> Create a new one under “My First Project” --> Copy the generated API key.</p>
            <p><strong><u>OpenCage API Key:</u></strong> Go to OpenCage --> Sign up --> Choose Forward Geocoding --> Configure account --> Copy the generated API key.</p>
            <p><strong><u>Freesound API Key:</u></strong> Join Freesound --> Confirm via email --> Visit <a href="https://freesound.org/apiv2/apply" target="_blank" style = "color : red">freesound.org/apiv2/apply</a> --> Apply for the key --> Copy your Client ID (API key).</p>
          </div>

          <li><strong>Step 2: Add API Keys to the WebApp</strong></li>
          <div>
            <ul>
              <li>Open the app --> Go to the “Settings” tab --> Paste the keys into the respective fields.</li>
              <li>Click Save API Keys --> Wait for the “API Keys Saved Successfully!” toast message.</li>
            </ul>
          </div>

          <li><strong>Step 3: Connect to Liquid Galaxy</strong></li>
          <div>
            <ul>
              <li>Make sure your LG server is up and running.</li>
              <li>Run ngrok http <your port number> eg.(ngrok http 3000) --> Copy the public URL.</li>
              <li>Paste this URL into the “Server Address” field in the Settings tab.</li>
              <li>Fill out the other required LG connection fields.</li>
              <li>If it says “Connected to LG!” and shows the GeoVisionAI logo on LG --> You're good to go!</li>
            </ul>
          </div>

          <li><strong>Step 4: Ask Questions!</strong></li>
          <div>
            <p>Use voice or type questions in the Gemini tab --> Click “Ask AI”.</p>
            <p><strong>Try Sample Queries:</strong></p>
            <ul>
              <li>“What are the effects of rising sea levels on Maldives? Answer in 2 lines.”</li>
              <li>“What is the capital of India?”</li>
              <li>“Take me to Tokyo”</li>
              <li>“Show me Mount Everest”</li>
            </ul>
          </div>

          <li><strong>Expected Results:</strong></li>
          <div>
            <ul>
              <li>Fly-to animation on LG setup</li>
              <li>Dynamic balloon placemarks with AI-generated story</li>
              <li>AI narration of the generated story</li>
              <li>Use “Start Orbit” and “Stop Orbit” buttons to orbit around (Zoom level: 10)</li>
            </ul>
          </div>
        </ul>
      </div>
      <div class="footer">
          <p>Developer: <strong>Anishka</strong></p>
          <p> Thanks to my main mentor: Claudia and Secondary Mentors: Yash Raj, VictorSB, Rosemarie Garcia and Lopez</p>
          <p>
            And thanks to the team of the Liquid Galaxy LAB Lleida, Headquarters of the Liquid Galaxy project: 
            Alba, Paula, Josep, Jordi, Oriol, Sharon, Alejandro, Marc, and admin Andreu, 
            for their continuous support on my project.  
            Info in <a href="http://www.liquidgalaxy.eu" target="_blank" style = "color:red">www.liquidgalaxy.eu</a>
          </p>

          <p>Made with ❤️ for the Liquid Galaxy Community!</p>
      </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {}
  
  
}
customElements.define("lg-about", About);
