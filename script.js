const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
const bootScreen = document.getElementById("bootScreen");
const startButton = document.getElementById("startButton");
const introScreen = document.getElementById("introScreen");
const introStart = document.getElementById("introStart");
const introKicker = document.getElementById("introKicker");
const introTitle = document.getElementById("introTitle");
const introLead = document.getElementById("introLead");
const introList = document.getElementById("introList");
const bootKicker = document.querySelector("[data-i18n='bootKicker']");
const bootCopy = document.querySelector("[data-i18n='bootCopy']");
const languageQuestion = document.getElementById("languageQuestion");
const languageButtons = [...document.querySelectorAll("[data-lang]")];
const infoPanel = document.getElementById("infoPanel");
const closePanel = document.getElementById("closePanel");
const panelKicker = document.getElementById("panelKicker");
const panelTitle = document.getElementById("panelTitle");
const panelBody = document.getElementById("panelBody");
const metaDescription = document.querySelector("meta[name='description']");
const radar = document.querySelector(".radar");
const radarButtons = [...document.querySelectorAll(".radar button")];
const touchControls = document.querySelector(".touch-controls");
const touchButtons = [...document.querySelectorAll("[data-touch]")];
const touchInteract = document.getElementById("touchInteract");
const touchFire = document.getElementById("touchFire");

const interactionPadding = 120;
const panelAutoClosePadding = 170;
const playerMaxSpeed = 320;
const RAG_ENDPOINT = "https://api.apisis.net";
const world = { width: 4200, height: 3000 };
const player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  angle: 0,
  moving: false
};
const camera = { x: 0, y: 0 };
const input = { up: false, down: false, left: false, right: false };
const state = {
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: Math.max(1, Math.min(window.devicePixelRatio || 1, 2)),
  started: false,
  lastTime: 0,
  lang: "es",
  nearest: null,
  openPlanetId: null,
  pulse: 0
};

const projectChat = {
  messages: [],
  busy: false
};

let chatUsage = null;

const planets = [
  {
    id: "profile",
    label: "Perfil",
    x: -980,
    y: -620,
    radius: 74,
    colorA: "#8f35ff",
    colorB: "#4b1291",
    accent: "#7df7ff",
    title: "Pablo Sanchez Abarca",
    kicker: "Systems Engineer",
    html: `
      <p>Brindo soporte IT, resuelvo problemas tecnicos y administro sistemas. Estoy enfocado en seguir creciendo hacia project management con machine learning e inteligencia artificial.</p>
      <div class="chips">
        <span>IT Support</span>
        <span>Systems</span>
        <span>AI Path</span>
      </div>
    `
  },
  {
    id: "projects",
    label: "Proyectos",
    x: 0,
    y: 0,
    radius: 168,
    colorA: "#fff2a8",
    colorB: "#ff7a18",
    accent: "#ffd166",
    type: "sun",
    title: "Proyectos",
    kicker: "",
    html: `
      <ul>
        <li>Chatbot profesional local conectado a Ollama.</li>
        <li>Sitio web interactivo romantico con sistema para enviar correos.</li>
        <li>Sistema empresarial de gestion de empleados, vacaciones y asistencia, actualmente en produccion y utilizado por +10 users.</li>
        <li>Dashboard de analisis de datos integrado.</li>
        <li>Agente de marketing automatizado con Ollama y Hermes Agent.</li>
        <li>Agente de IA automatizado que programa.</li>
        <li>Herramienta con interfaz para pruebas controladas de fuerza bruta en laboratorio.</li>
      </ul>
    `
  },
  {
    id: "experience",
    label: "Experiencia",
    x: 1280,
    y: -520,
    radius: 84,
    colorA: "#ff4fd8",
    colorB: "#5a0c4e",
    accent: "#ffd166",
    ring: true,
    title: "IT Support Technician",
    kicker: "Sistemas Integrados de Seguridad / 2022-2025",
    html: `
      <ul>
        <li>Diagnostico y resolucion de problemas en computadoras.</li>
        <li>Gestion y monitoreo de sistemas CCTV.</li>
        <li>Resolucion de errores en aplicaciones de camaras.</li>
      </ul>
    `
  },
  {
    id: "skills",
    label: "Habilidades",
    x: -1460,
    y: 360,
    radius: 92,
    colorA: "#7df7ff",
    colorB: "#073b4c",
    accent: "#c78cff",
    title: "Habilidades",
    kicker: "Soporte, datos y colaboracion",
    html: `
      <div class="chips">
        <span>Technical Support</span>
        <span>Troubleshooting</span>
        <span>SQL</span>
        <span>Database Management</span>
        <span>OOP Fundamentals</span>
        <span>Fast Learner</span>
        <span>Teamwork</span>
      </div>
    `
  },
  {
    id: "education",
    label: "Educacion",
    x: 780,
    y: 760,
    radius: 78,
    colorA: "#ffd166",
    colorB: "#5a3b08",
    accent: "#8fffcc",
    ring: true,
    title: "Educacion",
    kicker: "Costa Rica",
    html: `
      <ul>
        <li>Universidad Latina de Costa Rica: Computer Systems Engineering, actualmente matriculado. Graduacion estimada: 2026.</li>
        <li>Colegio Bilingue Jorge Volio Jimenez: High School Diploma, 2022.</li>
      </ul>
    `
  },
  {
    id: "certs",
    label: "Certs",
    x: -280,
    y: 1220,
    radius: 68,
    colorA: "#8fffcc",
    colorB: "#0d4a38",
    accent: "#ff4fd8",
    title: "Certificaciones",
    kicker: "En progreso",
    html: `
      <ul>
        <li>AWS Cloud Practitioner: fundamentos de cloud computing, servicios AWS y buenas practicas de arquitectura.</li>
        <li>Google Project Management Certificate: planificacion, Agile, comunicacion con stakeholders y workflow management.</li>
      </ul>
    `
  },
  {
    id: "contact",
    label: "Contacto",
    x: 1560,
    y: 260,
    radius: 70,
    colorA: "#c78cff",
    colorB: "#2c0a4d",
    accent: "#7df7ff",
    title: "Contacto",
    kicker: "Disponible para conectar",
    html: `
      <p><strong>Email:</strong> <a class="panel-link" href="mailto:pablo3020100@gmail.com">pablo3020100@gmail.com</a></p>
      <p><strong>Telefono:</strong> <a class="panel-link" href="tel:+50687296474">(+506) 8729-6474</a></p>
      <p><strong>GitHub:</strong> <a class="panel-link" href="https://github.com/pablosanchez123" target="_blank" rel="noreferrer">github.com/pablosanchez123</a></p>
    `
  }
];

