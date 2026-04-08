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
  let canvas;
  let canvasContext;
  let hexLayer;
  let signalLayer;
  let binaryColumns = [];
  let binaryFrameId = 0;
  let metaTimerId = 0;
  let signalTimerId = 0;
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
      <div class="page-transition-hex" aria-hidden="true"></div>
      <div class="page-transition-noise" aria-hidden="true"></div>
      <div class="page-transition-character" aria-hidden="true"></div>
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
        <div class="page-transition-meta">${createMixedMeta()}</div>
      </div>
    `;

    document.body.appendChild(overlay);
    fill = overlay.querySelector(".page-transition-fill");
    percent = overlay.querySelector(".page-transition-percent");
    message = overlay.querySelector(".page-transition-message");
    meta = overlay.querySelector(".page-transition-meta");
    canvas = overlay.querySelector(".page-transition-canvas");
    canvasContext = canvas.getContext("2d");
    hexLayer = overlay.querySelector(".page-transition-hex");
    signalLayer = overlay.querySelector(".page-transition-character");

    createHexRows();
    createSignalNetwork();
    resizeCanvas();
    startAnimatedLayers();
    window.addEventListener("resize", handleResize, { passive: true });
  }

  function handleResize() {
    resizeCanvas();
    createHexRows();
    createSignalNetwork();
  }

  function resizeCanvas() {
    if (!canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const fontSize = 18;
    canvas.width = width;
    canvas.height = height;
    binaryColumns = Array.from({ length: Math.floor(width / fontSize) }, () => ({
      y: Math.random() * -height,
      speed: 1.1 + Math.random() * 2.1,
      fontSize,
    }));
  }

  function startAnimatedLayers() {
    stopAnimatedLayers();
    if (!REDUCED_MOTION) drawBinaryRain();
    metaTimerId = window.setInterval(() => {
      if (meta) meta.textContent = createMixedMeta();
    }, REDUCED_MOTION ? 1200 : 220);
    signalTimerId = window.setInterval(() => {
      createSignalNetwork();
    }, REDUCED_MOTION ? 2200 : 1400);
  }

  function stopAnimatedLayers() {
    if (binaryFrameId) {
      window.cancelAnimationFrame(binaryFrameId);
      binaryFrameId = 0;
    }
    if (metaTimerId) {
      window.clearInterval(metaTimerId);
      metaTimerId = 0;
    }
    if (signalTimerId) {
      window.clearInterval(signalTimerId);
      signalTimerId = 0;
    }
  }

  function drawBinaryRain() {
    if (!canvasContext) return;

    const width = canvas.width;
    const height = canvas.height;
    canvasContext.fillStyle = "rgba(2, 7, 14, 0.14)";
    canvasContext.fillRect(0, 0, width, height);
    canvasContext.font = "18px monospace";

    binaryColumns.forEach((column, index) => {
      const x = index * column.fontSize;
      const char = Math.random() > 0.5 ? "1" : "0";
      canvasContext.fillStyle = "rgba(110, 255, 219, 0.85)";
      canvasContext.fillText(char, x, column.y);
      column.y += column.speed * column.fontSize * 0.45;
      if (column.y > height + 40) {
        column.y = -20 - Math.random() * 240;
        column.speed = 1.1 + Math.random() * 2.1;
      }
    });

    binaryFrameId = window.requestAnimationFrame(drawBinaryRain);
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
    return Array.from({ length: 12 }, () => {
      const type = Math.random();
      if (type > 0.66) return createBinaryString();
      if (type > 0.33) return randomHexByte();
      return createBase64Chunk();
    }).join("  ");
  }

  function buildHexString(length) {
    return Array.from({ length }, () => randomHexByte()).join("   ");
  }

  function createHexRows() {
    if (!hexLayer) return;
    hexLayer.innerHTML = "";
    const rowCount = 12;
    for (let index = 0; index < rowCount; index += 1) {
      const row = document.createElement("div");
      row.className = "page-transition-hex-row";
      row.textContent = buildHexString(26 + Math.floor(Math.random() * 10));
      row.style.top = `${6 + index * 7.2 + Math.random() * 2.2}%`;
      row.style.animationDuration = `${7 + Math.random() * 7}s`;
      row.style.animationDelay = `${-Math.random() * 10}s`;
      row.style.opacity = `${0.25 + Math.random() * 0.5}`;
      row.style.fontSize = `${12 + Math.random() * 6}px`;
      hexLayer.appendChild(row);
    }
  }

  function createSignalNetwork() {
    if (!signalLayer) return;
    signalLayer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const nodeCount = 8;
    const nodes = Array.from({ length: nodeCount }, (_, index) => ({
      x: 12 + ((index % 4) * 24) + Math.random() * 8,
      y: 18 + (Math.floor(index / 4) * 30) + Math.random() * 10,
      delay: (Math.random() * 1.8).toFixed(2),
    }));

    nodes.forEach((node) => {
      const pulse = document.createElement("span");
      pulse.className = "page-transition-node";
      pulse.style.left = `${node.x}%`;
      pulse.style.top = `${node.y}%`;
      pulse.style.animationDelay = `${node.delay}s`;
      fragment.appendChild(pulse);
    });

    for (let index = 0; index < nodes.length - 1; index += 1) {
      const a = nodes[index];
      const b = nodes[index + 1];
      const line = document.createElement("span");
      line.className = "page-transition-signal";
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      line.style.left = `${a.x}%`;
      line.style.top = `${a.y}%`;
      line.style.width = `${length}%`;
      line.style.transform = `rotate(${angle}deg)`;
      line.style.animationDelay = `${(index * 0.14).toFixed(2)}s`;
      fragment.appendChild(line);
    }

    signalLayer.appendChild(fragment);
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
    setProgress(16, labels.loading);

    schedule(() => setProgress(44, labels.route), REDUCED_MOTION ? 80 : TO_44_MS);
    schedule(() => {
      setProgress(72, labels.reveal);
      document.documentElement.classList.remove("transition-resume");
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
