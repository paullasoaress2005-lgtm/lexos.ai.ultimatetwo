const projects = [
  {
    title: ["BPO", "Juridico"],
    eyebrow: "Frente 01",
    area: "Producao assistida",
    year: "2026",
    description:
      "Fluxos operacionais para transformar volume juridico em rotina controlada, com IA como apoio de producao, revisao e priorizacao.",
    href: "https://www.lexosai.com.br/bpo-juridico",
    visual: "./visuals/bpo.svg",
    alt: "Visual abstrato do BPO Juridico",
  },
  {
    title: ["Treina-", "mento"],
    eyebrow: "Frente 02",
    area: "Capacitacao aplicada",
    year: "2026",
    description:
      "Formacoes para equipes juridicas adotarem IA com seguranca, linguagem simples e exemplos conectados ao trabalho real.",
    href: "https://www.lexosai.com.br/treinamento",
    visual: "./visuals/training.svg",
    alt: "Visual abstrato de treinamento juridico",
  },
  {
    title: ["Agentes", "Sistemas"],
    eyebrow: "Frente 03",
    area: "Arquitetura de IA",
    year: "2026",
    description:
      "Agentes, automacoes e sistemas internos desenhados para reduzir retrabalho e organizar tarefas repetitivas da operacao juridica.",
    href: "https://www.lexosai.com.br/agentes-sistemas",
    visual: "./visuals/agents.svg",
    alt: "Visual abstrato de agentes e sistemas",
  },
  {
    title: ["Raio-X", "Juridico"],
    eyebrow: "Frente 04",
    area: "Diagnostico executivo",
    year: "2026",
    description:
      "Uma leitura objetiva da maturidade da operacao, com mapa de oportunidades para aplicar IA sem perder governanca.",
    href: "https://www.lexosai.com.br/raio-x",
    visual: "./visuals/raiox.svg",
    alt: "Visual abstrato de diagnostico juridico",
  },
  {
    title: ["LEX.OS", "Store"],
    eyebrow: "Marketplace 05",
    area: "Plugins juridicos",
    year: "2026",
    description:
      "Um ambiente de compra e descoberta para plugins, pacotes e solucoes prontas que ampliam o ecossistema LEX.OS.",
    href: "https://lexos-store.vercel.app",
    visual: "./visuals/store.svg",
    alt: "Visual abstrato da LEX.OS Store",
  },
];

const root = document.body;
const titleEl = document.querySelector("#activeTitle");
const eyebrowEl = document.querySelector("#activeEyebrow");
const areaEl = document.querySelector("#activeArea");
const yearEl = document.querySelector("#activeYear");
const descEl = document.querySelector("#activeDescription");
const linkEl = document.querySelector("#activeLink");
const visualEl = document.querySelector("#activeVisual");
const counterEl = document.querySelector("#counterCurrent");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const rows = [...document.querySelectorAll(".project-row")];
const stepButtons = [...document.querySelectorAll(".steps button")];
const cursor = document.querySelector(".cursor");
const clock = document.querySelector("#clock");

let activeIndex = 0;
let lockUntil = 0;
let touchStartY = 0;
let touchStartX = 0;

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Fortaleza",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  clock.textContent = `BRT ${time}`;
}

function setActive(index) {
  const nextIndex = (index + projects.length) % projects.length;
  if (nextIndex === activeIndex && !root.classList.contains("is-ready")) return;

  activeIndex = nextIndex;
  const project = projects[activeIndex];
  root.classList.add("is-switching");
  root.classList.add("is-ready");

  window.setTimeout(() => {
    titleEl.innerHTML = project.title.map((line) => `<span>${line}</span>`).join("");
    eyebrowEl.textContent = project.eyebrow;
    areaEl.textContent = project.area;
    yearEl.textContent = project.year;
    descEl.textContent = project.description;
    linkEl.href = project.href;
    visualEl.src = project.visual;
    visualEl.alt = project.alt;
    counterEl.textContent = pad(activeIndex + 1);

    const progress = Math.round((activeIndex / (projects.length - 1)) * 100);
    progressText.textContent = `${progress}%`;
    progressBar.style.setProperty("--progress", `${progress}%`);

    rows.forEach((row) => row.classList.toggle("is-active", Number(row.dataset.index) === activeIndex));
    stepButtons.forEach((button) =>
      button.classList.toggle("is-active", Number(button.dataset.index) === activeIndex),
    );
  }, 170);

  window.setTimeout(() => {
    root.classList.remove("is-switching");
  }, 470);
}

function navigate(direction) {
  const now = Date.now();
  if (now < lockUntil) return;
  lockUntil = now + 680;
  setActive(activeIndex + direction);
}

window.addEventListener(
  "wheel",
  (event) => {
    if (Math.abs(event.deltaY) < 18) return;
    event.preventDefault();
    navigate(event.deltaY > 0 ? 1 : -1);
  },
  { passive: false },
);

window.addEventListener("keydown", (event) => {
  const forwardKeys = ["ArrowDown", "ArrowRight", "PageDown", " "];
  const backwardKeys = ["ArrowUp", "ArrowLeft", "PageUp"];

  if (forwardKeys.includes(event.key)) {
    event.preventDefault();
    navigate(1);
  }

  if (backwardKeys.includes(event.key)) {
    event.preventDefault();
    navigate(-1);
  }

  if (event.key === "Escape") root.classList.remove("show-method");
});

window.addEventListener(
  "touchstart",
  (event) => {
    const point = event.touches[0];
    touchStartY = point.clientY;
    touchStartX = point.clientX;
  },
  { passive: true },
);

window.addEventListener(
  "touchend",
  (event) => {
    const point = event.changedTouches[0];
    const diffY = touchStartY - point.clientY;
    const diffX = touchStartX - point.clientX;
    const primary = Math.abs(diffY) > Math.abs(diffX) ? diffY : diffX;

    if (Math.abs(primary) > 46) navigate(primary > 0 ? 1 : -1);
  },
  { passive: true },
);

[...rows, ...stepButtons].forEach((control) => {
  control.addEventListener("click", () => setActive(Number(control.dataset.index)));
});

document.querySelectorAll('a[href="#sobre"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    root.classList.toggle("show-method");
  });
});

document.querySelectorAll(".magnetic, .project-row, .steps button").forEach((element) => {
  element.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
  element.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
});

window.addEventListener("mousemove", (event) => {
  cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
});

updateClock();
setInterval(updateClock, 30000);
setActive(0);
