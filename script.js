const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
const landing = document.getElementById("landing");
const gameShell = document.getElementById("gameShell");
const gameWindow = document.getElementById("gameWindow");
const gameVeil = document.getElementById("gameVeil");
const gameWindowStatus = document.getElementById("gameWindowStatus");
const landingEnterGame = document.getElementById("landingEnterGame");
const heroCtaGame = document.getElementById("heroCtaGame");
const scrollButtons = [...document.querySelectorAll("[data-scroll]")];
const landingNavLinks = [...document.querySelectorAll(".landing-nav-links [data-scroll]")];
const landingSections = [...document.querySelectorAll(".landing-main > section")];
const languageButtons = [...document.querySelectorAll("[data-lang]")];
const themeToggle = document.getElementById("themeToggle");
let themeLabels = { toLight: "", toDark: "" };
const infoPanel = document.getElementById("infoPanel");
const closePanel = document.getElementById("closePanel");
const panelKicker = document.getElementById("panelKicker");
const panelTitle = document.getElementById("panelTitle");
const panelBody = document.getElementById("panelBody");
const metaDescription = document.querySelector("meta[name='description']");
const radar = document.querySelector(".radar");
const radarButtons = [...document.querySelectorAll(".radar button")];
const mobileNav = document.getElementById("mobileNav");
const mobileNavButtons = [...document.querySelectorAll(".mobile-nav button")];
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
  width: 960,
  height: 540,
  dpr: Math.max(1, Math.min(window.devicePixelRatio || 1, 2)),
  started: false,
  focused: false,
  lastTime: 0,
  lang: "es",
  nearest: null,
  openPlanetId: null,
  pulse: 0,
  gameStatusActive: "activo"
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
        <li>Dashboard de vulnerabilidades (CVE/NVD) con datos en vivo de la NVD.</li>
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
    landing: {
      nav: {
        game: "Juego",
        profile: "Perfil",
        projects: "Proyectos",
        experience: "Experiencia",
        skills: "Habilidades",
        education: "Educacion",
        certs: "Certs",
        contact: "Contacto"
      },
      hero: {
        kicker: "SYSTEMS ENGINEER · COSTA RICA",
        title: "Pablo Sanchez Abarca",
        typeBase: "Construyo y doy soporte a ",
        typePhrases: [
          "sistemas que no se caen.",
          "apps que ya estan en produccion.",
          "agentes de IA con Ollama.",
          "dashboards con datos reales."
        ],
        ctaProjects: "Ver proyectos",
        ctaGame: "Entrar al juego",
        badges: ["React", "FastAPI", "PostgreSQL", "Ollama", "Electron", "AWS"],
        scrollHint: "scroll"
      },
      game: {
        kicker: "Juego",
        title: "Portafolio jugable",
        hint: "click o toca la ventana para tomar el control",
        windowTitle: "SPACE_PORTFOLIO.exe",
        veilLabel: "Click o toca para tomar el control",
        statusIdle: "en espera",
        statusActive: "activo"
      },
      sideCta: "Entrar al juego",
      sideNote: "el portafolio jugable",
      profile: {
        kicker: "Perfil",
        title: "Soporte · Sistemas · IA",
        body: "Brindo soporte IT, resuelvo problemas tecnicos y administro sistemas. Estoy creciendo hacia project management con machine learning e inteligencia artificial.",
        stats: [
          { value: 10, prefix: "+", label: "usuarios en produccion" },
          { value: 7, prefix: "", label: "proyectos" },
          { value: 3, prefix: "", label: "anos de experiencia" },
          { value: 2026, prefix: "", label: "graduacion (est.)" }
        ]
      },
      projects: {
        kicker: "Proyectos",
        title: "Proyectos",
        hint: "toca cada proyecto para abrirlo",
        featureBadge: "En produccion",
        items: [
          {
            title: "Sistema empresarial",
            desc: "Gestion de empleados, vacaciones y asistencia. En produccion con +10 usuarios. Migre el backend de AWS a infraestructura self-hosted (Cloudflare Tunnel, systemd, backups automatizados) sin downtime.",
            tags: ["React", "Electron", "FastAPI", "PostgreSQL", "Self-hosted"]
          },
          {
            title: "Chatbot profesional local",
            desc: "Chat conectado a un modelo de Ollama corriendo en mi propio servidor, con contexto controlado sobre mi perfil profesional. Puedes probarlo dentro del juego.",
            tags: ["Ollama", "Agentic AI", "RAG ligero"]
          },
          {
            title: "Dashboard de vulnerabilidades (CVE/NVD)",
            desc: "Dashboard de analisis de vulnerabilidades con datos en vivo de la NVD: tendencia de CVEs por severidad, top vendors/productos y distribucion por tipo de vulnerabilidad.",
            tags: ["NVD API", "Data Viz", "Security"],
            link: { href: "https://vulns.apisis.net", label: "Ver dashboard en vivo" }
          },
          {
            title: "Agente de marketing",
            desc: "Agente automatizado con Ollama y Hermes Agent: estudia mercado, genera publicaciones y las programa con APIs de imagen y video.",
            tags: ["Ollama", "Hermes Agent", "Automation"]
          },
          {
            title: "Agente IA programador",
            desc: "Agente que programa de forma autonoma, orquestado por Hermes Agent hasta completar los objetivos definidos.",
            tags: ["Agentic AI", "Code Automation"]
          },
          {
            title: "Laboratorio de fuerza bruta",
            desc: "Herramienta con interfaz para pruebas controladas y autorizadas de fuerza bruta en entornos de laboratorio.",
            tags: ["Security Lab", "Testing"]
          },
          {
            title: "Sitio romantico interactivo",
            desc: "Sitio web interactivo con sistema de envio de correos y una experiencia visual personalizada.",
            tags: ["Web", "Email", "UX"],
            link: { href: "https://pablosanchez123.github.io/birthday-website-Alison/", label: "Ver sitio en vivo" }
          }
        ]
      },
      experience: {
        kicker: "Experiencia",
        giant: "IT SUPPORT",
        meta: "Sistemas Integrados de Seguridad · 2022 - 2025",
        items: [
          "Diagnostico y resolucion de problemas en computadoras.",
          "Gestion y monitoreo de sistemas CCTV.",
          "Resolucion de errores en aplicaciones de camaras.",
          "Emergencias tecnologicas en cualquier horario."
        ]
      },
      skills: {
        kicker: "Habilidades",
        title: "Habilidades",
        hint: "toca o pasa el cursor por los paneles",
        items: [
          { name: "Technical Support", desc: "Atencion directa a usuarios, hardware y software." },
          { name: "Troubleshooting", desc: "Diagnostico rapido de fallas y causas raiz." },
          { name: "SQL", desc: "Consultas, reportes y mantenimiento de datos." },
          { name: "Databases", desc: "PostgreSQL en produccion, backups y accesos." },
          { name: "OOP", desc: "Bases solidas de programacion orientada a objetos." },
          { name: "Fast Learner", desc: "Adopto herramientas nuevas en dias, no meses." },
          { name: "Teamwork", desc: "Comunicacion clara con equipos y clientes." }
        ]
      },
      education: {
        kicker: "Educacion",
        title: "Educacion",
        items: [
          { tag: "2026 (est.)", title: "Universidad Latina de Costa Rica", desc: "Ingenieria en Sistemas Computacionales, actualmente cursando." },
          { tag: "2022", title: "Colegio Bilingue Jorge Volio Jimenez", desc: "Bachillerato en Educacion Media." }
        ]
      },
      certs: {
        kicker: "Certs",
        title: "Certificaciones",
        items: [
          { tag: "En progreso", title: "AWS Cloud Practitioner", desc: "Fundamentos de cloud computing, servicios AWS y buenas practicas de arquitectura." },
          { tag: "En progreso", title: "Google Project Management", desc: "Planificacion, Agile, comunicacion con stakeholders y workflow management." }
        ]
      },
      contact: {
        kicker: "Contacto",
        title: "Hablemos",
        note: "Disponible para conectar. Escribeme o revisa mi codigo.",
        emailLabel: "Email",
        phoneLabel: "Telefono",
        githubLabel: "GitHub",
        gameNote: "Quieres preguntarle algo a mi asistente de IA? Vive dentro del juego, en la seccion Proyectos.",
        gameBtn: "Entrar al juego",
        copyLabel: "copiar",
        copiedLabel: "copiado"
      },
      launchStatus: "secuencia de lanzamiento completa",
      footer: "© 2026 Pablo Sanchez Abarca · hecho a mano, sin plantillas"
    },
    canvasLabel: "Minijuego espacial del portafolio de Pablo Sanchez Abarca",
    radarLabel: "Planetas del portafolio",
    closeLabel: "Cerrar",
    themeToLight: "Cambiar a modo claro",
    themeToDark: "Cambiar a modo oscuro",
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
      thinkingWords: ["Consultando a Home Lab de Pablo", "Procesando respuesta", "Consultando", "Procesando"],
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
                  <p>Gestion de empleados y registros empresariales como vacaciones y asistencia, con app desktop/web y base SQL. Migre el backend de AWS a infraestructura self-hosted (Cloudflare Tunnel, systemd, backups automatizados) sin downtime para los usuarios.</p>
                  <span>React / Vite / Electron / FastAPI / PostgreSQL / Self-hosted / Cloudflare Tunnel</span>
                </article>
                <article class="project-card">
                  <h3>Dashboard de vulnerabilidades (CVE/NVD)</h3>
                  <p>Dashboard de analisis de vulnerabilidades con datos en vivo de la NVD: tendencia de CVEs por severidad, top vendors/productos y distribucion por tipo de vulnerabilidad.</p>
                  <span>NVD API / Data Viz / Security</span>
                  <p><a class="panel-link" href="https://vulns.apisis.net" target="_blank" rel="noreferrer">Ver dashboard en vivo</a></p>
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
    landing: {
      nav: {
        game: "Game",
        profile: "Profile",
        projects: "Projects",
        experience: "Experience",
        skills: "Skills",
        education: "Education",
        certs: "Certs",
        contact: "Contact"
      },
      hero: {
        kicker: "SYSTEMS ENGINEER · COSTA RICA",
        title: "Pablo Sanchez Abarca",
        typeBase: "I build and support ",
        typePhrases: [
          "systems that stay up.",
          "apps already in production.",
          "AI agents with Ollama.",
          "dashboards with real data."
        ],
        ctaProjects: "View projects",
        ctaGame: "Enter the game",
        badges: ["React", "FastAPI", "PostgreSQL", "Ollama", "Electron", "AWS"],
        scrollHint: "scroll"
      },
      game: {
        kicker: "Game",
        title: "Playable portfolio",
        hint: "click or tap the window to take control",
        windowTitle: "SPACE_PORTFOLIO.exe",
        veilLabel: "Click or tap to take control",
        statusIdle: "standing by",
        statusActive: "active"
      },
      sideCta: "Enter the game",
      sideNote: "the playable portfolio",
      profile: {
        kicker: "Profile",
        title: "Support · Systems · AI",
        body: "I provide IT support, solve technical issues, and administer systems. I am growing toward project management with machine learning and artificial intelligence.",
        stats: [
          { value: 10, prefix: "+", label: "users in production" },
          { value: 7, prefix: "", label: "projects" },
          { value: 3, prefix: "", label: "years of experience" },
          { value: 2026, prefix: "", label: "graduation (est.)" }
        ]
      },
      projects: {
        kicker: "Projects",
        title: "Projects",
        hint: "tap any project to open it",
        featureBadge: "In production",
        items: [
          {
            title: "Business management system",
            desc: "Employee, vacation, and attendance management. In production with 10+ users. Migrated the backend from AWS to self-hosted infrastructure (Cloudflare Tunnel, systemd, automated backups) with zero downtime.",
            tags: ["React", "Electron", "FastAPI", "PostgreSQL", "Self-hosted"]
          },
          {
            title: "Local professional chatbot",
            desc: "Chat connected to an Ollama model running on my own server, with controlled context about my professional profile. You can try it inside the game.",
            tags: ["Ollama", "Agentic AI", "Lightweight RAG"]
          },
          {
            title: "Vulnerability dashboard (CVE/NVD)",
            desc: "Vulnerability analytics dashboard with live NVD data: CVE trend by severity, top vendors/products, and vulnerability type distribution.",
            tags: ["NVD API", "Data Viz", "Security"],
            link: { href: "https://vulns.apisis.net", label: "View live dashboard" }
          },
          {
            title: "Marketing agent",
            desc: "Automated agent with Ollama and Hermes Agent: researches markets, generates posts, and schedules them through image and video APIs.",
            tags: ["Ollama", "Hermes Agent", "Automation"]
          },
          {
            title: "AI coding agent",
            desc: "An agent that codes autonomously, orchestrated by Hermes Agent until the defined objectives are complete.",
            tags: ["Agentic AI", "Code Automation"]
          },
          {
            title: "Brute-force lab",
            desc: "Interface-based tool for controlled and authorized brute-force testing in lab environments.",
            tags: ["Security Lab", "Testing"]
          },
          {
            title: "Interactive romantic website",
            desc: "Interactive website with an email-sending system and a personalized visual experience.",
            tags: ["Web", "Email", "UX"],
            link: { href: "https://pablosanchez123.github.io/birthday-website-Alison/", label: "View live site" }
          }
        ]
      },
      experience: {
        kicker: "Experience",
        giant: "IT SUPPORT",
        meta: "Sistemas Integrados de Seguridad · 2022 - 2025",
        items: [
          "Diagnosed and solved computer issues.",
          "Managed and monitored CCTV systems.",
          "Resolved errors in camera applications.",
          "Handled tech emergencies on any schedule."
        ]
      },
      skills: {
        kicker: "Skills",
        title: "Skills",
        hint: "tap or hover each panel",
        items: [
          { name: "Technical Support", desc: "Direct support for users, hardware, and software." },
          { name: "Troubleshooting", desc: "Fast diagnosis of failures and root causes." },
          { name: "SQL", desc: "Queries, reports, and data maintenance." },
          { name: "Databases", desc: "PostgreSQL in production, backups, and access." },
          { name: "OOP", desc: "Solid object-oriented programming fundamentals." },
          { name: "Fast Learner", desc: "I pick up new tools in days, not months." },
          { name: "Teamwork", desc: "Clear communication with teams and clients." }
        ]
      },
      education: {
        kicker: "Education",
        title: "Education",
        items: [
          { tag: "2026 (est.)", title: "Universidad Latina de Costa Rica", desc: "Computer Systems Engineering, currently enrolled." },
          { tag: "2022", title: "Colegio Bilingue Jorge Volio Jimenez", desc: "High School Diploma." }
        ]
      },
      certs: {
        kicker: "Certs",
        title: "Certifications",
        items: [
          { tag: "In progress", title: "AWS Cloud Practitioner", desc: "Cloud computing fundamentals, AWS services, and architecture best practices." },
          { tag: "In progress", title: "Google Project Management", desc: "Planning, Agile, stakeholder communication, and workflow management." }
        ]
      },
      contact: {
        kicker: "Contact",
        title: "Let's talk",
        note: "Available to connect. Write to me or check my code.",
        emailLabel: "Email",
        phoneLabel: "Phone",
        githubLabel: "GitHub",
        gameNote: "Want to ask my AI assistant something? It lives inside the game, in the Projects section.",
        gameBtn: "Enter the game",
        copyLabel: "copy",
        copiedLabel: "copied"
      },
      launchStatus: "launch sequence complete",
      footer: "© 2026 Pablo Sanchez Abarca · handmade, no templates"
    },
    canvasLabel: "Space minigame for Pablo Sanchez Abarca's project portfolio",
    radarLabel: "Portfolio planets",
    closeLabel: "Close",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
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
      thinkingWords: ["Consulting Pablo's Home Lab", "Processing response", "Consulting", "Processing"],
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
                  <p>Employee management and company records such as vacations and attendance, with desktop/web app and SQL database. Migrated the backend from AWS to self-hosted infrastructure (Cloudflare Tunnel, systemd, automated backups) with zero downtime for users.</p>
                  <span>React / Vite / Electron / FastAPI / PostgreSQL / Self-hosted / Cloudflare Tunnel</span>
                </article>
                <article class="project-card">
                  <h3>Vulnerability dashboard (CVE/NVD)</h3>
                  <p>Vulnerability analytics dashboard with live NVD data: CVE trend by severity, top vendors/products, and vulnerability type distribution.</p>
                  <span>NVD API / Data Viz / Security</span>
                  <p><a class="panel-link" href="https://vulns.apisis.net" target="_blank" rel="noreferrer">View live dashboard</a></p>
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

