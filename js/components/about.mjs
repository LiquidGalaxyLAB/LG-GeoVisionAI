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
          height: auto; 
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
        <img src="/assets/2.webp" alt="GeoVisionAI Logo" height=350px width=350px/>

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
      </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
  }
}
customElements.define("lg-about", About);
