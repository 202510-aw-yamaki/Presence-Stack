(function () {
  const DURATION_MS = 2000;
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const prefetchState = new Set();
  let overlay;
  let previewFrame;
  let fill;
  let percent;
  let message;
  let meta;
  let hexLayer;
  let canvas;
  let canvasContext;
  let binaryColumns = [];
  let binaryFrameId = 0;
  let metaTimerId = 0;
  let transitionTimerIds = [];
  let activeHref = '';
  let isRunning = false;

  const messages = {
    init: '初期化中...',
    ready: '接続準備中...',
    sync: 'データ同期中...',
    final: '最終チェック中...',
  };

  function randomHexByte() {
    return `0x${Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')}`;
  }

  function createBinaryString() {
    return Array.from({ length: 8 }, () => (Math.random() > 0.5 ? '1' : '0')).join('');
  }

  function createMixedMeta() {
    return Array.from({ length: 12 }, () => (Math.random() > 0.55 ? createBinaryString() : randomHexByte())).join('  ');
  }

  function buildHexString(length) {
    return Array.from({ length }, () => randomHexByte()).join('   ');
  }

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="page-transition-preview" data-transition-preview>
        <iframe class="page-transition-preview-frame" title="遷移先プレビュー" loading="eager"></iframe>
      </div>
      <canvas class="page-transition-canvas" aria-hidden="true"></canvas>
      <div class="page-transition-hex" aria-hidden="true"></div>
      <div class="page-transition-noise" aria-hidden="true"></div>
      <div class="page-transition-character" aria-hidden="true"></div>
      <div class="page-transition-panel" role="status" aria-live="polite">
        <div class="page-transition-top">
          <div>
            <p class="page-transition-label">SYSTEM TRANSFER</p>
            <p class="page-transition-message">${messages.init}</p>
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

    previewFrame = overlay.querySelector('.page-transition-preview-frame');
    fill = overlay.querySelector('.page-transition-fill');
    percent = overlay.querySelector('.page-transition-percent');
    message = overlay.querySelector('.page-transition-message');
    meta = overlay.querySelector('.page-transition-meta');
    hexLayer = overlay.querySelector('.page-transition-hex');
    canvas = overlay.querySelector('.page-transition-canvas');
    canvasContext = canvas.getContext('2d');

    createHexRows();
    resizeCanvas();
    startAnimatedLayers();
    window.addEventListener('resize', handleResize, { passive: true });
  }

  function handleResize() {
    resizeCanvas();
    createHexRows();
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

  function drawBinaryRain() {
    if (!canvasContext || REDUCED_MOTION) return;

    const width = canvas.width;
    const height = canvas.height;
    canvasContext.fillStyle = 'rgba(2, 7, 14, 0.14)';
    canvasContext.fillRect(0, 0, width, height);
    canvasContext.font = '18px monospace';

    binaryColumns.forEach((column, index) => {
      const x = index * column.fontSize;
      const char = Math.random() > 0.5 ? '1' : '0';

      canvasContext.fillStyle = 'rgba(110, 255, 219, 0.85)';
      canvasContext.fillText(char, x, column.y);

      column.y += column.speed * column.fontSize * 0.45;
      if (column.y > height + 40) {
        column.y = -20 - Math.random() * 240;
        column.speed = 1.1 + Math.random() * 2.1;
      }
    });

    binaryFrameId = window.requestAnimationFrame(drawBinaryRain);
  }

  function createHexRows() {
    if (!hexLayer) return;

    hexLayer.innerHTML = '';
    const rowCount = 12;
    for (let index = 0; index < rowCount; index += 1) {
      const row = document.createElement('div');
      row.className = 'page-transition-hex-row';
      row.textContent = buildHexString(26 + Math.floor(Math.random() * 10));
      row.style.top = `${6 + index * 7.2 + Math.random() * 2.2}%`;
      row.style.animationDuration = `${7 + Math.random() * 7}s`;
      row.style.animationDelay = `${-Math.random() * 10}s`;
      row.style.opacity = `${0.25 + Math.random() * 0.5}`;
      row.style.fontSize = `${12 + Math.random() * 6}px`;
      hexLayer.appendChild(row);
    }
  }

  function startAnimatedLayers() {
    stopAnimatedLayers();
    if (!REDUCED_MOTION) {
      drawBinaryRain();
    }
    metaTimerId = window.setInterval(() => {
      if (meta) {
        meta.textContent = createMixedMeta();
      }
    }, REDUCED_MOTION ? 1000 : 180);
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
  }

  function clearTransitionTimers() {
    transitionTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    transitionTimerIds = [];
  }

  function setProgress(value, nextMessage) {
    if (!fill || !percent || !message) return;
    fill.style.width = `${value}%`;
    percent.textContent = `${value}%`;
    message.textContent = nextMessage;
  }

  function isEligibleLink(anchor) {
    if (!anchor || !anchor.href) return false;
    if (anchor.hasAttribute('download')) return false;
    if (anchor.dataset.transitionIgnore === 'true') return false;
    if (anchor.target && anchor.target.toLowerCase() === '_blank') return false;

    const rawHref = anchor.getAttribute('href') || '';
    if (!rawHref || rawHref.startsWith('#')) return false;
    if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return false;

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.href === window.location.href) return false;
    if (url.pathname === window.location.pathname && url.hash) return false;

    return true;
  }

  function prefetchLink(anchor) {
    if (!isEligibleLink(anchor)) return;

    const url = new URL(anchor.href, window.location.href);
    if (prefetchState.has(url.href)) return;
    prefetchState.add(url.href);

    const prefetchTag = document.createElement('link');
    prefetchTag.rel = 'prefetch';
    prefetchTag.href = url.href;
    prefetchTag.as = 'document';
    document.head.appendChild(prefetchTag);

    if (/^https?:$/i.test(url.protocol)) {
      window.fetch(url.href, { credentials: 'same-origin' }).catch(() => {});
    }
  }

  function schedule(callback, delay) {
    transitionTimerIds.push(window.setTimeout(callback, delay));
  }

  function finishNavigation() {
    window.location.href = activeHref;
  }

  function beginTransition(href) {
    if (!href || isRunning) return false;

    activeHref = href;
    isRunning = true;
    clearTransitionTimers();
    document.body.classList.add('page-transition-lock');

    setProgress(0, messages.init);
    if (previewFrame) {
      previewFrame.src = href;
    }

    overlay.classList.remove('is-fading-out', 'is-revealing');
    overlay.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');

    schedule(() => setProgress(16, messages.ready), 500);
    schedule(() => setProgress(50, messages.sync), 1000);
    schedule(() => {
      setProgress(99, messages.final);
      overlay.classList.add('is-revealing', 'is-fading-out');
    }, 1500);
    schedule(finishNavigation, DURATION_MS);

    return true;
  }

  function handleDocumentClick(event) {
    const anchor = event.target.closest('a');
    if (!isEligibleLink(anchor)) return;

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    beginTransition(anchor.href);
  }

  function setupPrefetchHooks() {
    document.addEventListener('pointerover', (event) => {
      const anchor = event.target.closest('a');
      if (anchor) prefetchLink(anchor);
    });

    document.addEventListener('focusin', (event) => {
      const anchor = event.target.closest('a');
      if (anchor) prefetchLink(anchor);
    });

    document.addEventListener('touchstart', (event) => {
      const anchor = event.target.closest('a');
      if (anchor) prefetchLink(anchor);
    }, { passive: true });
  }

  function init() {
    createOverlay();
    document.addEventListener('click', handleDocumentClick);
    setupPrefetchHooks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.PresencePageTransition = {
    navigate(href) {
      return beginTransition(new URL(href, window.location.href).href);
    },
  };

  // TODO: 将来のキャラクター追加は `.page-transition-character` を使い、
  // ここにスプライトまたは連番画像の制御を追加する。
})();