const THINKING_SPINNER_FRAMES = ["✳", "✶", "✷", "✵"];

function startThinkingIndicator() {
  const words = getCopy().chat.thinkingWords;
  const word = words[Math.floor(Math.random() * words.length)];
  const startedAt = Date.now();
  let frame = 0;

  const tick = () => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const spinner = THINKING_SPINNER_FRAMES[frame % THINKING_SPINNER_FRAMES.length];
    frame += 1;
    setChatStatus(`${spinner} ${word}… (${elapsed}s)`);
  };

  tick();
  const timer = window.setInterval(tick, 400);
  return () => window.clearInterval(timer);
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
  const stopThinking = startThinkingIndicator();

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
    stopThinking();
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
  mobileNav.setAttribute("aria-label", copy.radarLabel);
  closePanel.setAttribute("aria-label", copy.closeLabel);
  touchControls.setAttribute("aria-label", copy.touchControlsLabel);
  touchInteract.setAttribute("aria-label", copy.touchLabels.interact);
  touchFire.setAttribute("aria-label", copy.touchLabels.fire);

  themeLabels = { toLight: copy.themeToLight, toDark: copy.themeToDark };
  themeToggle.setAttribute(
    "aria-label",
    landing.dataset.theme === "light" ? themeLabels.toDark : themeLabels.toLight
  );

  renderLanding(copy.landing);

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
    const mobileButton = mobileNavButtons.find((item) => item.dataset.planet === planet.id);
    if (mobileButton) {
      const mobileLabel = mobileButton.querySelector(".mnav-label");
      if (mobileLabel) {
        mobileLabel.textContent = planet.label;
      }
    }
  });

  if (state.openPlanetId) {
    const planet = planets.find((item) => item.id === state.openPlanetId);
    if (planet) {
      renderInfoPanel(planet);
    }
  }
}

