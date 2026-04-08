document.addEventListener("DOMContentLoaded", () => {
  const TRANSITION_KEY = "presenceTransitionState";
  const OUTBOUND_MS = 520;
  const TO_44_MS = 620;
  const TO_72_MS = 760;
  const TO_99_MS = 760;
  const FINISH_MS = 340;
  const RESUME_TTL_MS = 15000;
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pages = {
    "index.html": { eyebrow: "Web Interview Guide", sectionTop: "index.html", current: 0, total: 4, prev: null, next: "pre-interview-checks.html", indexCurrent: true, sectionCurrent: true },
    "pre-interview-checks.html": { eyebrow: "Pre Interview Checks", sectionTop: "pre-interview-checks.html", current: 1, total: 6, prev: "index.html", next: "pre-interview-checks/usage-device.html", sectionCurrent: true },
    "pre-interview-checks/usage-device.html": { eyebrow: "Pre Interview Checks", sectionTop: "pre-interview-checks.html", current: 2, total: 6, prev: "pre-interview-checks.html", next: "pre-interview-checks/audio-camera-desktop.html" },
    "pre-interview-checks/audio-camera-desktop.html": { eyebrow: "Pre Interview Checks", sectionTop: "pre-interview-checks.html", current: 3, total: 6, prev: "pre-interview-checks/usage-device.html", next: "pre-interview-checks/environment-notifications.html" },
    "pre-interview-checks/environment-notifications.html": { eyebrow: "Pre Interview Checks", sectionTop: "pre-interview-checks.html", current: 4, total: 6, prev: "pre-interview-checks/audio-camera-desktop.html", next: "pre-interview-checks/platform-overview.html" },
    "pre-interview-checks/platform-overview.html": { eyebrow: "Pre Interview Checks", sectionTop: "pre-interview-checks.html", current: 5, total: 6, prev: "pre-interview-checks/environment-notifications.html", next: "pre-interview-checks/platform-overview/zoom.html" },
    "pre-interview-checks/platform-overview/zoom.html": { eyebrow: "Platform Detail", sectionTop: "pre-interview-checks/platform-overview.html", current: 6, total: 8, prev: "pre-interview-checks/platform-overview.html", next: "pre-interview-checks/platform-overview/google-meet.html" },
    "pre-interview-checks/platform-overview/google-meet.html": { eyebrow: "Platform Detail", sectionTop: "pre-interview-checks/platform-overview.html", current: 7, total: 8, prev: "pre-interview-checks/platform-overview/zoom.html", next: "pre-interview-checks/platform-overview/microsoft-teams.html" },
    "pre-interview-checks/platform-overview/microsoft-teams.html": { eyebrow: "Platform Detail", sectionTop: "pre-interview-checks/platform-overview.html", current: 8, total: 8, prev: "pre-interview-checks/platform-overview/google-meet.html", next: "materials-preparation.html" },
    "materials-preparation.html": { eyebrow: "Materials Preparation", sectionTop: "materials-preparation.html", current: 1, total: 6, prev: "pre-interview-checks/platform-overview/microsoft-teams.html", next: "materials-preparation/company-information.html", sectionCurrent: true },
    "materials-preparation/company-information.html": { eyebrow: "Materials Preparation", sectionTop: "materials-preparation.html", current: 2, total: 6, prev: "materials-preparation.html", next: "materials-preparation/resume-career-history.html" },
    "materials-preparation/resume-career-history.html": { eyebrow: "Materials Preparation", sectionTop: "materials-preparation.html", current: 3, total: 6, prev: "materials-preparation/company-information.html", next: "materials-preparation/portfolio.html" },
    "materials-preparation/portfolio.html": { eyebrow: "Materials Preparation", sectionTop: "materials-preparation.html", current: 4, total: 6, prev: "materials-preparation/resume-career-history.html", next: "materials-preparation/curriculum-learning-log.html" },
    "materials-preparation/curriculum-learning-log.html": { eyebrow: "Materials Preparation", sectionTop: "materials-preparation.html", current: 5, total: 6, prev: "materials-preparation/portfolio.html", next: "materials-preparation/company-questionnaire.html" },
    "materials-preparation/company-questionnaire.html": { eyebrow: "Materials Preparation", sectionTop: "materials-preparation.html", current: 6, total: 6, prev: "materials-preparation/curriculum-learning-log.html", next: "chatgpt-support.html" },
    "chatgpt-support.html": { eyebrow: "ChatGPT Support", sectionTop: "chatgpt-support.html", current: 1, total: 5, prev: "materials-preparation/company-questionnaire.html", next: "chatgpt-support/job-understanding.html", sectionCurrent: true },
    "chatgpt-support/job-understanding.html": { eyebrow: "ChatGPT Support", sectionTop: "chatgpt-support.html", current: 2, total: 5, prev: "chatgpt-support.html", next: "chatgpt-support/reflection-memo.html" },
    "chatgpt-support/reflection-memo.html": { eyebrow: "ChatGPT Support", sectionTop: "chatgpt-support.html", current: 3, total: 5, prev: "chatgpt-support/job-understanding.html", next: "chatgpt-support/mock-qa.html" },
    "chatgpt-support/mock-qa.html": { eyebrow: "ChatGPT Support", sectionTop: "chatgpt-support.html", current: 4, total: 5, prev: "chatgpt-support/reflection-memo.html", next: "chatgpt-support/mock-interview.html" },
    "chatgpt-support/mock-interview.html": { eyebrow: "ChatGPT Support", sectionTop: "chatgpt-support.html", current: 5, total: 5, prev: "chatgpt-support/mock-qa.html", next: "closing.html" },
    "closing.html": { eyebrow: "Closing", sectionTop: "closing.html", current: 1, total: 1, prev: "chatgpt-support/mock-interview.html", next: null, sectionCurrent: true },
  };

  const labels = {
    navAria: "共通ナビゲーション",
    index: "Indexへ",
    section: "Sec.Topへ",
    prev: "前へ",
    next: "次へ",
    title: "SYSTEM TRANSFER",
    init: "遷移シーケンスを初期化しています",
    loading: "ページ遷移データを組み立てています",
    route: "次ページへ移動しています",
    reveal: "次ページを表示しています",
    hint: "左右キーやフリック操作も可能です",
  };

  let overlay;
  let fill;
  let percent;
  let message;
  let meta;
  let stepNodes = [];
  let streamCanvas;
  let streamContext;
  let neuronCanvas;
  let neuronContext;
  let viewport = { x: 0, y: 0 };
  let streamWidth = 0;
  let streamHeight = 0;
  let neuronWidth = 0;
  let neuronHeight = 0;
  let binaryParticles = [];
  let hexParticles = [];
  let spiralParticles = [];
  let neuralNodes = [];
  let synapses = [];
  let streamFrameId = 0;
  let neuronFrameId = 0;
  let metaTimerId = 0;
  let transitionTimerIds = [];
  let isTransitionRunning = false;

  const pageKey = resolvePageKey();
  const page = pages[pageKey];

  buildSharedNavigation();
  createOverlay();
  syncScrolledState();
  setupSwipeNavigation();
  setupTransitionLinks();
  resumeTransitionIfNeeded();

  function resolvePageKey(urlString = window.location.href) {
    const normalized = decodeURIComponent(new URL(urlString, window.location.href).pathname).replace(/\\/g, "/");
    const marker = "/Presence-Stack/";
    const markerIndex = normalized.lastIndexOf(marker);
    if (markerIndex >= 0) {
      return normalized.slice(markerIndex + marker.length);
    }
    return normalized.replace(/^\/+/, "");
  }

  function buildSharedNavigation() {
    if (!page) return;

    const relativeHref = (from, to) => {
      const fromParts = from.split("/").slice(0, -1);
      const toParts = to.split("/");
      while (fromParts.length && toParts.length && fromParts[0] === toParts[0]) {
        fromParts.shift();
        toParts.shift();
      }
      return [...fromParts.map(() => ".."), ...toParts].join("/") || ".";
    };

    const navHref = (target) => (target ? relativeHref(pageKey, target) : "");
    const navLink = (target, label, current) =>
      current
        ? `<span class="header-nav-link is-current">${label}</span>`
        : `<a class="header-nav-link" href="${navHref(target)}">${label}</a>`;

    const pagerLink = (target, label, secondary) => {
      const className = secondary ? "pager-link is-secondary" : "pager-link";
      return target
        ? `<a class="${className}" href="${navHref(target)}">${label}</a>`
        : `<span class="${className} is-disabled">${label}</span>`;
    };

    const progress = page.total ? Math.min(100, (page.current / page.total) * 100) : 0;
    const headerHtml = `
      <header class="slide-header">
        <div class="slide-header-bar">
          <span class="eyebrow">${page.eyebrow}</span>
          <nav class="header-nav" aria-label="${labels.navAria}">
            ${navLink("index.html", labels.index, Boolean(page.indexCurrent))}
            ${navLink(page.sectionTop, labels.section, Boolean(page.sectionCurrent))}
          </nav>
          <div class="pager-main">
            <div class="pager-links">
              ${pagerLink(page.prev, labels.prev, true)}
              <div class="page-number">${page.current} / ${page.total}</div>
              ${pagerLink(page.next, labels.next, false)}
            </div>
          </div>
        </div>
      </header>
    `;

    const footerHtml = `
      <footer class="slide-footer">
        <div class="pager">
          <div class="pager-main">
            <div class="pager-links">
              ${pagerLink(page.prev, labels.prev, true)}
              <div class="page-number">${page.current} / ${page.total}</div>
              ${pagerLink(page.next, labels.next, false)}
            </div>
          </div>
          <div class="pager-side">
            <div class="pager-progress" aria-hidden="true">
              <div class="pager-progress-bar" style="width: ${progress.toFixed(2)}%;"></div>
            </div>
            <div class="pager-hint">${labels.hint}</div>
          </div>
        </div>
      </footer>
    `;

    const headerSlot = document.querySelector("[data-shared-header]");
    const footerSlot = document.querySelector("[data-shared-footer]");
    const existingHeader = document.querySelector(".slide-header");
    const existingFooter = document.querySelector(".slide-footer");

    if (headerSlot) headerSlot.outerHTML = headerHtml;
    else if (existingHeader) existingHeader.outerHTML = headerHtml;

    if (footerSlot) footerSlot.outerHTML = footerHtml;
    else if (existingFooter) existingFooter.outerHTML = footerHtml;
  }

  function syncScrolledState() {
    const scrollArea = document.querySelector(".slide-body");
    if (!scrollArea) return;

    const update = () => {
      document.body.classList.toggle("is-scrolled", scrollArea.scrollTop > 8);
    };

    scrollArea.addEventListener("scroll", update, { passive: true });
    update();
  }

  function setupSwipeNavigation() {
    const scrollArea = document.querySelector(".slide-body");
    if (!scrollArea) return;

    const prevLink = document.querySelector(".pager-link.is-secondary[href]");
    const nextLink = document.querySelector(".pager-link[href]:not(.is-secondary)");
    const swipeState = { startX: 0, startY: 0, active: false };
    const edgeGuard = 28;

    const startSwipe = (clientX, clientY, target) => {
      if (document.body.classList.contains("has-modal")) return;
      if (target?.closest("a, button, input, textarea, select, label")) return;
      if (clientX <= edgeGuard || clientX >= window.innerWidth - edgeGuard) return;
      swipeState.startX = clientX;
      swipeState.startY = clientY;
      swipeState.active = true;
    };

    const endSwipe = (clientX, clientY) => {
      if (!swipeState.active) return;
      swipeState.active = false;

      const deltaX = clientX - swipeState.startX;
      const deltaY = clientY - swipeState.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (absX < 96 || absX <= absY * 1.35) return;

      const destination = deltaX < 0 ? nextLink?.getAttribute("href") : prevLink?.getAttribute("href");
      if (!destination) return;
      navigateWithTransition(destination);
    };

    scrollArea.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      startSwipe(touch.clientX, touch.clientY, event.target);
    }, { passive: true });

    scrollArea.addEventListener("touchend", (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      endSwipe(touch.clientX, touch.clientY);
    }, { passive: true });

    scrollArea.addEventListener("touchcancel", () => {
      swipeState.active = false;
    }, { passive: true });
  }

  function createOverlay() {
    overlay = document.createElement("div");
    overlay.className = "page-transition-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <canvas class="page-transition-canvas" aria-hidden="true"></canvas>
      <canvas class="page-transition-neuron" aria-hidden="true"></canvas>
      <div class="page-transition-center-glow" aria-hidden="true"></div>
      <div class="page-transition-vanishing-ring" aria-hidden="true"></div>
      <div class="page-transition-lane" aria-hidden="true">
        <div class="page-transition-lane-line is-left"></div>
        <div class="page-transition-lane-line is-right"></div>
      </div>
      <div class="page-transition-panel" role="status" aria-live="polite">
        <div class="page-transition-top">
          <div>
            <p class="page-transition-label">${labels.title}</p>
            <p class="page-transition-message">${labels.init}</p>
          </div>
          <div class="page-transition-percent">0%</div>
        </div>
        <div class="page-transition-bar">
          <div class="page-transition-fill"></div>
        </div>
        <div class="page-transition-steps">
          <span class="page-transition-step is-active" data-step="0">0%</span>
          <span class="page-transition-step" data-step="16">16%</span>
          <span class="page-transition-step" data-step="44">44%</span>
          <span class="page-transition-step" data-step="72">72%</span>
          <span class="page-transition-step" data-step="99">99%</span>
        </div>
        <div class="page-transition-meta">${createMixedMeta()}</div>
      </div>
    `;

    document.body.appendChild(overlay);
    fill = overlay.querySelector(".page-transition-fill");
    percent = overlay.querySelector(".page-transition-percent");
    message = overlay.querySelector(".page-transition-message");
    meta = overlay.querySelector(".page-transition-meta");
    stepNodes = Array.from(overlay.querySelectorAll(".page-transition-step"));
    streamCanvas = overlay.querySelector(".page-transition-canvas");
    streamContext = streamCanvas.getContext("2d");
    neuronCanvas = overlay.querySelector(".page-transition-neuron");
    neuronContext = neuronCanvas.getContext("2d");

    resizeCanvas();
    startAnimatedLayers();
    window.addEventListener("resize", handleResize, { passive: true });
  }

  function handleResize() {
    resizeCanvas();
  }

  function resizeCanvas() {
    setupStreams();
    setupNeuronNetwork();
  }

  function startAnimatedLayers() {
    stopAnimatedLayers();
    if (!REDUCED_MOTION) {
      drawStreams();
      drawNeuronNetwork();
    }
    metaTimerId = window.setInterval(() => {
      if (meta) meta.textContent = createMixedMeta();
    }, REDUCED_MOTION ? 1200 : 130);
  }

  function stopAnimatedLayers() {
    if (streamFrameId) {
      window.cancelAnimationFrame(streamFrameId);
      streamFrameId = 0;
    }
    if (neuronFrameId) {
      window.cancelAnimationFrame(neuronFrameId);
      neuronFrameId = 0;
    }
    if (metaTimerId) {
      window.clearInterval(metaTimerId);
      metaTimerId = 0;
    }
  }

  function randomHexByte() {
    return `0x${Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, "0")}`;
  }

  function createBinaryString() {
    return Array.from({ length: 8 }, () => (Math.random() > 0.5 ? "1" : "0")).join("");
  }

  function createBase64Chunk() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }

  function createMixedMeta() {
    return Array.from({ length: 14 }, () => {
      const type = Math.random();
      if (type < 0.35) return createBinaryString();
      if (type < 0.7) return randomHexByte();
      return createBase64Chunk().slice(0, 4);
    }).join("  ");
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function choose(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function setupStreams() {
    if (!streamCanvas) return;
    streamWidth = streamCanvas.width = window.innerWidth;
    streamHeight = streamCanvas.height = window.innerHeight;
    viewport = { x: streamWidth * 0.5, y: streamHeight * 0.42 };
    binaryParticles = Array.from({ length: Math.max(120, Math.floor(streamWidth / 10)) }, () => spawnBinaryParticle());
    hexParticles = Array.from({ length: Math.max(88, Math.floor(streamWidth / 14)) }, () => spawnHexParticle());
    spiralParticles = Array.from({ length: Math.max(42, Math.floor(streamWidth / 34)) }, () => spawnSpiralParticle());
  }

  function spawnBinaryParticle() {
    const fromTop = Math.random() > 0.5;
    const sideSpread = rand(-streamWidth * 0.62, streamWidth * 0.62);
    const startX = viewport.x + sideSpread;
    const startY = fromTop ? rand(-streamHeight * 0.28, -30) : rand(streamHeight + 30, streamHeight * 1.22);
    return {
      type: "binary",
      text: Math.random() > 0.5 ? "1" : "0",
      x: startX, y: startY, prevX: startX, prevY: startY, startX, startY,
      age: Math.random(), speed: rand(0.014, 0.028), startSize: rand(20, 42), endSize: rand(3, 7),
      hue: fromTop ? "rgba(127,255,224," : "rgba(120,185,255,",
      trail: fromTop ? "rgba(127,255,224," : "rgba(120,185,255,",
    };
  }

  function spawnHexParticle() {
    const fromLeft = Math.random() > 0.5;
    const verticalSpread = rand(-streamHeight * 0.44, streamHeight * 0.44);
    const startX = fromLeft ? rand(-streamWidth * 0.34, -70) : rand(streamWidth + 70, streamWidth * 1.34);
    const startY = viewport.y + verticalSpread;
    return {
      type: "hex",
      text: randomHexByte(),
      x: startX, y: startY, prevX: startX, prevY: startY, startX, startY,
      age: Math.random(), speed: rand(0.011, 0.022), startSize: rand(16, 28), endSize: rand(4, 8),
      hue: fromLeft ? "rgba(120,185,255," : "rgba(153,216,255,",
      trail: fromLeft ? "rgba(120,185,255," : "rgba(153,216,255,",
    };
  }

  function spawnSpiralParticle() {
    const orbit = rand(Math.min(streamWidth, streamHeight) * 0.16, Math.min(streamWidth, streamHeight) * 0.44);
    const startAngle = rand(0, Math.PI * 2);
    return {
      type: "spiral",
      text: createBase64Chunk().slice(0, Math.random() > 0.5 ? 3 : 4),
      x: viewport.x, y: viewport.y, prevX: viewport.x, prevY: viewport.y,
      orbit, startAngle, turns: rand(1.8, 3.2), age: Math.random(), speed: rand(0.01, 0.018),
      startSize: rand(16, 28), endSize: rand(4, 7),
      hue: choose(["rgba(184,141,255,", "rgba(127,255,224,", "rgba(120,185,255,"]),
      trail: "rgba(184,141,255,",
    };
  }

  function updateLinearParticle(particle) {
    particle.prevX = particle.x;
    particle.prevY = particle.y;
    particle.age += particle.speed;
    if (particle.age >= 1) return particle.type === "binary" ? spawnBinaryParticle() : spawnHexParticle();
    const ease = 1 - Math.pow(1 - particle.age, 3.15);
    particle.x = particle.startX + (viewport.x - particle.startX) * ease;
    particle.y = particle.startY + (viewport.y - particle.startY) * ease;
    return particle;
  }

  function updateSpiralParticle(particle) {
    particle.prevX = particle.x;
    particle.prevY = particle.y;
    particle.age += particle.speed;
    if (particle.age >= 1) return spawnSpiralParticle();
    const ease = 1 - Math.pow(1 - particle.age, 2.8);
    const radius = Math.max(2, particle.orbit * Math.pow(1 - ease, 1.12));
    const angle = particle.startAngle + ease * particle.turns * Math.PI * 2;
    particle.x = viewport.x + Math.cos(angle) * radius;
    particle.y = viewport.y + Math.sin(angle) * radius * 0.72;
    return particle;
  }

  function drawTrail(particle, alpha) {
    streamContext.strokeStyle = `${particle.trail || particle.hue}${alpha})`;
    streamContext.lineWidth = 1;
    streamContext.beginPath();
    streamContext.moveTo(particle.prevX, particle.prevY);
    streamContext.lineTo(particle.x, particle.y);
    streamContext.stroke();
  }

  function drawParticle(particle, alphaBoost = 0) {
    const scale = particle.startSize + (particle.endSize - particle.startSize) * particle.age;
    const alpha = Math.max(0.07, 0.98 - particle.age * (0.9 - alphaBoost));
    drawTrail(particle, Math.min(0.52, alpha * 0.55));
    streamContext.font = `${scale}px monospace`;
    streamContext.fillStyle = `${particle.hue}${alpha})`;
    streamContext.shadowBlur = 16;
    streamContext.shadowColor = `${particle.hue}${Math.min(0.78, alpha * 0.68)})`;
    streamContext.fillText(particle.text, particle.x, particle.y);
  }

  function drawStreams() {
    if (!streamContext) return;
    streamContext.clearRect(0, 0, streamWidth, streamHeight);
    streamContext.textAlign = "center";
    streamContext.textBaseline = "middle";
    binaryParticles = binaryParticles.map(updateLinearParticle);
    hexParticles = hexParticles.map(updateLinearParticle);
    spiralParticles = spiralParticles.map(updateSpiralParticle);
    binaryParticles.forEach((particle) => drawParticle(particle, 0));
    hexParticles.forEach((particle) => drawParticle(particle, 0.06));
    spiralParticles.forEach((particle) => drawParticle(particle, 0.12));
    streamContext.shadowBlur = 0;
    streamFrameId = window.requestAnimationFrame(drawStreams);
  }

  function cubicPoint(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    return {
      x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
      y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
    };
  }

  function setupNeuronNetwork() {
    if (!neuronCanvas) return;
    neuronWidth = neuronCanvas.width = window.innerWidth;
    neuronHeight = neuronCanvas.height = window.innerHeight;
    const count = Math.max(18, Math.floor(neuronWidth / 110));
    neuralNodes = Array.from({ length: count }, () => ({
      orbit: rand(30, Math.min(neuronWidth, neuronHeight) * 0.34),
      angle: rand(0, Math.PI * 2),
      speed: rand(0.0016, 0.0052),
      drift: rand(-18, 18),
      r: rand(1.4, 3.2),
    }));
    const synapseCount = Math.max(10, Math.floor(neuronWidth / 160));
    synapses = Array.from({ length: synapseCount }, (_, index) => ({
      angle: ((Math.PI * 2 * index) / synapseCount) + rand(-0.18, 0.18),
      radius: rand(Math.min(neuronWidth, neuronHeight) * 0.4, Math.min(neuronWidth, neuronHeight) * 0.6),
      bulbR: rand(10, 22),
      branchPull: rand(0.22, 0.36),
      wobble: rand(-16, 16),
      pulseOffset: Math.random(),
      vesicles: Array.from({ length: 4 + Math.floor(Math.random() * 4) }, () => ({
        orbit: rand(14, 32),
        angle: rand(0, Math.PI * 2),
        speed: rand(0.004, 0.012),
        r: rand(1.6, 3.4),
      })),
    }));
  }

  function drawNeuronNetwork() {
    if (!neuronContext) return;
    neuronContext.clearRect(0, 0, neuronWidth, neuronHeight);
    const time = performance.now() * 0.001;

    synapses.forEach((synapse, index) => {
      const driftAngle = synapse.angle + Math.sin(time * 0.35 + index * 0.7) * 0.06;
      const bulb = { x: viewport.x + Math.cos(driftAngle) * synapse.radius, y: viewport.y + Math.sin(driftAngle) * synapse.radius * 0.78 };
      const innerA = { x: viewport.x + Math.cos(driftAngle - 0.24) * synapse.radius * synapse.branchPull, y: viewport.y + Math.sin(driftAngle - 0.24) * synapse.radius * synapse.branchPull * 0.74 };
      const innerB = { x: viewport.x + Math.cos(driftAngle + 0.18) * synapse.radius * (synapse.branchPull + 0.14), y: viewport.y + Math.sin(driftAngle + 0.18) * synapse.radius * (synapse.branchPull + 0.14) * 0.72 + synapse.wobble * 0.2 };

      neuronContext.strokeStyle = "rgba(127,255,224,0.11)";
      neuronContext.lineWidth = 1.2;
      neuronContext.beginPath();
      neuronContext.moveTo(bulb.x, bulb.y);
      neuronContext.bezierCurveTo(innerB.x, innerB.y, innerA.x, innerA.y, viewport.x, viewport.y);
      neuronContext.stroke();

      neuronContext.strokeStyle = "rgba(120,185,255,0.08)";
      neuronContext.lineWidth = 3.2;
      neuronContext.beginPath();
      neuronContext.moveTo(bulb.x, bulb.y);
      neuronContext.bezierCurveTo(innerB.x, innerB.y, innerA.x, innerA.y, viewport.x, viewport.y);
      neuronContext.stroke();

      const pulseT = (time * 0.95 + synapse.pulseOffset) % 1;
      const pulseT2 = (pulseT + 0.22) % 1;
      const pulsePoint = cubicPoint(bulb, innerB, innerA, viewport, 0.06 + pulseT * 0.84);
      const pulsePoint2 = cubicPoint(bulb, innerB, innerA, viewport, 0.06 + pulseT2 * 0.84);

      neuronContext.strokeStyle = "rgba(150,255,236,0.26)";
      neuronContext.lineWidth = 2.8;
      neuronContext.shadowBlur = 18;
      neuronContext.shadowColor = "rgba(127,255,224,0.34)";
      neuronContext.beginPath();
      neuronContext.moveTo(bulb.x, bulb.y);
      neuronContext.bezierCurveTo(innerB.x, innerB.y, innerA.x, innerA.y, viewport.x, viewport.y);
      neuronContext.stroke();

      neuronContext.strokeStyle = "rgba(120,185,255,0.14)";
      neuronContext.lineWidth = 5.2;
      neuronContext.beginPath();
      neuronContext.moveTo(bulb.x, bulb.y);
      neuronContext.bezierCurveTo(innerB.x, innerB.y, innerA.x, innerA.y, viewport.x, viewport.y);
      neuronContext.stroke();

      neuronContext.fillStyle = "rgba(220,255,246,0.96)";
      neuronContext.shadowBlur = 28;
      neuronContext.shadowColor = "rgba(127,255,224,0.88)";
      neuronContext.beginPath();
      neuronContext.arc(pulsePoint.x, pulsePoint.y, 3.8, 0, Math.PI * 2);
      neuronContext.fill();

      neuronContext.fillStyle = "rgba(150,220,255,0.72)";
      neuronContext.shadowBlur = 18;
      neuronContext.shadowColor = "rgba(120,185,255,0.72)";
      neuronContext.beginPath();
      neuronContext.arc(pulsePoint2.x, pulsePoint2.y, 2.4, 0, Math.PI * 2);
      neuronContext.fill();

      neuronContext.strokeStyle = "rgba(200,255,245,0.34)";
      neuronContext.lineWidth = 1.3;
      neuronContext.beginPath();
      neuronContext.moveTo(pulsePoint2.x, pulsePoint2.y);
      neuronContext.lineTo(pulsePoint.x, pulsePoint.y);
      neuronContext.stroke();
      neuronContext.shadowBlur = 0;

      neuronContext.fillStyle = "rgba(127,255,224,0.30)";
      neuronContext.beginPath();
      neuronContext.arc(bulb.x, bulb.y, synapse.bulbR * 1.18, 0, Math.PI * 2);
      neuronContext.fill();

      neuronContext.fillStyle = `rgba(210,255,245,${0.18 + 0.16 * Math.sin(time * 2.2 + index) ** 2})`;
      neuronContext.beginPath();
      neuronContext.arc(bulb.x, bulb.y, synapse.bulbR * 0.94, 0, Math.PI * 2);
      neuronContext.fill();

      neuronContext.fillStyle = "rgba(127,255,224,0.46)";
      neuronContext.beginPath();
      neuronContext.arc(bulb.x, bulb.y, synapse.bulbR * 0.72, 0, Math.PI * 2);
      neuronContext.fill();

      neuronContext.strokeStyle = "rgba(200,255,245,0.18)";
      neuronContext.lineWidth = 1;
      neuronContext.beginPath();
      neuronContext.arc(bulb.x, bulb.y, synapse.bulbR, 0, Math.PI * 2);
      neuronContext.stroke();

      synapse.vesicles.forEach((vesicle, vesicleIndex) => {
        vesicle.angle += vesicle.speed;
        const vx = bulb.x + Math.cos(vesicle.angle + vesicleIndex * 0.45) * vesicle.orbit;
        const vy = bulb.y + Math.sin(vesicle.angle + vesicleIndex * 0.45) * vesicle.orbit * 0.74;
        neuronContext.fillStyle = vesicleIndex % 2 === 0 ? "rgba(120,185,255,0.34)" : "rgba(127,255,224,0.34)";
        neuronContext.beginPath();
        neuronContext.arc(vx, vy, vesicle.r, 0, Math.PI * 2);
        neuronContext.fill();
      });
    });

    const points = neuralNodes.map((node) => {
      node.angle += node.speed;
      return {
        x: viewport.x + Math.cos(node.angle) * node.orbit,
        y: viewport.y + Math.sin(node.angle) * (node.orbit * 0.6) + node.drift,
        r: node.r,
      };
    });

    for (let index = 0; index < points.length; index += 1) {
      const a = points[index];
      for (let otherIndex = index + 1; otherIndex < points.length; otherIndex += 1) {
        const b = points[otherIndex];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.22;
          neuronContext.strokeStyle = `rgba(127,255,224,${alpha})`;
          neuronContext.lineWidth = 1;
          neuronContext.beginPath();
          neuronContext.moveTo(a.x, a.y);
          neuronContext.lineTo(b.x, b.y);
          neuronContext.stroke();
        }
      }
    }

    points.forEach((point) => {
      neuronContext.fillStyle = "rgba(134,255,226,0.78)";
      neuronContext.beginPath();
      neuronContext.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      neuronContext.fill();
    });

    neuronFrameId = window.requestAnimationFrame(drawNeuronNetwork);
  }

  function setupTransitionLinks() {
    document.addEventListener("click", (event) => {
      const anchor = event.target.closest("a");
      if (!isEligibleLink(anchor)) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      navigateWithTransition(anchor.href);
    });

    document.addEventListener("pointerover", (event) => {
      const anchor = event.target.closest("a");
      if (anchor) prefetchLink(anchor);
    });

    document.addEventListener("focusin", (event) => {
      const anchor = event.target.closest("a");
      if (anchor) prefetchLink(anchor);
    });
  }

  function isEligibleLink(anchor) {
    if (!anchor || !anchor.href) return false;
    if (anchor.hasAttribute("download")) return false;
    if (anchor.dataset.transitionIgnore === "true") return false;
    if (anchor.target && anchor.target.toLowerCase() === "_blank") return false;

    const rawHref = anchor.getAttribute("href") || "";
    if (!rawHref || rawHref.startsWith("#")) return false;
    if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return false;

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (resolvePageKey(url.href) === pageKey) return false;
    if (url.pathname === window.location.pathname && url.hash) return false;
    return true;
  }

  function prefetchLink(anchor) {
    if (!isEligibleLink(anchor)) return;
    const url = new URL(anchor.href, window.location.href);
    if (document.head.querySelector(`link[rel="prefetch"][href="${url.href}"]`)) return;
    const prefetchTag = document.createElement("link");
    prefetchTag.rel = "prefetch";
    prefetchTag.href = url.href;
    prefetchTag.as = "document";
    document.head.appendChild(prefetchTag);
  }

  function navigateWithTransition(href) {
    if (isTransitionRunning || !href) return false;

    const targetUrl = new URL(href, window.location.href);
    const targetPageKey = resolvePageKey(targetUrl.href);
    if (!targetPageKey) return false;

    clearTransitionTimers();
    isTransitionRunning = true;
    document.body.classList.add("page-transition-lock");
    overlay.classList.remove("is-active", "is-fading-out", "is-revealing");
    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    setProgress(0, labels.init);
    persistTransitionState({
      phase: "outbound",
      source: pageKey,
      target: targetPageKey,
      href: targetUrl.href,
      startedAt: Date.now(),
    });

    schedule(() => {
      setProgress(16, labels.loading);
      persistTransitionState({
        phase: "resume",
        source: pageKey,
        target: targetPageKey,
        href: targetUrl.href,
        startedAt: Date.now(),
      });
      window.location.href = targetUrl.href;
    }, REDUCED_MOTION ? 60 : OUTBOUND_MS);

    return true;
  }

  function resumeTransitionIfNeeded() {
    const state = readTransitionState();
    if (!state) {
      clearResumeClass();
      return;
    }

    const expired = Date.now() - Number(state.startedAt || 0) > RESUME_TTL_MS;
    if (expired || state.phase !== "resume" || state.target !== pageKey) {
      clearTransitionState();
      clearResumeClass();
      return;
    }

    document.body.classList.add("page-transition-lock");
    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.classList.remove("transition-resume");
    setProgress(16, labels.loading);

    schedule(() => setProgress(44, labels.route), REDUCED_MOTION ? 80 : TO_44_MS);
    schedule(() => {
      setProgress(72, labels.reveal);
      overlay.classList.add("is-revealing");
    }, REDUCED_MOTION ? 140 : TO_44_MS + TO_72_MS);

    schedule(() => setProgress(99, labels.reveal), REDUCED_MOTION ? 220 : TO_44_MS + TO_72_MS + TO_99_MS);
    schedule(() => {
      overlay.classList.add("is-fading-out");
      document.body.classList.remove("page-transition-lock");
      clearTransitionState();
      schedule(() => {
        overlay.classList.remove("is-active", "is-fading-out", "is-revealing");
        overlay.setAttribute("aria-hidden", "true");
        isTransitionRunning = false;
      }, REDUCED_MOTION ? 60 : FINISH_MS);
    }, REDUCED_MOTION ? 260 : TO_44_MS + TO_72_MS + TO_99_MS + FINISH_MS);
  }

  function clearResumeClass() {
    document.documentElement.classList.remove("transition-resume");
  }

  function setProgress(value, nextMessage) {
    if (fill) fill.style.width = `${value}%`;
    if (percent) percent.textContent = `${value}%`;
    if (message) message.textContent = nextMessage;
    stepNodes.forEach((node) => {
      node.classList.toggle("is-active", Number(node.dataset.step) <= value);
    });
  }

  function schedule(callback, delay) {
    transitionTimerIds.push(window.setTimeout(callback, delay));
  }

  function clearTransitionTimers() {
    transitionTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    transitionTimerIds = [];
  }

  function readTransitionState() {
    try {
      const raw = window.sessionStorage.getItem(TRANSITION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function persistTransitionState(state) {
    try {
      window.sessionStorage.setItem(TRANSITION_KEY, JSON.stringify(state));
    } catch {}
  }

  function clearTransitionState() {
    try {
      window.sessionStorage.removeItem(TRANSITION_KEY);
    } catch {}
  }

  window.PresencePageTransition = {
    navigate(href) {
      return navigateWithTransition(href);
    },
  };
});