const translations = {
  es: {
    pageTitle: "Pablo Sanchez Abarca | Portafolio de Proyectos",
    metaDescription: "Portafolio de proyectos interactivo de Pablo Sanchez Abarca, Systems Engineer e IT Support Technician.",
    bootKicker: "SYSTEMS ENGINEER",
    bootCopy: "Portafolio de Proyectos",
    languageQuestion: "Elige idioma",
    startButton: "INICIAR",
    intro: {
      kicker: "PORTAFOLIO INTERACTIVO",
      title: "Portafolio de Pablo Sanchez Abarca",
      lead: "Bienvenido. Este es mi portafolio convertido en un pequeno juego espacial. Explora libremente:",
      items: [
        { keys: "Planetas", text: "Cada planeta es una seccion de informacion (perfil, experiencia, proyectos...). Acercate y presiona E para abrirla." },
        { keys: "WASD / Flechas", text: "Muevete por el espacio con las teclas WASD o las flechas del teclado." },
        { keys: "Z", text: "Es interactivo: dispara laseres con la tecla Z para destruir los asteroides." },
        { keys: "Radar", text: "Usa el radar de la izquierda para viajar directo a cualquier seccion." }
      ],
      button: "EXPLORAR"
    },
    canvasLabel: "Minijuego espacial del portafolio de Pablo Sanchez Abarca",
    radarLabel: "Planetas del portafolio",
    closeLabel: "Cerrar",
    touchControlsLabel: "Controles tactiles",
    touchLabels: {
      up: "Arriba",
      left: "Izquierda",
      down: "Abajo",
      right: "Derecha",
      interact: "Interactuar",
      fire: "Disparar"
    },
    promptText: "E  INTERACTUAR",
    chat: {
      greeting: "Hola, soy el asistente local de Pablo. Preguntame sobre su experiencia, habilidades, estudios o proyectos.",
      thinking: "Consultando el servidor RAG...",
      error: "No se pudo conectar con el servidor RAG. Revisa que el servidor este corriendo, que Ollama este activo y que el endpoint permita peticiones del navegador.",
      empty: "Escribe una pregunta primero.",
      limitReached: "Alcanzaste el limite diario de preguntas. Intenta de nuevo manana.",
      usageLabel: "Preguntas hoy: {used}/{limit}"
    },
    planets: {
      profile: {
        label: "Perfil",
        title: "Pablo Sanchez Abarca",
        kicker: "Systems Engineer",
        html: `
          <p>Brindo soporte IT, resuelvo problemas tecnicos y administro sistemas. Estoy enfocado en seguir creciendo hacia project management con machine learning e inteligencia artificial.</p>
          <div class="chips">
            <span>IT Support</span>
            <span>Systems</span>
            <span>AI Path</span>
          </div>
        `
      },
      projects: {
        label: "Proyectos",
        title: "Proyectos",
        kicker: "",
        html: `
          <div class="project-hub">
            <div class="project-hub-main">
              <p>Este sol concentra los proyectos principales del portafolio y una prueba de chatbot local conectado a Ollama.</p>
              <div class="project-grid">
                <article class="project-card">
                  <h3>Chatbot profesional local</h3>
                  <p>Chat conectado a un modelo pequeno de Ollama para responder preguntas sobre mi perfil profesional usando contexto controlado.</p>
                  <span>Ollama / Agentic AI / RAG ligero</span>
                </article>
                <article class="project-card">
                  <h3>Sitio romantico interactivo</h3>
                  <p>Sitio web interactivo romantico con sistema para enviar correos y una experiencia visual personalizada.</p>
                  <span>Web / Email / UX</span>
                  <p><a class="panel-link" href="https://pablosanchez123.github.io/birthday-website-Alison/" target="_blank" rel="noreferrer">Ver sitio en vivo</a></p>
                </article>
                <article class="project-card">
                  <h3>Sistema empresarial - En produccion, +10 users</h3>
                  <p>Gestion de empleados y registros empresariales como vacaciones y asistencia, con app desktop/web, backend en AWS y base SQL.</p>
                  <span>React / Vite / Electron / FastAPI / AWS / SQL</span>
                </article>
                <article class="project-card">
                  <h3>Dashboard de datos</h3>
                  <p>Dashboard de analisis de datos integrado en la misma aplicacion empresarial para visualizar registros y metricas internas.</p>
                  <span>Analytics / SQL / Dashboard</span>
                </article>
                <article class="project-card">
                  <h3>Agente de marketing automatizado</h3>
                  <p>Agente en VM exportable a local con Ollama y Hermes Agent para estudiar mercado, generar publicaciones y programarlas con APIs externas de imagen y video.</p>
                  <span>Ollama / Hermes Agent / APIs / Automation</span>
                </article>
                <article class="project-card">
                  <h3>Agente IA programador</h3>
                  <p>Agente automatizado que programa y es orquestado por Hermes Agent hasta completar objetivos definidos.</p>
                  <span>Agentic AI / Code Automation</span>
                </article>
                <article class="project-card">
                  <h3>Laboratorio de fuerza bruta</h3>
                  <p>Herramienta con interfaz para pruebas controladas y autorizadas de fuerza bruta en entornos de laboratorio.</p>
                  <span>Security Lab / UI / Testing</span>
                </article>
              </div>
            </div>
            <section class="ai-chat" aria-label="Chatbot profesional local">
              <div class="chat-heading">
                <h3>Chatbot AI local</h3>
                <p>Servidor RAG conectado a Ollama con contexto profesional de Pablo.</p>
                <p class="chat-usage" id="projectChatUsage"></p>
              </div>
              <div class="chat-log" id="projectChatLog" aria-live="polite"></div>
              <form class="chat-form" id="projectChatForm">
                <input id="projectChatInput" type="text" placeholder="Pregunta sobre Pablo..." autocomplete="off">
                <button type="submit">Enviar</button>
              </form>
              <p class="chat-status" id="projectChatStatus"></p>
            </section>
          </div>
        `
      },
      experience: {
        label: "Experiencia",
        title: "IT Support Technician",
        kicker: "Sistemas Integrados de Seguridad / 2022-2025",
        html: `
          <ul>
            <li>Diagnostico y resolucion de problemas en computadoras.</li>
            <li>Gestion y monitoreo de sistemas CCTV.</li>
            <li>Resolucion de errores en aplicaciones de camaras.</li>
          </ul>
        `
      },
      skills: {
        label: "Habilidades",
        title: "Habilidades",
        kicker: "Soporte, datos y colaboracion",
        html: `
          <div class="chips">
            <span>Technical Support</span>
            <span>Troubleshooting</span>
            <span>SQL</span>
            <span>Database Management</span>
            <span>OOP Fundamentals</span>
            <span>Fast Learner</span>
            <span>Teamwork</span>
          </div>
        `
      },
      education: {
        label: "Educacion",
        title: "Educacion",
        kicker: "Costa Rica",
        html: `
          <ul>
            <li>Universidad Latina de Costa Rica: Computer Systems Engineering, actualmente matriculado. Graduacion estimada: 2026.</li>
            <li>Colegio Bilingue Jorge Volio Jimenez: High School Diploma, 2022.</li>
          </ul>
        `
      },
      certs: {
        label: "Certs",
        title: "Certificaciones",
        kicker: "En progreso",
        html: `
          <ul>
            <li>AWS Cloud Practitioner: fundamentos de cloud computing, servicios AWS y buenas practicas de arquitectura.</li>
            <li>Google Project Management Certificate: planificacion, Agile, comunicacion con stakeholders y workflow management.</li>
          </ul>
        `
      },
      contact: {
        label: "Contacto",
        title: "Contacto",
        kicker: "Disponible para conectar",
        html: `
          <p><strong>Email:</strong> <a class="panel-link" href="mailto:pablo3020100@gmail.com">pablo3020100@gmail.com</a></p>
          <p><strong>Telefono:</strong> <a class="panel-link" href="tel:+50687296474">(+506) 8729-6474</a></p>
          <p><strong>GitHub:</strong> <a class="panel-link" href="https://github.com/pablosanchez123" target="_blank" rel="noreferrer">github.com/pablosanchez123</a></p>
        `
      }
    }
  },
  en: {
    pageTitle: "Pablo Sanchez Abarca | Project Portfolio",
    metaDescription: "Interactive project portfolio for Pablo Sanchez Abarca, Systems Engineer and IT Support Technician.",
    bootKicker: "SYSTEMS ENGINEER",
    bootCopy: "Project Portfolio",
    languageQuestion: "Choose language",
    startButton: "START",
    intro: {
      kicker: "INTERACTIVE PORTFOLIO",
      title: "Pablo Sanchez Abarca's Portfolio",
      lead: "Welcome. This is my portfolio turned into a small space game. Explore freely:",
      items: [
        { keys: "Planets", text: "Each planet is an information section (profile, experience, projects...). Get close and press E to open it." },
        { keys: "WASD / Arrows", text: "Move through space with the WASD keys or the keyboard arrows." },
        { keys: "Z", text: "It is interactive: fire lasers with the Z key to destroy the asteroids." },
        { keys: "Radar", text: "Use the radar on the left to travel straight to any section." }
      ],
      button: "EXPLORE"
    },
    canvasLabel: "Space minigame for Pablo Sanchez Abarca's project portfolio",
    radarLabel: "Portfolio planets",
    closeLabel: "Close",
    touchControlsLabel: "Touch controls",
    touchLabels: {
      up: "Up",
      left: "Left",
      down: "Down",
      right: "Right",
      interact: "Interact",
      fire: "Fire"
    },
    promptText: "E  INTERACT",
    chat: {
      greeting: "Hi, I am Pablo's local assistant. Ask me about his experience, skills, education, or projects.",
      thinking: "Checking the RAG server...",
      error: "Could not connect to the RAG server. Make sure the server is running, Ollama is active, and the endpoint allows browser requests.",
      empty: "Type a question first.",
      limitReached: "You reached today's question limit. Try again tomorrow.",
      usageLabel: "Questions today: {used}/{limit}"
    },
    planets: {
      profile: {
        label: "Profile",
        title: "Pablo Sanchez Abarca",
        kicker: "Systems Engineer",
        html: `
          <p>I provide IT support, solve technical issues, and administer systems. I am focused on growing toward project management with machine learning and artificial intelligence.</p>
          <div class="chips">
            <span>IT Support</span>
            <span>Systems</span>
            <span>AI Path</span>
          </div>
        `
      },
      projects: {
        label: "Projects",
        title: "Projects",
        kicker: "",
        html: `
          <div class="project-hub">
            <div class="project-hub-main">
              <p>This sun gathers the main portfolio projects and a local chatbot demo connected to Ollama.</p>
              <div class="project-grid">
                <article class="project-card">
                  <h3>Local professional chatbot</h3>
                  <p>Chat connected to a small Ollama model that answers questions about my professional profile using controlled context.</p>
                  <span>Ollama / Agentic AI / Lightweight RAG</span>
                </article>
                <article class="project-card">
                  <h3>Interactive romantic website</h3>
                  <p>Interactive romantic website with an email-sending system and a personalized visual experience.</p>
                  <span>Web / Email / UX</span>
                  <p><a class="panel-link" href="https://pablosanchez123.github.io/birthday-website-Alison/" target="_blank" rel="noreferrer">View live site</a></p>
                </article>
                <article class="project-card">
                  <h3>Business management system - In production, 10+ users</h3>
                  <p>Employee management and company records such as vacations and attendance, with desktop/web app, AWS backend, and SQL database.</p>
                  <span>React / Vite / Electron / FastAPI / AWS / SQL</span>
                </article>
                <article class="project-card">
                  <h3>Data analysis dashboard</h3>
                  <p>Data analytics dashboard integrated into the same business application to visualize records and internal metrics.</p>
                  <span>Analytics / SQL / Dashboard</span>
                </article>
                <article class="project-card">
                  <h3>Automated marketing agent</h3>
                  <p>Exportable VM/local agent using Ollama and Hermes Agent to research markets, generate posts, and schedule them through external image and video APIs.</p>
                  <span>Ollama / Hermes Agent / APIs / Automation</span>
                </article>
                <article class="project-card">
                  <h3>AI coding agent</h3>
                  <p>Automated programming agent orchestrated by Hermes Agent until it completes defined objectives.</p>
                  <span>Agentic AI / Code Automation</span>
                </article>
                <article class="project-card">
                  <h3>Brute-force lab tool</h3>
                  <p>Interface-based tool for controlled and authorized brute-force testing in lab environments.</p>
                  <span>Security Lab / UI / Testing</span>
                </article>
              </div>
            </div>
            <section class="ai-chat" aria-label="Local professional chatbot">
              <div class="chat-heading">
                <h3>Local AI chatbot</h3>
                <p>RAG server connected to Ollama with Pablo's professional context.</p>
                <p class="chat-usage" id="projectChatUsage"></p>
              </div>
              <div class="chat-log" id="projectChatLog" aria-live="polite"></div>
              <form class="chat-form" id="projectChatForm">
                <input id="projectChatInput" type="text" placeholder="Ask about Pablo..." autocomplete="off">
                <button type="submit">Send</button>
              </form>
              <p class="chat-status" id="projectChatStatus"></p>
            </section>
          </div>
        `
      },
      experience: {
        label: "Experience",
        title: "IT Support Technician",
        kicker: "Sistemas Integrados de Seguridad / 2022-2025",
        html: `
          <ul>
            <li>Diagnosed and solved computer issues.</li>
            <li>Managed and monitored CCTV systems.</li>
            <li>Resolved errors in camera applications.</li>
          </ul>
        `
      },
      skills: {
        label: "Skills",
        title: "Skills",
        kicker: "Support, data, and collaboration",
        html: `
          <div class="chips">
            <span>Technical Support</span>
            <span>Troubleshooting</span>
            <span>SQL</span>
            <span>Database Management</span>
            <span>OOP Fundamentals</span>
            <span>Fast Learner</span>
            <span>Teamwork</span>
          </div>
        `
      },
      education: {
        label: "Education",
        title: "Education",
        kicker: "Costa Rica",
        html: `
          <ul>
            <li>Universidad Latina de Costa Rica: Computer Systems Engineering, currently enrolled. Expected graduation: 2026.</li>
            <li>Colegio Bilingue Jorge Volio Jimenez: High School Diploma, 2022.</li>
          </ul>
        `
      },
      certs: {
        label: "Certs",
        title: "Certifications",
        kicker: "In progress",
        html: `
          <ul>
            <li>AWS Cloud Practitioner: cloud computing fundamentals, AWS services, and architecture best practices.</li>
            <li>Google Project Management Certificate: planning, Agile, stakeholder communication, and workflow management.</li>
          </ul>
        `
      },
      contact: {
        label: "Contact",
        title: "Contact",
        kicker: "Open to connect",
        html: `
          <p><strong>Email:</strong> <a class="panel-link" href="mailto:pablo3020100@gmail.com">pablo3020100@gmail.com</a></p>
          <p><strong>Phone:</strong> <a class="panel-link" href="tel:+50687296474">(+506) 8729-6474</a></p>
          <p><strong>GitHub:</strong> <a class="panel-link" href="https://github.com/pablosanchez123" target="_blank" rel="noreferrer">github.com/pablosanchez123</a></p>
        `
      }
    }
  }
};