// ==================================================================
// Landing: render + efectos. Componentes recreados de skiper-ui.com
// (16, 19, 31, 37, 52, 58, 61) y cult-ui.com (hero-color-panel,
// gradient-heading, typewriter, texture-button, squiggle-arrow,
// minimal-card) en vanilla JS.
// ==================================================================
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

const landingFx = {
  chars: [],
  charSection: null,
  words: [],
  wordSection: null,
  expPath: null,
  expPathLen: 0,
  expSection: null,
  statsShown: false
};

// TextRoll (skiper58): dos copias apiladas de las letras, con stagger
// desde el centro; la de arriba sube y la de abajo entra al hover.
function makeRoll(text) {
  const wrap = document.createElement("span");
  wrap.className = "roll";
  const layerA = document.createElement("span");
  layerA.className = "roll-a";
  const layerB = document.createElement("span");
  layerB.className = "roll-b";
  const chars = [...text];
  const center = (chars.length - 1) / 2;
  chars.forEach((ch, i) => {
    const delay = Math.round(Math.abs(i - center) * 24);
    [layerA, layerB].forEach((layer) => {
      const s = document.createElement("span");
      s.textContent = ch === " " ? " " : ch;
      s.style.setProperty("--d", `${delay}ms`);
      layer.appendChild(s);
    });
  });
  wrap.append(layerA, layerB);
  return wrap;
}

