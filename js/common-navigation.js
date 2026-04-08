document.addEventListener("DOMContentLoaded", () => {
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
    navAria: "\u5171\u901A\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3",
    index: "Index\u3078",
    section: "Sec.Top\u3078",
    prev: "\u524D\u3078",
    next: "\u6B21\u3078",
    hint: "\u5DE6\u53F3\u30AD\u30FC\u3084\u30D5\u30EA\u30C3\u30AF\u64CD\u4F5C\u3082\u53EF\u80FD\u3067\u3059",
  };

  const resolvePageKey = () => {
    const normalized = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");
    const marker = "/Presence-Stack/";
    const markerIndex = normalized.lastIndexOf(marker);
    if (markerIndex >= 0) {
      return normalized.slice(markerIndex + marker.length);
    }
    return normalized.replace(/^\/+/, "");
  };

  const pageKey = resolvePageKey();
  const page = pages[pageKey];

  if (page) {
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

    if (headerSlot) {
      headerSlot.outerHTML = headerHtml;
    } else if (existingHeader) {
      existingHeader.outerHTML = headerHtml;
    }

    if (footerSlot) {
      footerSlot.outerHTML = footerHtml;
    } else if (existingFooter) {
      existingFooter.outerHTML = footerHtml;
    }
  }

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

    if (window.PresencePageTransition?.navigate) {
      window.PresencePageTransition.navigate(destination);
    } else {
      window.location.href = destination;
    }
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
});