const spawn = { x: -1150, y: -620 };
player.x = spawn.x;
player.y = spawn.y;
camera.x = spawn.x;
camera.y = spawn.y;

const stars = Array.from({ length: 620 }, (_, index) => {
  const seed = Math.sin(index * 999) * 10000;
  const seed2 = Math.sin(index * 277) * 10000;
  return {
    x: (seed - Math.floor(seed)) * world.width - world.width / 2,
    y: (seed2 - Math.floor(seed2)) * world.height - world.height / 2,
    size: index % 9 === 0 ? 2 : 1,
    alpha: 0.35 + (index % 7) * 0.08,
    layer: 0.35 + (index % 4) * 0.15
  };
});

const asteroids = [];
const lasers = [];
const particles = [];
const combat = { score: 0, firing: false, lastShot: 0 };
const asteroidTarget = 16;
const laserSpeed = 660;
const laserCooldown = 170;

const keyMap = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right"
};

function getCopy() {
  return translations[state.lang] || translations.es;
}

function setChatStatus(message = "") {
  const status = document.getElementById("projectChatStatus");
  if (status) {
    status.textContent = message;
  }
}

function renderChatUsage() {
  const label = document.getElementById("projectChatUsage");
  if (!label) {
    return;
  }
  if (!chatUsage) {
    label.textContent = "";
    return;
  }
  label.textContent = getCopy().chat.usageLabel
    .replace("{used}", chatUsage.used)
    .replace("{limit}", chatUsage.limit);
}