// CssLink (skiper40 Link001): subrayado que crece desde el centro
// mas una flecha diagonal que entra en fade+translate al hover.
function makeCssLink(href, label) {
  const a = document.createElement("a");
  a.className = "css-link";
  a.href = href;
  a.target = "_blank";
  a.rel = "noreferrer";
  const text = document.createElement("span");
  text.textContent = label;
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrow.setAttribute("class", "css-link-arrow");
  arrow.setAttribute("viewBox", "0 0 10 10");
  arrow.setAttribute("fill", "none");
  arrow.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.25");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  arrow.appendChild(path);
  a.append(text, arrow);
  return a;
}

// Bouncy Accordion (inspirado en Expandable de cult-ui): un solo
// panel abierto a la vez, el resto se cierra.
function toggleAccordionItem(target) {
  const items = [...document.querySelectorAll("#projectsAccordion .acc-item")];
  items.forEach((item) => {
    const open = item === target ? !item.classList.contains("is-open") : false;
    item.classList.toggle("is-open", open);
    item.querySelector(".acc-header").setAttribute("aria-expanded", String(open));
  });
}

// Typewriter (cult-ui): escribe el texto base una vez y despues
// alterna frases escribiendo y borrando en bucle.
const typer = { timer: 0, seq: 0 };

function startTypewriter(base, phrases) {
  window.clearTimeout(typer.timer);
  typer.seq += 1;
  const seq = typer.seq;
  const baseEl = document.getElementById("typeBase");
  const cycleEl = document.getElementById("typeCycle");
  baseEl.textContent = "";
  cycleEl.textContent = "";

  if (reducedMotion.matches) {
    baseEl.textContent = base;
    cycleEl.textContent = phrases[0] || "";
    return;
  }

  let baseIndex = 0;
  const typeBase = () => {
    if (seq !== typer.seq) return;
    baseEl.textContent = base.slice(0, baseIndex);
    if (baseIndex < base.length) {
      baseIndex += 1;
      typer.timer = window.setTimeout(typeBase, 34);
    } else {
      cyclePhrase(0);
    }
  };
  const cyclePhrase = (phraseIndex) => {
    const phrase = phrases[phraseIndex % phrases.length];
    let charIndex = 0;
    const typeForward = () => {
      if (seq !== typer.seq) return;
      cycleEl.textContent = phrase.slice(0, charIndex);
      if (charIndex < phrase.length) {
        charIndex += 1;
        typer.timer = window.setTimeout(typeForward, 40);
      } else {
        typer.timer = window.setTimeout(eraseBack, 1600);
      }
    };
    const eraseBack = () => {
      if (seq !== typer.seq) return;
      cycleEl.textContent = cycleEl.textContent.slice(0, -1);
      if (cycleEl.textContent.length > 0) {
        typer.timer = window.setTimeout(eraseBack, 18);
      } else {
        typer.timer = window.setTimeout(() => cyclePhrase(phraseIndex + 1), 320);
      }
    };
    typeForward();
  };
  typeBase();
}

// AnimatedNumber (skiper37): los numeros cuentan hacia arriba al
// entrar en pantalla.
function runStatsCountUp() {
  const values = [...document.querySelectorAll(".stat-value")];
  values.forEach((el) => {
    const target = Number(el.dataset.value);
    const prefix = el.dataset.prefix || "";
    if (reducedMotion.matches) {
      el.textContent = prefix + target;
      return;
    }
    const started = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(target * eased);
      if (t < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !landingFx.statsShown) {
      landingFx.statsShown = true;
      runStatsCountUp();
    }
  });
}, { threshold: 0.4 });

