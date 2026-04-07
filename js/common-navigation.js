document.addEventListener('DOMContentLoaded', () => {
  const scrollArea = document.querySelector('.slide-body');

  if (!scrollArea) {
    return;
  }

  const prevLink = document.querySelector('.pager-link.is-secondary[href]');
  const nextLink = document.querySelector('.pager-link[href]:not(.is-secondary)');
  const swipeState = {
    startX: 0,
    startY: 0,
    active: false,
  };
  const edgeGuard = 28;

  const startSwipe = (clientX, clientY, target) => {
    if (document.body.classList.contains('has-modal')) {
      return;
    }

    if (target?.closest('a, button, input, textarea, select, label')) {
      return;
    }

    if (clientX <= edgeGuard || clientX >= window.innerWidth - edgeGuard) {
      return;
    }

    swipeState.startX = clientX;
    swipeState.startY = clientY;
    swipeState.active = true;
  };

  const endSwipe = (clientX, clientY) => {
    if (!swipeState.active) {
      return;
    }

    swipeState.active = false;

    const deltaX = clientX - swipeState.startX;
    const deltaY = clientY - swipeState.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < 96 || absX <= absY * 1.35) {
      return;
    }

    const destination = deltaX < 0 ? nextLink?.getAttribute('href') : prevLink?.getAttribute('href');

    if (destination) {
      window.location.href = destination;
    }
  };

  scrollArea.addEventListener(
    'touchstart',
    (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      startSwipe(touch.clientX, touch.clientY, event.target);
    },
    { passive: true }
  );

  scrollArea.addEventListener(
    'touchend',
    (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      endSwipe(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  scrollArea.addEventListener(
    'touchcancel',
    () => {
      swipeState.active = false;
    },
    { passive: true }
  );
});