async function refreshChatUsage() {
  try {
    const response = await fetch(`${RAG_ENDPOINT}/api/portfolio-chat/usage`);
    if (!response.ok) {
      return;
    }
    chatUsage = await response.json();
    renderChatUsage();
  } catch (error) {
    // Sin conexion con el servidor: se deja el contador como estaba.
  }
}

function setupProjectCards() {
  const cards = panelBody.querySelectorAll(".project-card");
  const label = state.lang === "es" ? "Leer proyecto" : "Read project";

  cards.forEach((card) => {
    if (card.querySelector(".project-toggle")) {
      return;
    }

    const title = card.querySelector("h3");
    if (!title) {
      return;
    }

    const header = document.createElement("div");
    header.className = "project-card-top";

    const button = document.createElement("button");
    button.className = "project-toggle";
    button.type = "button";
    button.textContent = ">";
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-expanded", "false");

    card.insertBefore(header, title);
    header.append(title, button);
  });
}

function renderProjectChatMessages() {
  const log = document.getElementById("projectChatLog");
  if (!log) {
    return;
  }

  log.replaceChildren();
  const messages = projectChat.messages.length
    ? projectChat.messages
    : [{ role: "assistant", content: getCopy().chat.greeting }];

  messages.forEach((message) => {
    const item = document.createElement("div");
    item.className = `chat-message ${message.role === "user" ? "user" : "assistant"}`;
    item.textContent = message.content;
    log.appendChild(item);
  });

  log.scrollTop = log.scrollHeight;
  renderChatUsage();
}