function renderLanding(L) {
  landingFxGen += 1;
  landingNavLinks.forEach((link) => {
    const key = link.dataset.scroll.replace("l-", "");
    if (L.nav[key]) {
      link.replaceChildren(makeRoll(L.nav[key]));
    }
  });

  document.getElementById("heroKicker").textContent = L.hero.kicker;
  splitHeroTitle(L.hero.title);
  document.getElementById("heroCtaProjects").textContent = L.hero.ctaProjects;
  heroCtaGame.textContent = L.hero.ctaGame;
  document.getElementById("scrollHint").textContent = L.hero.scrollHint;
  document.getElementById("sideCtaLabel").textContent = L.sideCta;
  document.getElementById("sideCtaNote").textContent = L.sideNote;
  startTypewriter(L.hero.typeBase, L.hero.typePhrases);

  document.getElementById("gameKicker").textContent = L.game.kicker;
  document.getElementById("gameTitle").textContent = L.game.title;
  document.getElementById("gameHint").textContent = L.game.hint;
  document.getElementById("gameWindowTitle").textContent = L.game.windowTitle;
  document.getElementById("gameVeilLabel").textContent = L.game.veilLabel;
  state.gameStatusActive = L.game.statusActive;
  if (gameWindowStatus) {
    gameWindowStatus.textContent = state.started ? L.game.statusActive : L.game.statusIdle;
  }

  const badges = document.getElementById("heroBadges");
  badges.replaceChildren();
  L.hero.badges.forEach((name) => {
    const span = document.createElement("span");
    span.textContent = name;
    badges.appendChild(span);
  });

  // Perfil: Character reveal (skiper31) sobre el titulo
  document.getElementById("profileKicker").textContent = L.profile.kicker;
  const profileTitle = document.getElementById("profileTitle");
  profileTitle.replaceChildren();
  landingFx.chars = [];
  const titleChars = [...L.profile.title];
  const charCenter = (titleChars.length - 1) / 2;
  titleChars.forEach((ch, i) => {
    const s = document.createElement("span");
    s.textContent = ch === " " ? " " : ch;
    profileTitle.appendChild(s);
    landingFx.chars.push({ el: s, dist: i - charCenter });
  });
  landingFx.charSection = document.getElementById("l-profile");

  // Perfil: reveal palabra por palabra ligado al scroll
  const profileBody = document.getElementById("profileBody");
  profileBody.replaceChildren();
  landingFx.words = [];
  L.profile.body.split(" ").forEach((word, i, arr) => {
    const s = document.createElement("span");
    s.textContent = word + (i < arr.length - 1 ? " " : "");
    profileBody.appendChild(s);
    landingFx.words.push(s);
  });
  landingFx.wordSection = landingFx.charSection;

  const statsRow = document.getElementById("statsRow");
  statsRow.replaceChildren();
  L.profile.stats.forEach((stat, statIndex) => {
    const box = document.createElement("div");
    box.className = "stat fx-rise";
    box.style.setProperty("--i", statIndex);
    const value = document.createElement("span");
    value.className = "stat-value";
    value.dataset.value = String(stat.value);
    value.dataset.prefix = stat.prefix;
    value.textContent = landingFx.statsShown ? stat.prefix + stat.value : stat.prefix + "0";
    const label = document.createElement("span");
    label.className = "stat-label";
    label.textContent = stat.label;
    box.append(value, label);
    statsRow.appendChild(box);
  });
  statsObserver.observe(statsRow);

  // Proyectos: Bouncy Accordion (inspirado en Expandable de cult-ui,
  // resorte stiffness 200 / damping 20 / bounce 0.2)
  document.getElementById("projectsKicker").textContent = L.projects.kicker;
  document.getElementById("projectsTitle").textContent = L.projects.title;
  document.getElementById("projectsHint").textContent = L.projects.hint;
  const accordion = document.getElementById("projectsAccordion");
  accordion.replaceChildren();
  L.projects.items.forEach((item, i) => {
    const acc = document.createElement("article");
    acc.className = "acc-item fx-rise" + (i === 0 ? " is-open" : "");
    acc.style.setProperty("--i", i);

    const header = document.createElement("button");
    header.type = "button";
    header.className = "acc-header";
    header.setAttribute("aria-expanded", i === 0 ? "true" : "false");

    const left = document.createElement("span");
    left.className = "acc-header-left";
    const num = document.createElement("span");
    num.className = "acc-num";
    num.textContent = `0${i + 1}`;
    const title = document.createElement("span");
    title.className = "acc-title";
    title.textContent = item.title;
    left.append(num, title);
    if (item.feature) {
      const badge = document.createElement("span");
      badge.className = "acc-badge";
      badge.textContent = L.projects.featureBadge;
      left.appendChild(badge);
    }

    const chevron = document.createElement("span");
    chevron.className = "acc-chevron";
    chevron.setAttribute("aria-hidden", "true");

    header.append(left, chevron);
    header.addEventListener("click", () => toggleAccordionItem(acc));

    const bodyWrap = document.createElement("div");
    bodyWrap.className = "acc-body-wrap";
    const bodyInner = document.createElement("div");
    bodyInner.className = "acc-body-inner";

    const desc = document.createElement("p");
    desc.textContent = item.desc;
    bodyInner.appendChild(desc);

    const tags = document.createElement("div");
    tags.className = "acc-tags";
    item.tags.forEach((tag) => {
      const t = document.createElement("span");
      t.textContent = tag;
      tags.appendChild(t);
    });
    bodyInner.appendChild(tags);

    if (item.link) {
      bodyInner.appendChild(makeCssLink(item.link.href, item.link.label));
    }

    bodyWrap.appendChild(bodyInner);
    acc.append(header, bodyWrap);
    accordion.appendChild(acc);
  });

  // Experiencia: LinePath (skiper19) + bloque de texto gigante
  document.getElementById("experienceKicker").textContent = L.experience.kicker;
  document.getElementById("experienceTitle").replaceChildren(makeRoll(L.experience.giant));
  document.getElementById("experienceMeta").textContent = L.experience.meta;
  fillList("experienceList", L.experience.items);
  landingFx.expSection = document.getElementById("l-experience");
  landingFx.expPath = document.getElementById("expLinePath");
  if (landingFx.expPath && !landingFx.expPathLen) {
    landingFx.expPathLen = landingFx.expPath.getTotalLength();
    landingFx.expPath.style.strokeDasharray = String(landingFx.expPathLen);
    landingFx.expPath.style.strokeDashoffset = String(landingFx.expPathLen);
  }

  // Habilidades: HoverExpand_001 (skiper52), paneles que se expanden
  document.getElementById("skillsKicker").textContent = L.skills.kicker;
  document.getElementById("skillsTitle").textContent = L.skills.title;
  document.getElementById("expandHint").textContent = L.skills.hint;
  const expand = document.getElementById("skillsExpand");
  expand.replaceChildren();
  L.skills.items.forEach((skill, i) => {
    const panel = document.createElement("button");
    panel.type = "button";
    panel.className = "he-panel fx-rise" + (i === 1 ? " is-active" : "");
    panel.style.setProperty("--i", i);
    panel.setAttribute("aria-label", skill.name);

    const collapsed = document.createElement("span");
    collapsed.className = "he-collapsed";
    collapsed.textContent = skill.name;

    const open = document.createElement("span");
    open.className = "he-open";
    const num = document.createElement("span");
    num.className = "he-num";
    num.textContent = `# 0${i + 1}`;
    const name = document.createElement("span");
    name.className = "he-name";
    name.textContent = skill.name;
    const desc = document.createElement("span");
    desc.className = "he-desc";
    desc.textContent = skill.desc;
    open.append(num, name, desc);

    panel.append(collapsed, open);

    const activate = () => {
      expand.querySelectorAll(".he-panel").forEach((p) => p.classList.remove("is-active"));
      panel.classList.add("is-active");
    };
    panel.addEventListener("click", activate);
    if (finePointer.matches) {
      panel.addEventListener("pointerenter", activate);
    }
    expand.appendChild(panel);
  });

  // Educacion / Certs: Minimal Card (cult-ui)
  const renderMiniCards = (containerId, items) => {
    const container = document.getElementById(containerId);
    container.replaceChildren();
    items.forEach((item, cardIndex) => {
      const card = document.createElement("article");
      card.className = "mini-card fx-rise";
      card.style.setProperty("--i", cardIndex);
      const tag = document.createElement("span");
      tag.className = "mini-tag";
      tag.textContent = item.tag;
      const h3 = document.createElement("h3");
      h3.textContent = item.title;
      const p = document.createElement("p");
      p.textContent = item.desc;
      card.append(tag, h3, p);
      container.appendChild(card);
    });
  };
  document.getElementById("educationKicker").textContent = L.education.kicker;
  document.getElementById("educationTitle").textContent = L.education.title;
  renderMiniCards("educationList", L.education.items);
  document.getElementById("certsKicker").textContent = L.certs.kicker;
  document.getElementById("certsTitle").textContent = L.certs.title;
  renderMiniCards("certsList", L.certs.items);

  // Contacto: enlaces grandes con TextRoll (skiper58)
  document.getElementById("contactKicker").textContent = L.contact.kicker;
  document.getElementById("contactTitle").textContent = L.contact.title;
  document.getElementById("contactNote").textContent = L.contact.note;
  document.getElementById("contactGameNote").textContent = L.contact.gameNote;
  document.getElementById("contactGameBtnLabel").textContent = L.contact.gameBtn;
  const contactActions = document.getElementById("contactActions");
  contactActions.replaceChildren();
  const contactLinks = [
    { label: L.contact.emailLabel, href: "mailto:pablo3020100@gmail.com", text: "pablo3020100@gmail.com" },
    { label: L.contact.phoneLabel, href: "tel:+50687296474", text: "(+506) 8729-6474" },
    { label: L.contact.githubLabel, href: "https://github.com/pablosanchez123", text: "github.com/pablosanchez123" }
  ];
  contactLinks.forEach((entry, entryIndex) => {
    const kind = document.createElement("p");
    kind.className = "contact-kind fx-rise";
    kind.style.setProperty("--i", entryIndex * 2);
    kind.textContent = entry.label;
    const a = document.createElement("a");
    a.href = entry.href;
    if (entry.href.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noreferrer";
    }
    a.appendChild(makeRoll(entry.text));
    const row = document.createElement("div");
    row.className = "contact-row fx-rise";
    row.style.setProperty("--i", entryIndex * 2 + 1);
    row.appendChild(a);
    if (entry.href.startsWith("mailto:")) {
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "copy-btn";
      copyBtn.textContent = `[ ${L.contact.copyLabel} ]`;
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(entry.text);
          copyBtn.textContent = `[ ${L.contact.copiedLabel} ]`;
          copyBtn.classList.add("is-copied");
          window.setTimeout(() => {
            copyBtn.textContent = `[ ${L.contact.copyLabel} ]`;
            copyBtn.classList.remove("is-copied");
          }, 1600);
        } catch (err) {
          // sin permiso de clipboard: el mailto sigue disponible
        }
      });
      row.appendChild(copyBtn);
    }
    contactActions.append(kind, row);
  });

  document.getElementById("landingFooterText").textContent = L.footer;
  document.getElementById("footerLaunchStatus").textContent = L.launchStatus;
  document.getElementById("footerLaunchLabel").textContent = L.contact.gameBtn;
  renderMarquee(L);
  renderHudRail(L);
}

function fillList(id, items) {
  const list = document.getElementById(id);
  list.replaceChildren();
  items.forEach((text, i) => {
    const li = document.createElement("li");
    li.className = "fx-rise";
    li.style.setProperty("--i", i);
    li.textContent = text;
    list.appendChild(li);
  });
}

// ==================================================================
// Secuencia de pre-lanzamiento: el scroll es la cuenta regresiva.
// HUD lateral T-07 -> T-01, decode de kickers al entrar en vista,
// titulo del hero letra a letra y marquee divisor.
// ==================================================================
const hudSectionIds = ["l-game", "l-profile", "l-projects", "l-experience", "l-skills", "l-education", "l-certs", "l-contact"];
let hudMarks = [];
let landingFxGen = 0;

function renderHudRail(L) {
  const rail = document.getElementById("hudRail");
  rail.replaceChildren();
  hudSectionIds.forEach((id, i) => {
    const mark = document.createElement("button");
    mark.type = "button";
    mark.className = "hud-mark";
    mark.dataset.section = id;
    const label = document.createElement("span");
    label.className = "hud-label";
    label.textContent = L.nav[id.replace("l-", "")] || "";
    const t = document.createElement("span");
    t.className = "hud-t";
    t.textContent = `T-0${hudSectionIds.length - i}`;
    mark.append(label, t);
    mark.addEventListener("click", () => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    rail.appendChild(mark);
  });
  hudMarks = [...rail.querySelectorAll(".hud-mark")];
}

function renderMarquee(L) {
  const track = document.getElementById("marqueeTrack");
  track.replaceChildren();
  const roles = L.profile.title.split("·").map((s) => s.trim()).filter(Boolean);
  const items = [...roles, ...L.hero.badges];
  // 4 copias y la animacion recorre -50%: dos copias siempre llenan
  // el ancho, asi el bucle es continuo sin salto visible.
  for (let rep = 0; rep < 4; rep += 1) {
    items.forEach((text) => {
      const s = document.createElement("span");
      s.textContent = text;
      track.appendChild(s);
    });
  }
}

// Titulo del hero: palabras enteras (para que el quiebre de linea se
// conserve) con letras individuales que suben en cascada.
function splitHeroTitle(text) {
  const h = document.getElementById("heroTitle");
  h.replaceChildren();
  h.setAttribute("aria-label", text);
  let charIndex = 0;
  text.split(" ").forEach((word, wi, arr) => {
    const w = document.createElement("span");
    w.className = "tw";
    w.setAttribute("aria-hidden", "true");
    [...word].forEach((ch) => {
      const c = document.createElement("span");
      c.className = "tc";
      c.style.setProperty("--i", charIndex);
      c.textContent = ch;
      w.appendChild(c);
      charIndex += 1;
    });
    h.appendChild(w);
    if (wi < arr.length - 1) {
      h.appendChild(document.createTextNode(" "));
    }
  });
}

// Decode estilo terminal: glifos aleatorios que se asientan de
// izquierda a derecha hasta formar el texto real.
const scrambleGlyphs = "▓▒░<>/[]{}=+*#";

function scrambleIn(el) {
  const finalText = el.textContent;
  const gen = landingFxGen;
  if (!finalText || reducedMotion.matches) {
    return;
  }
  const started = performance.now();
  const duration = 620;
  const step = (now) => {
    if (gen !== landingFxGen) {
      return;
    }
    const t = Math.min(1, (now - started) / duration);
    const settled = Math.floor(finalText.length * t);
    let out = finalText.slice(0, settled);
    for (let i = settled; i < finalText.length; i += 1) {
      out += finalText[i] === " " ? " " : scrambleGlyphs[(Math.random() * scrambleGlyphs.length) | 0];
    }
    el.textContent = out;
    if (t < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

// Cada seccion revela sus hijos una sola vez al entrar en vista y
// decodifica su kicker; despues se deja de observar.
const sectionFxObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }
    entry.target.classList.add("is-inview");
    const kicker = entry.target.querySelector(".section-index span:last-child");
    if (kicker) {
      scrambleIn(kicker);
    }
    sectionFxObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

// CTAs magneticos: el boton se inclina hacia el cursor (solo puntero
// fino y sin reduccion de movimiento).
function initMagneticButtons() {
  if (!finePointer.matches || reducedMotion.matches) {
    return;
  }
  document.querySelectorAll(".landing .t-btn, .landing-side-cta").forEach((btn) => {
    btn.addEventListener("pointermove", (event) => {
      const rect = btn.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${(dx * 0.14).toFixed(1)}px, ${(dy * 0.22).toFixed(1)}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

// ==================================================================
// Landing: motor de animacion por frame.
// - Character/word reveal (skiper31): scrub con el scroll.
// - LinePath (skiper19): el trazo se dibuja con el progreso.
// - SpringMouseFollow (skiper61): punto que persigue el cursor (solo
//   la escala usa resorte; la posicion sigue el cursor 1:1, sin delay).
// ==================================================================
const cursorDot = document.getElementById("cursorDot");
const cursorLock = document.getElementById("cursorLock");
const heroSection = document.getElementById("l-hero");
const navProgressEl = document.getElementById("navProgress");
const hudRailEl = document.getElementById("hudRail");
const shaderWrap = document.getElementById("shaderHeroRoot");

const cursorSpring = {
  x: -100, y: -100,
  targetX: -100, targetY: -100,
  scale: 1, targetScale: 1,
  opacity: 0, targetOpacity: 0
};

// target-lock: cuatro corchetes que vuelan a encerrar el elemento
// interactivo bajo el cursor (la reticula queda al centro).
const lockState = { x: 0, y: 0, w: 0, h: 0, o: 0, target: null };

landing.addEventListener("pointermove", (event) => {
  cursorSpring.targetX = event.clientX;
  cursorSpring.targetY = event.clientY;
  cursorSpring.targetOpacity = 1;
});
landing.addEventListener("pointerleave", () => {
  cursorSpring.targetOpacity = 0;
  lockState.target = null;
});
landing.addEventListener("pointerover", (event) => {
  const interactive = event.target.closest("a, button");
  let lock = null;
  if (interactive) {
    const rect = interactive.getBoundingClientRect();
    // objetivos demasiado grandes (headers de acordeon, paneles) no
    // se encierran: el punto solo crece, como antes
    if (rect.width <= 520 && rect.height <= 220) {
      lock = interactive;
    }
  }
  lockState.target = lock;
  cursorSpring.targetScale = lock ? 0.55 : interactive ? 2.4 : 1;
});

function viewProgress(rect, vh) {
  // progreso 0-1 mientras la seccion cruza la ventana (start end -> end start)
  return Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
}

function updateScrollFx() {
  const vh = window.innerHeight;

  if (landingFx.charSection && landingFx.chars.length) {
    const rect = landingFx.charSection.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < vh) {
      const p = viewProgress(rect, vh);
      const t = reducedMotion.matches ? 1 : Math.min(1, Math.max(0, (p - 0.1) / 0.32));
      const ease = 1 - Math.pow(1 - t, 2);
      landingFx.chars.forEach((c) => {
        const off = c.dist * 42 * (1 - ease);
        c.el.style.transform = `translateX(${off}px) rotateX(${off}deg)`;
      });
      const wordCount = landingFx.words.length;
      landingFx.words.forEach((w, i) => {
        const wt = Math.min(1, Math.max(0, (p - 0.16 - (i / wordCount) * 0.26) / 0.06));
        w.style.opacity = reducedMotion.matches ? "1" : String(0.14 + 0.86 * wt);
      });
    }
  }

  if (landingFx.expPath && landingFx.expSection) {
    const rect = landingFx.expSection.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < vh) {
      const p = viewProgress(rect, vh);
      const visible = reducedMotion.matches ? 1 : Math.min(1, 0.1 + p * 1.4);
      landingFx.expPath.style.strokeDashoffset = String(landingFx.expPathLen * (1 - visible));
    }
  }

  // progreso global de scroll: barra bajo la nav + HUD de cuenta regresiva
  const maxScroll = landing.scrollHeight - landing.clientHeight;
  const scrollProgress = maxScroll > 0 ? landing.scrollTop / maxScroll : 0;
  if (navProgressEl) {
    navProgressEl.style.width = `${(scrollProgress * 100).toFixed(2)}%`;
  }
  landing.classList.toggle("is-scrolled", landing.scrollTop > 60);

  let activeSectionId = "";
  landingSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= vh * 0.45) {
      activeSectionId = section.id;
    }
  });
  hudMarks.forEach((mark) => {
    mark.classList.toggle("is-active", mark.dataset.section === activeSectionId);
  });
  if (hudRailEl) {
    hudRailEl.classList.toggle("is-armed", activeSectionId === "l-contact");
  }

  // nebulosa: parallax + deriva de tono mientras el hero sale de vista
  if (shaderWrap && !reducedMotion.matches) {
    const heroRect = heroSection.getBoundingClientRect();
    if (heroRect.bottom > 0) {
      const heroProgress = Math.min(1, Math.max(0, -heroRect.top / Math.max(1, heroRect.height)));
      shaderWrap.style.transform = `translateY(${(landing.scrollTop * 0.35).toFixed(1)}px)`;
      shaderWrap.style.filter = `hue-rotate(${(heroProgress * 50).toFixed(1)}deg)`;
    }
  }
}

let lastFxTime = 0;

function landingFxLoop(time) {
  requestAnimationFrame(landingFxLoop);
  const dt = Math.min(0.05, (time - lastFxTime) / 1000 || 0.016);
  lastFxTime = time;

  updateScrollFx();

  if (finePointer.matches && cursorDot && !reducedMotion.matches) {
    // la posicion sigue el cursor sin delay; solo la escala usa resorte
    cursorSpring.x = cursorSpring.targetX;
    cursorSpring.y = cursorSpring.targetY;
    cursorSpring.scale += (cursorSpring.targetScale - cursorSpring.scale) * Math.min(1, dt * 16);
    cursorSpring.opacity += (cursorSpring.targetOpacity - cursorSpring.opacity) * Math.min(1, dt * 14);
    cursorDot.style.transform = `translate(${cursorSpring.x - 11}px, ${cursorSpring.y - 11}px) scale(${cursorSpring.scale.toFixed(3)})`;
    cursorDot.style.opacity = cursorSpring.opacity.toFixed(3);

    // los corchetes persiguen el objetivo fijado; sin objetivo, se
    // repliegan hacia la reticula y se desvanecen
    const target = lockState.target;
    if (target && target.isConnected) {
      const rect = target.getBoundingClientRect();
      const pad = 7;
      const k = Math.min(1, dt * 13);
      lockState.x += (rect.left - pad - lockState.x) * k;
      lockState.y += (rect.top - pad - lockState.y) * k;
      lockState.w += (rect.width + pad * 2 - lockState.w) * k;
      lockState.h += (rect.height + pad * 2 - lockState.h) * k;
      lockState.o += (1 - lockState.o) * k;
    } else {
      lockState.target = null;
      const k = Math.min(1, dt * 10);
      lockState.x += (cursorSpring.x - lockState.w / 2 - lockState.x) * k;
      lockState.y += (cursorSpring.y - lockState.h / 2 - lockState.y) * k;
      lockState.w += (0 - lockState.w) * k;
      lockState.h += (0 - lockState.h) * k;
      lockState.o += (0 - lockState.o) * k;
    }
    if (cursorLock) {
      cursorLock.style.transform = `translate(${lockState.x.toFixed(1)}px, ${lockState.y.toFixed(1)}px)`;
      cursorLock.style.width = `${Math.max(0, lockState.w).toFixed(1)}px`;
      cursorLock.style.height = `${Math.max(0, lockState.h).toFixed(1)}px`;
      cursorLock.style.opacity = lockState.o.toFixed(3);
    }
  }
}

function initLandingFx() {
  landingSections.forEach((section) => sectionFxObserver.observe(section));
  initMagneticButtons();
  requestAnimationFrame(landingFxLoop);
}

function resizeCanvas() {
  const rect = gameShell.getBoundingClientRect();
  state.width = Math.max(1, Math.round(rect.width));
  state.height = Math.max(1, Math.round(rect.height));
  state.dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  canvas.width = Math.floor(state.width * state.dpr);
  canvas.height = Math.floor(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}

// La ventana del juego vive embebida en el home (no fullscreen). Se
// "activa" al primer click/tap (arranca el loop, oculta el velo) y
// queda "enfocada" mientras el usuario interactua con ella: solo con
// foco el teclado mueve la nave, para no pelear con el scroll normal
// de la pagina.
function startGame() {
  if (state.started) {
    return;
  }
  state.started = true;
  resizeCanvas();
  requestAnimationFrame(loop);
  if (gameWindow) {
    gameWindow.classList.add("is-started");
  }
  if (gameWindowStatus) {
    gameWindowStatus.textContent = state.gameStatusActive;
  }
}

function focusGame() {
  if (!state.started) {
    startGame();
  }
  if (state.focused) {
    return;
  }
  state.focused = true;
  if (gameWindow) {
    gameWindow.classList.add("is-focused");
  }
}

function blurGame() {
  if (!state.focused) {
    return;
  }
  state.focused = false;
  if (gameWindow) {
    gameWindow.classList.remove("is-focused");
  }
  Object.keys(input).forEach((key) => {
    input[key] = false;
  });
  combat.firing = false;
}

function goToGame(options = {}) {
  const instant = options.instant === true;
  const section = document.getElementById("l-game");
  if (section) {
    section.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
  }
  focusGame();
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
  mobileNavButtons.forEach((button) => {
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
  const wasStarted = state.started;
  focusGame();
  if (!wasStarted) {
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

const gameResizeObserver = new ResizeObserver(() => resizeCanvas());

window.addEventListener("keydown", (event) => {
  if (isTypingTarget(event.target)) {
    if (event.key === "Escape") {
      event.target.blur();
      closeInfoPanel();
    }
    return;
  }

  if (event.key === "Escape") {
    closeInfoPanel();
    blurGame();
    return;
  }

  // sin foco, las teclas no le pertenecen al juego: dejan scrollear
  // la pagina con flechas/espacio con normalidad
  if (!state.focused) {
    return;
  }

  if (event.key in keyMap) {
    event.preventDefault();
    setInput(keyMap[event.key], true);
  }

  if (event.key === "e" || event.key === "E" || event.key === " ") {
    event.preventDefault();
    openPlanet(state.nearest);
  }

  if (event.key === "z" || event.key === "Z") {
    event.preventDefault();
    combat.firing = true;
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

themeToggle.addEventListener("click", () => {
  const next = landing.dataset.theme === "light" ? "dark" : "light";
  landing.dataset.theme = next;
  themeToggle.setAttribute("aria-pressed", String(next === "light"));
  themeToggle.setAttribute(
    "aria-label",
    next === "light" ? themeLabels.toDark : themeLabels.toLight
  );
});

landingEnterGame.addEventListener("click", () => goToGame());
document.getElementById("heroCtaGameOuter").addEventListener("click", () => goToGame());
document.getElementById("contactGameBtn").addEventListener("click", () => goToGame());
document.getElementById("footerLaunchBtn").addEventListener("click", () => goToGame());
if (gameVeil) {
  gameVeil.addEventListener("click", () => focusGame());
}
document.addEventListener("pointerdown", (event) => {
  if (state.focused && gameWindow && !gameWindow.contains(event.target)) {
    blurGame();
  }
});
scrollButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.getElementById(button.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const landingSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = landingNavLinks.find((item) => item.dataset.scroll === entry.target.id);
      if (link) {
        link.classList.toggle("is-active", entry.isIntersecting);
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
landingSections.forEach((section) => landingSectionObserver.observe(section));

closePanel.addEventListener("click", closeInfoPanel);
canvas.addEventListener("pointerdown", handleCanvasPointer);
touchInteract.addEventListener("click", () => openPlanet(state.nearest));

const stopFiring = (event) => {
  event.preventDefault();
  combat.firing = false;
};
touchFire.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  focusGame();
  combat.firing = true;
});
touchFire.addEventListener("pointerup", stopFiring);
touchFire.addEventListener("pointercancel", stopFiring);
touchFire.addEventListener("pointerleave", stopFiring);
panelBody.addEventListener("submit", handleProjectChatSubmit);
panelBody.addEventListener("click", handleProjectCardToggle);

radarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    focusGame();
    flyToPlanet(button.dataset.planet);
  });
});

mobileNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.planet;
    if (state.started && state.openPlanetId === id) {
      closeInfoPanel();
      return;
    }
    focusGame();
    flyToPlanet(id);
  });
});

touchButtons.forEach((button) => {
  const direction = button.dataset.touch;
  const start = (event) => {
    event.preventDefault();
    focusGame();
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
gameResizeObserver.observe(gameShell);
resizeCanvas();
draw(0);
initLandingFx();

if (query.get("play") === "1") {
  window.setTimeout(() => goToGame({ instant: true }), 80);
}