async function sendProjectChatMessage(question) {
  const copy = getCopy();

  projectChat.messages.push({ role: "user", content: question });
  projectChat.busy = true;
  renderProjectChatMessages();
  setChatStatus(copy.chat.thinking);

  try {
    const response = await fetch(`${RAG_ENDPOINT}/api/portfolio-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: question,
        lang: state.lang,
        history: projectChat.messages.slice(-10)
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (data?.detail?.usage) {
        chatUsage = data.detail.usage;
      }
      const error = new Error(`RAG server responded with ${response.status}`);
      error.friendlyMessage = response.status === 429 ? copy.chat.limitReached : copy.chat.error;
      throw error;
    }

    if (data?.usage) {
      chatUsage = data.usage;
    }

    const answer = data?.answer?.trim() || data?.message?.content?.trim() || data?.response?.trim();
    projectChat.messages.push({
      role: "assistant",
      content: answer || copy.chat.error
    });
    setChatStatus("");
  } catch (error) {
    projectChat.messages.push({
      role: "assistant",
      content: error.friendlyMessage || copy.chat.error
    });
    setChatStatus("");
  } finally {
    projectChat.busy = false;
    renderProjectChatMessages();
  }
}

function renderInfoPanel(planet) {
  const isProjectHub = planet.id === "projects";
  infoPanel.classList.toggle("is-project-hub", isProjectHub);
  panelKicker.textContent = planet.kicker;
  panelKicker.style.display = planet.kicker ? "" : "none";
  panelTitle.textContent = planet.title;
  panelBody.innerHTML = planet.html;
  if (isProjectHub) {
    setupProjectCards();
    renderProjectChatMessages();
    if (!chatUsage) {
      refreshChatUsage();
    }
  }
}

function isTypingTarget(target) {
  return target instanceof HTMLElement && (
    target.matches("input, textarea, select") || target.isContentEditable
  );
}

function handleProjectChatSubmit(event) {
  if (event.target?.id !== "projectChatForm") {
    return;
  }

  event.preventDefault();
  if (projectChat.busy) {
    return;
  }

  const input = document.getElementById("projectChatInput");
  const question = input?.value.trim() || "";
  if (!question) {
    setChatStatus(getCopy().chat.empty);
    return;
  }

  input.value = "";
  sendProjectChatMessage(question);
}

function handleProjectCardToggle(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest(".project-toggle");
  if (!button) {
    return;
  }

  const card = button.closest(".project-card");
  if (!card) {
    return;
  }

  const isExpanded = card.classList.toggle("is-expanded");
  button.setAttribute("aria-expanded", String(isExpanded));
}

function applyLanguage(lang) {
  const nextLang = lang in translations ? lang : "es";
  const copy = translations[nextLang];
  state.lang = nextLang;

  document.documentElement.lang = nextLang;
  document.title = copy.pageTitle;
  metaDescription.setAttribute("content", copy.metaDescription);
  canvas.setAttribute("aria-label", copy.canvasLabel);
  radar.setAttribute("aria-label", copy.radarLabel);
  closePanel.setAttribute("aria-label", copy.closeLabel);
  touchControls.setAttribute("aria-label", copy.touchControlsLabel);
  touchInteract.setAttribute("aria-label", copy.touchLabels.interact);
  touchFire.setAttribute("aria-label", copy.touchLabels.fire);

  bootKicker.textContent = copy.bootKicker;
  bootCopy.textContent = copy.bootCopy;
  languageQuestion.textContent = copy.languageQuestion;
  startButton.textContent = copy.startButton;

  introKicker.textContent = copy.intro.kicker;
  introTitle.textContent = copy.intro.title;
  introLead.textContent = copy.intro.lead;
  introStart.textContent = copy.intro.button;
  introList.replaceChildren();
  copy.intro.items.forEach((item) => {
    const li = document.createElement("li");
    const badge = document.createElement("span");
    badge.className = "intro-key";
    badge.textContent = item.keys;
    li.append(badge, document.createTextNode(` ${item.text}`));
    introList.appendChild(li);
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === nextLang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  touchButtons.forEach((button) => {
    button.setAttribute("aria-label", copy.touchLabels[button.dataset.touch]);
  });

  planets.forEach((planet) => {
    Object.assign(planet, copy.planets[planet.id]);
    const button = radarButtons.find((item) => item.dataset.planet === planet.id);
    if (button) {
      button.textContent = planet.label;
    }
  });

  if (state.openPlanetId) {
    const planet = planets.find((item) => item.id === state.openPlanetId);
    if (planet) {
      renderInfoPanel(planet);
    }
  }
}

function resizeCanvas() {
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  state.dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  canvas.width = Math.floor(state.width * state.dpr);
  canvas.height = Math.floor(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}

function showIntro() {
  if (state.started) {
    return;
  }
  bootScreen.classList.add("is-hidden");
  window.setTimeout(() => {
    bootScreen.style.display = "none";
  }, 280);
  introScreen.classList.remove("is-hidden");
  introStart.focus();
}

function advanceIntro() {
  if (bootScreen.classList.contains("is-hidden")) {
    startGame();
  } else {
    showIntro();
  }
}

function startGame(options = {}) {
  if (state.started) {
    return;
  }
  const instant = options.instant === true;
  state.started = true;
  bootScreen.classList.add("is-hidden");
  introScreen.classList.add("is-hidden");
  if (instant) {
    bootScreen.style.display = "none";
    introScreen.style.display = "none";
  } else {
    window.setTimeout(() => {
      bootScreen.style.display = "none";
      introScreen.style.display = "none";
    }, 360);
  }
  resizeCanvas();
  requestAnimationFrame(loop);
}

function setInput(key, value) {
  if (key in input) {
    input[key] = value;
  }
}

function updatePlayer(dt) {
  const axisX = Number(input.right) - Number(input.left);
  const axisY = Number(input.down) - Number(input.up);
  const length = Math.hypot(axisX, axisY) || 1;
  const targetVx = (axisX / length) * playerMaxSpeed;
  const targetVy = (axisY / length) * playerMaxSpeed;
  const accelerating = axisX !== 0 || axisY !== 0;
  const ease = accelerating ? 0.12 : 0.055;

  player.vx += ((accelerating ? targetVx : 0) - player.vx) * ease;
  player.vy += ((accelerating ? targetVy : 0) - player.vy) * ease;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.moving = accelerating || Math.hypot(player.vx, player.vy) > 16;

  if (player.moving) {
    player.angle = Math.atan2(player.vy, player.vx);
  }

  const edgeX = world.width / 2 - 90;
  const edgeY = world.height / 2 - 90;
  player.x = Math.max(-edgeX, Math.min(edgeX, player.x));
  player.y = Math.max(-edgeY, Math.min(edgeY, player.y));
}

function updateCamera() {
  camera.x += (player.x - camera.x) * 0.11;
  camera.y += (player.y - camera.y) * 0.11;
}

function getScreenPoint(x, y, layer = 1) {
  return {
    x: state.width / 2 + x - camera.x * layer,
    y: state.height / 2 + y - camera.y * layer
  };
}

function worldToScreen(x, y) {
  return {
    x: state.width / 2 + x - camera.x,
    y: state.height / 2 + y - camera.y
  };
}

function drawBackground(time) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.save();
  for (const star of stars) {
    const screen = getScreenPoint(star.x, star.y, star.layer);
    if (screen.x < -20 || screen.x > state.width + 20 || screen.y < -20 || screen.y > state.height + 20) {
      continue;
    }
    const blink = Math.sin(time * 0.002 + star.x * 0.01) * 0.18;
    ctx.globalAlpha = Math.max(0.15, star.alpha + blink);
    ctx.fillStyle = star.size > 1 ? "#c78cff" : "#ffffff";
    ctx.fillRect(Math.round(screen.x), Math.round(screen.y), star.size, star.size);
  }
  ctx.restore();
}

function getMinimapRect() {
  const margin = state.width < 760 ? 10 : 18;
  const width = state.width < 520 ? 104 : 150;
  return {
    x: state.width - width - margin,
    y: margin,
    width,
    height: Math.round(width * (world.height / world.width))
  };
}

function getMinimapPoint(x, y, rect) {
  return {
    x: rect.x + ((x + world.width / 2) / world.width) * rect.width,
    y: rect.y + ((y + world.height / 2) / world.height) * rect.height
  };
}

function drawMinimap() {
  const rect = getMinimapRect();
  const pad = 7;
  const map = {
    x: rect.x + pad,
    y: rect.y + pad,
    width: rect.width - pad * 2,
    height: rect.height - pad * 2
  };

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
  ctx.strokeStyle = "rgba(125, 247, 255, 0.62)";
  ctx.lineWidth = 1;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1);

  ctx.strokeStyle = "rgba(199, 140, 255, 0.24)";
  ctx.strokeRect(map.x + 0.5, map.y + 0.5, map.width - 1, map.height - 1);

  const viewLeft = camera.x - state.width / 2;
  const viewTop = camera.y - state.height / 2;
  const view = {
    x: map.x + ((viewLeft + world.width / 2) / world.width) * map.width,
    y: map.y + ((viewTop + world.height / 2) / world.height) * map.height,
    width: (state.width / world.width) * map.width,
    height: (state.height / world.height) * map.height
  };
  ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
  ctx.strokeRect(view.x, view.y, view.width, view.height);

  asteroids.forEach((asteroid) => {
    const point = getMinimapPoint(asteroid.x, asteroid.y, map);
    ctx.fillStyle = "rgba(180, 170, 200, 0.5)";
    ctx.fillRect(Math.round(point.x) - 1, Math.round(point.y) - 1, 2, 2);
  });

  planets.forEach((planet) => {
    const point = getMinimapPoint(planet.x, planet.y, map);
    ctx.fillStyle = planet === state.nearest ? planet.accent : "rgba(245, 237, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, planet === state.nearest ? 3.5 : 2.4, 0, Math.PI * 2);
    ctx.fill();
  });

  const playerPoint = getMinimapPoint(player.x, player.y, map);
  ctx.fillStyle = "#ffd166";
  ctx.strokeStyle = "rgba(255, 209, 102, 0.45)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(playerPoint.x, playerPoint.y, 3.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function makeAsteroidShape() {
  const sides = 8 + Math.floor(Math.random() * 4);
  const points = [];
  for (let i = 0; i < sides; i += 1) {
    points.push(0.72 + Math.random() * 0.42);
  }
  return points;
}

function spawnAsteroid(config = {}) {
  const radius = config.radius ?? randomBetween(16, 44);
  let x = config.x;
  let y = config.y;
  if (x === undefined || y === undefined) {
    for (let attempt = 0; attempt < 24; attempt += 1) {
      x = randomBetween(-world.width / 2 + 80, world.width / 2 - 80);
      y = randomBetween(-world.height / 2 + 80, world.height / 2 - 80);
      const nearPlanet = planets.some((planet) => Math.hypot(x - planet.x, y - planet.y) < planet.radius + 160);
      const nearPlayer = Math.hypot(x - player.x, y - player.y) < 280;
      if (!nearPlanet && !nearPlayer) {
        break;
      }
    }
  }
  const speed = randomBetween(10, 44);
  const dir = Math.random() * Math.PI * 2;
  return {
    x,
    y,
    vx: config.vx ?? Math.cos(dir) * speed,
    vy: config.vy ?? Math.sin(dir) * speed,
    radius,
    angle: Math.random() * Math.PI * 2,
    spin: randomBetween(-0.7, 0.7),
    points: makeAsteroidShape()
  };
}

function initAsteroids() {
  asteroids.length = 0;
  for (let i = 0; i < asteroidTarget; i += 1) {
    asteroids.push(spawnAsteroid());
  }
}

function updateAsteroids(dt) {
  const halfW = world.width / 2 + 60;
  const halfH = world.height / 2 + 60;
  for (const asteroid of asteroids) {
    asteroid.x += asteroid.vx * dt;
    asteroid.y += asteroid.vy * dt;
    asteroid.angle += asteroid.spin * dt;
    if (asteroid.x > halfW) asteroid.x = -halfW;
    else if (asteroid.x < -halfW) asteroid.x = halfW;
    if (asteroid.y > halfH) asteroid.y = -halfH;
    else if (asteroid.y < -halfH) asteroid.y = halfH;
  }
}

function spawnExplosion(x, y, radius) {
  const count = Math.round(10 + radius * 0.5);
  for (let i = 0; i < count; i += 1) {
    const dir = Math.random() * Math.PI * 2;
    const speed = randomBetween(40, 210);
    particles.push({
      x,
      y,
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed,
      life: randomBetween(0.3, 0.7),
      maxLife: 0.7,
      size: 1 + Math.floor(Math.random() * 3),
      color: Math.random() < 0.5 ? "#ffd166" : "#7df7ff"
    });
  }
}

function destroyAsteroid(index) {
  const asteroid = asteroids.splice(index, 1)[0];
  combat.score += 1;
  spawnExplosion(asteroid.x, asteroid.y, asteroid.radius);
  if (asteroid.radius > 28) {
    for (let k = 0; k < 2; k += 1) {
      asteroids.push(spawnAsteroid({
        x: asteroid.x,
        y: asteroid.y,
        radius: asteroid.radius * 0.52,
        vx: asteroid.vx + randomBetween(-46, 46),
        vy: asteroid.vy + randomBetween(-46, 46)
      }));
    }
  } else if (asteroids.length < asteroidTarget) {
    asteroids.push(spawnAsteroid());
  }
}

function fireLaser(time) {
  if (!state.started || state.openPlanetId) {
    return;
  }
  if (time - combat.lastShot < laserCooldown) {
    return;
  }
  combat.lastShot = time;
  const angle = player.angle;
  lasers.push({
    x: player.x + Math.cos(angle) * 26,
    y: player.y + Math.sin(angle) * 26,
    vx: Math.cos(angle) * laserSpeed + player.vx,
    vy: Math.sin(angle) * laserSpeed + player.vy,
    angle,
    life: 1.1
  });
}

function updateLasers(dt) {
  for (let i = lasers.length - 1; i >= 0; i -= 1) {
    const laser = lasers[i];
    laser.x += laser.vx * dt;
    laser.y += laser.vy * dt;
    laser.life -= dt;
    let hit = false;
    for (let j = asteroids.length - 1; j >= 0; j -= 1) {
      const asteroid = asteroids[j];
      if (Math.hypot(laser.x - asteroid.x, laser.y - asteroid.y) <= asteroid.radius) {
        destroyAsteroid(j);
        hit = true;
        break;
      }
    }
    if (hit || laser.life <= 0) {
      lasers.splice(i, 1);
    }
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.96;
    particle.vy *= 0.96;
    particle.life -= dt;
    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function updateCombat(time, dt) {
  if (!state.started) {
    return;
  }
  if (combat.firing) {
    fireLaser(time);
  }
  updateAsteroids(dt);
  updateLasers(dt);
  updateParticles(dt);
}

function drawAsteroids() {
  for (const asteroid of asteroids) {
    const pos = worldToScreen(asteroid.x, asteroid.y);
    const margin = asteroid.radius * 2;
    if (pos.x < -margin || pos.x > state.width + margin || pos.y < -margin || pos.y > state.height + margin) {
      continue;
    }
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(asteroid.angle);

    const sides = asteroid.points.length;
    ctx.beginPath();
    for (let i = 0; i < sides; i += 1) {
      const ang = (i / sides) * Math.PI * 2;
      const r = asteroid.radius * asteroid.points[i];
      const px = Math.cos(ang) * r;
      const py = Math.sin(ang) * r;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();

    const grad = ctx.createLinearGradient(-asteroid.radius, -asteroid.radius, asteroid.radius, asteroid.radius);
    grad.addColorStop(0, "#6b6480");
    grad.addColorStop(1, "#2a2438");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "rgba(199, 140, 255, 0.55)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(18, 14, 28, 0.6)";
    for (let i = 0; i < 3; i += 1) {
      const cang = i * 2.1 + asteroid.radius;
      const cd = asteroid.radius * 0.34;
      ctx.beginPath();
      ctx.arc(Math.cos(cang) * cd, Math.sin(cang) * cd, asteroid.radius * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawLasers() {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const laser of lasers) {
    const pos = worldToScreen(laser.x, laser.y);
    const tailX = pos.x - Math.cos(laser.angle) * 18;
    const tailY = pos.y - Math.sin(laser.angle) * 18;
    ctx.strokeStyle = "rgba(255, 79, 216, 0.9)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticles() {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const particle of particles) {
    const pos = worldToScreen(particle.x, particle.y);
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.fillRect(Math.round(pos.x), Math.round(pos.y), particle.size, particle.size);
  }
  ctx.restore();
}

function drawPlanetFocusLabel(planet) {
  if (planet === state.nearest) {
    ctx.strokeStyle = planet.accent;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 7]);
    ctx.strokeRect(-planet.radius - 16, -planet.radius - 16, planet.radius * 2 + 32, planet.radius * 2 + 32);
    ctx.setLineDash([]);
    drawPrompt(planet);
  }

  drawPixelLabel(planet.label, 0, planet.radius + 30, planet === state.nearest ? planet.accent : "#f5edff");
}

function drawSun(planet, time) {
  const pos = worldToScreen(planet.x, planet.y);
  const pulse = Math.sin(time * 0.003) * 0.5 + 0.5;
  const flare = Math.sin(time * 0.0017) * 0.5 + 0.5;

  ctx.save();
  ctx.translate(pos.x, pos.y);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const corona = ctx.createRadialGradient(0, 0, planet.radius * 0.1, 0, 0, planet.radius * 3.2);
  corona.addColorStop(0, "rgba(255, 244, 178, 0.92)");
  corona.addColorStop(0.24, "rgba(255, 209, 102, 0.46)");
  corona.addColorStop(0.58, "rgba(255, 122, 24, 0.18)");
  corona.addColorStop(1, "rgba(255, 122, 24, 0)");
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(0, 0, planet.radius * (2.6 + pulse * 0.18), 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 22; i += 1) {
    const angle = i * ((Math.PI * 2) / 22) + time * 0.00045;
    const inner = planet.radius * (0.9 + (i % 3) * 0.04);
    const outer = planet.radius * (1.18 + ((i + 1) % 4) * 0.16 + flare * 0.12);
    ctx.strokeStyle = i % 2 === 0 ? "rgba(255, 209, 102, 0.5)" : "rgba(255, 122, 24, 0.38)";
    ctx.lineWidth = i % 2 === 0 ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    ctx.stroke();
  }
  ctx.restore();

  const surface = ctx.createRadialGradient(-planet.radius * 0.34, -planet.radius * 0.4, 8, 0, 0, planet.radius);
  surface.addColorStop(0, "#fff8c7");
  surface.addColorStop(0.34, planet.colorA);
  surface.addColorStop(0.72, planet.colorB);
  surface.addColorStop(1, "#8f2f00");
  ctx.fillStyle = surface;
  ctx.beginPath();
  ctx.arc(0, 0, planet.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.34;
  ctx.strokeStyle = "#fff8c7";
  ctx.lineWidth = 5;
  for (let i = 0; i < 5; i += 1) {
    const y = -planet.radius * 0.48 + i * planet.radius * 0.24 + Math.sin(time * 0.002 + i) * 5;
    ctx.beginPath();
    ctx.ellipse(0, y, planet.radius * (0.56 + i * 0.05), planet.radius * 0.08, Math.sin(i) * 0.2, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  drawPlanetFocusLabel(planet);
  ctx.restore();
}

function drawPlanet(planet, time) {
  if (planet.type === "sun") {
    drawSun(planet, time);
    return;
  }

  const pos = worldToScreen(planet.x, planet.y);
  const glow = planet === state.nearest ? 0.9 : 0.42;
  const pulse = Math.sin(time * 0.004 + planet.radius) * 0.5 + 0.5;

  ctx.save();
  ctx.translate(pos.x, pos.y);

  const aura = ctx.createRadialGradient(0, 0, planet.radius * 0.3, 0, 0, planet.radius * 1.9);
  aura.addColorStop(0, planet.accent);
  aura.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.globalAlpha = 0.15 + glow * 0.18;
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, planet.radius * (1.85 + pulse * 0.08), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  if (planet.ring) {
    ctx.save();
    ctx.rotate(-0.32);
    ctx.strokeStyle = planet.accent;
    ctx.globalAlpha = 0.52;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 0, planet.radius * 1.55, planet.radius * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const surface = ctx.createRadialGradient(-planet.radius * 0.35, -planet.radius * 0.38, 6, 0, 0, planet.radius);
  surface.addColorStop(0, planet.colorA);
  surface.addColorStop(0.72, planet.colorB);
  surface.addColorStop(1, "#09030f");
  ctx.fillStyle = surface;
  ctx.beginPath();
  ctx.arc(0, 0, planet.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 6; i += 1) {
    const craterAngle = i * 1.7 + planet.radius * 0.03;
    const craterDistance = planet.radius * (0.18 + (i % 3) * 0.18);
    const x = Math.cos(craterAngle) * craterDistance;
    const y = Math.sin(craterAngle) * craterDistance;
    ctx.fillRect(Math.round(x), Math.round(y), 8 + (i % 2) * 6, 4 + (i % 3) * 3);
  }
  ctx.globalAlpha = 1;

  drawPlanetFocusLabel(planet);
  ctx.restore();
}

function drawPrompt(planet) {
  const promptText = getCopy().promptText;
  const height = 32;
  ctx.font = "700 13px Courier New, monospace";
  const width = Math.max(132, Math.ceil(ctx.measureText(promptText).width + 30));
  const x = -width / 2;
  const y = -planet.radius - 58;
  ctx.fillStyle = "rgba(5, 2, 9, 0.86)";
  ctx.strokeStyle = planet.accent;
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = planet.accent;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(promptText, 0, y + height / 2 + 1);
}

function drawPixelLabel(text, x, y, color) {
  ctx.font = "700 13px Courier New, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const metrics = ctx.measureText(text);
  const pad = 8;
  ctx.fillStyle = "rgba(5, 2, 9, 0.72)";
  ctx.fillRect(Math.round(x - metrics.width / 2 - pad), Math.round(y - 13), Math.round(metrics.width + pad * 2), 26);
  ctx.strokeStyle = "rgba(199, 140, 255, 0.26)";
  ctx.strokeRect(Math.round(x - metrics.width / 2 - pad), Math.round(y - 13), Math.round(metrics.width + pad * 2), 26);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y + 1);
}

function drawRocketThruster(time, speedRatio) {
  const flicker = Math.sin(time * 0.035) * 0.5 + 0.5;
  const emberShift = (time * 0.05) % 1;
  const flameLength = 34 + speedRatio * 38 + flicker * 12;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const glow = ctx.createRadialGradient(0, 38, 3, 0, 48 + flameLength * 0.35, flameLength);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.62)");
  glow.addColorStop(0.28, "rgba(255, 209, 102, 0.48)");
  glow.addColorStop(0.62, "rgba(125, 247, 255, 0.28)");
  glow.addColorStop(1, "rgba(125, 247, 255, 0)");
  ctx.globalAlpha = 0.48 + speedRatio * 0.2;
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(0, 50 + flameLength * 0.28, 22 + speedRatio * 8, flameLength * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.76;
  ctx.fillStyle = "rgba(125, 247, 255, 0.72)";
  ctx.beginPath();
  ctx.moveTo(-9, 27);
  ctx.quadraticCurveTo(-24, 44 + flicker * 12, -6, 34 + flameLength);
  ctx.lineTo(0, 48 + flameLength + flicker * 10);
  ctx.lineTo(6, 34 + flameLength);
  ctx.quadraticCurveTo(24, 44 + flicker * 12, 9, 27);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(255, 209, 102, 0.86)";
  ctx.beginPath();
  ctx.moveTo(-6, 29);
  ctx.quadraticCurveTo(-14, 42 + flicker * 8, -3, 29 + flameLength * 0.72);
  ctx.lineTo(0, 39 + flameLength * 0.9);
  ctx.lineTo(3, 29 + flameLength * 0.72);
  ctx.quadraticCurveTo(14, 42 + flicker * 8, 6, 29);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.82;
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  ctx.beginPath();
  ctx.moveTo(-3, 31);
  ctx.quadraticCurveTo(-7, 41, 0, 35 + flameLength * 0.5);
  ctx.quadraticCurveTo(7, 41, 3, 31);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 9; i += 1) {
    const lane = i - 4;
    const drift = Math.sin(time * 0.014 + i * 1.9) * 5;
    const x = lane * 5 + drift;
    const y = 38 + ((emberShift * flameLength + i * 13) % flameLength);
    const size = i % 3 === 0 ? 3 : 2;
    ctx.globalAlpha = 0.18 + (i % 4) * 0.08;
    ctx.fillStyle = i % 2 === 0 ? "#7df7ff" : "#ffd166";
    ctx.fillRect(Math.round(x), Math.round(y), size, size);
  }

  ctx.restore();
}

function drawAstronaut(time) {
  const pos = worldToScreen(player.x, player.y);
  const bob = Math.sin(time * 0.004) * 4;
  const speedRatio = Math.min(1, Math.hypot(player.vx, player.vy) / playerMaxSpeed);

  ctx.save();
  ctx.translate(Math.round(pos.x), Math.round(pos.y + bob));
  ctx.rotate(player.moving ? player.angle + Math.PI / 2 : Math.sin(time * 0.0015) * 0.08);

  if (player.moving) {
    drawRocketThruster(time, speedRatio);
  }

  ctx.fillStyle = "#f5edff";
  ctx.fillRect(-14, -16, 28, 32);
  ctx.fillRect(-10, 12, 8, 20);
  ctx.fillRect(2, 12, 8, 20);
  ctx.fillRect(-22, -6, 8, 22);
  ctx.fillRect(14, -6, 8, 22);

  ctx.fillStyle = "#c78cff";
  ctx.fillRect(-17, -19, 34, 8);
  ctx.fillRect(-17, -15, 4, 27);
  ctx.fillRect(13, -15, 4, 27);

  ctx.fillStyle = "#12121f";
  ctx.fillRect(-10, -10, 20, 13);
  ctx.fillStyle = "#7df7ff";
  ctx.fillRect(-7, -8, 14, 5);
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillRect(-5, -7, 4, 2);

  ctx.fillStyle = "#8f35ff";
  ctx.fillRect(-19, 15, 10, 8);
  ctx.fillRect(9, 15, 10, 8);
  ctx.restore();
}

function updateNearest() {
  let nearest = null;
  let nearestDistance = Infinity;
  for (const planet of planets) {
    const distance = Math.hypot(player.x - planet.x, player.y - planet.y);
    if (distance < planet.radius + interactionPadding && distance < nearestDistance) {
      nearest = planet;
      nearestDistance = distance;
    }
  }
  state.nearest = nearest;
  radarButtons.forEach((button) => {
    button.classList.toggle("is-active", nearest && button.dataset.planet === nearest.id);
  });

  if (state.openPlanetId) {
    const openPlanet = planets.find((planet) => planet.id === state.openPlanetId);
    const openDistance = openPlanet ? Math.hypot(player.x - openPlanet.x, player.y - openPlanet.y) : Infinity;
    if (!openPlanet || openDistance > openPlanet.radius + panelAutoClosePadding) {
      closeInfoPanel();
    }
  }
}

function openPlanet(planet) {
  if (!planet) {
    return;
  }
  Object.keys(input).forEach((key) => {
    input[key] = false;
  });
  player.vx = 0;
  player.vy = 0;
  player.moving = false;
  state.openPlanetId = planet.id;
  renderInfoPanel(planet);
  infoPanel.classList.add("is-open");
  infoPanel.setAttribute("aria-hidden", "false");
}

function closeInfoPanel() {
  state.openPlanetId = null;
  infoPanel.classList.remove("is-open");
  infoPanel.classList.remove("is-project-hub");
  infoPanel.setAttribute("aria-hidden", "true");
}

function flyToPlanet(id) {
  const planet = planets.find((item) => item.id === id);
  if (!planet) {
    return;
  }
  player.x = planet.x - planet.radius - 96;
  player.y = planet.y;
  player.vx = 0;
  player.vy = 0;
  camera.x = player.x;
  camera.y = player.y;
  updateNearest();
  openPlanet(planet);
}

function handleCanvasPointer(event) {
  if (!state.started) {
    startGame();
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const pointer = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
  for (const planet of planets) {
    const pos = worldToScreen(planet.x, planet.y);
    if (Math.hypot(pointer.x - pos.x, pointer.y - pos.y) <= planet.radius + 16) {
      openPlanet(planet);
      return;
    }
  }
}

function draw(time) {
  ctx.clearRect(0, 0, state.width, state.height);
  drawBackground(time);
  drawAsteroids();
  planets
    .slice()
    .sort((a, b) => a.y - b.y)
    .forEach((planet) => drawPlanet(planet, time));
  drawLasers();
  drawAstronaut(time);
  drawParticles();
  drawMinimap();
}

function loop(time) {
  const dt = Math.min(0.033, (time - state.lastTime) / 1000 || 0.016);
  state.lastTime = time;
  updatePlayer(dt);
  updateCamera();
  updateNearest();
  updateCombat(time, dt);
  draw(time);
  requestAnimationFrame(loop);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("keydown", (event) => {
  if (isTypingTarget(event.target)) {
    if (event.key === "Escape") {
      event.target.blur();
      closeInfoPanel();
    }
    return;
  }

  if (!state.started && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    advanceIntro();
    return;
  }

  if (event.key in keyMap) {
    event.preventDefault();
    setInput(keyMap[event.key], true);
  }

  if ((event.key === "e" || event.key === "E" || event.key === " ") && state.started) {
    event.preventDefault();
    openPlanet(state.nearest);
  }

  if ((event.key === "z" || event.key === "Z") && state.started) {
    event.preventDefault();
    combat.firing = true;
  }

  if (event.key === "Escape") {
    closeInfoPanel();
  }
});

window.addEventListener("keyup", (event) => {
  if (isTypingTarget(event.target)) {
    return;
  }

  if (event.key in keyMap) {
    event.preventDefault();
    setInput(keyMap[event.key], false);
  }

  if (event.key === "z" || event.key === "Z") {
    combat.firing = false;
  }
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});

startButton.addEventListener("click", showIntro);
introStart.addEventListener("click", () => startGame());
closePanel.addEventListener("click", closeInfoPanel);
canvas.addEventListener("pointerdown", handleCanvasPointer);
touchInteract.addEventListener("click", () => openPlanet(state.nearest));

const stopFiring = (event) => {
  event.preventDefault();
  combat.firing = false;
};
touchFire.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  startGame();
  combat.firing = true;
});
touchFire.addEventListener("pointerup", stopFiring);
touchFire.addEventListener("pointercancel", stopFiring);
touchFire.addEventListener("pointerleave", stopFiring);
panelBody.addEventListener("submit", handleProjectChatSubmit);
panelBody.addEventListener("click", handleProjectCardToggle);

radarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startGame();
    flyToPlanet(button.dataset.planet);
  });
});

touchButtons.forEach((button) => {
  const direction = button.dataset.touch;
  const start = (event) => {
    event.preventDefault();
    setInput(direction, true);
  };
  const end = (event) => {
    event.preventDefault();
    setInput(direction, false);
  };
  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointercancel", end);
  button.addEventListener("pointerleave", end);
});

const query = new URLSearchParams(window.location.search);
applyLanguage(query.get("lang") === "en" ? "en" : "es");
initAsteroids();
resizeCanvas();
draw(0);

if (query.get("play") === "1") {
  window.setTimeout(() => startGame({ instant: true }), 80);
}
