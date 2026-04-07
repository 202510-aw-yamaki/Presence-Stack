document.addEventListener('DOMContentLoaded', () => {
  const scrollArea = document.querySelector('.slide-body');

  if (scrollArea) {
    const syncScrolledState = () => {
      document.body.classList.toggle('is-scrolled', scrollArea.scrollTop > 8);
    };

    scrollArea.addEventListener('scroll', syncScrolledState, { passive: true });
    syncScrolledState();
  }

  const modals = document.querySelectorAll('.section-modal');

  const setStep = (modal, stepIndex) => {
    const panels = Array.from(modal.querySelectorAll('.modal-panel'));
    const prevButton = modal.querySelector('[data-modal-prev]');
    const nextButton = modal.querySelector('[data-modal-next]');
    const progress = modal.querySelector('[data-modal-progress]');

    panels.forEach((panel, index) => {
      const isActive = index === stepIndex;
      panel.classList.toggle('is-active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });

    if (prevButton) prevButton.disabled = stepIndex === 0;
    if (nextButton) nextButton.disabled = stepIndex === panels.length - 1;
    if (progress) progress.textContent = `${stepIndex + 1} / ${panels.length}`;
    modal.dataset.step = String(stepIndex);
  };

  const openModal = (modal, stepIndex = 0) => {
    if (!modal) return;
    setStep(modal, stepIndex);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-modal');
    const closeButton = modal.querySelector('[data-modal-close]');
    if (closeButton) closeButton.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.section-modal.is-open')) {
      document.body.classList.remove('has-modal');
    }
  };

  document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
    const handleOpen = (stepIndex = 0) => {
      const selector = trigger.getAttribute('data-modal-target');
      const modal = selector ? document.querySelector(selector) : null;
      openModal(modal, stepIndex);
    };

    trigger.addEventListener('click', (event) => {
      const stepTarget = event.target.closest('[data-modal-step]');
      const stepIndex = Number(stepTarget?.getAttribute('data-modal-step') || 0);
      handleOpen(stepIndex);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleOpen(0);
      }
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.hasAttribute('data-modal-close')) {
        closeModal(modal);
      }
    });

    const prevButton = modal.querySelector('[data-modal-prev]');
    const nextButton = modal.querySelector('[data-modal-next]');

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        const step = Number(modal.dataset.step || 0);
        setStep(modal, Math.max(0, step - 1));
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        const step = Number(modal.dataset.step || 0);
        const lastIndex = modal.querySelectorAll('.modal-panel').length - 1;
        setStep(modal, Math.min(lastIndex, step + 1));
      });
    }
  });

  document.addEventListener('keydown', (event) => {
    const openModalElement = document.querySelector('.section-modal.is-open');
    if (!openModalElement) return;

    if (event.key === 'Escape') {
      closeModal(openModalElement);
    }

    if (event.key === 'ArrowRight') {
      const step = Number(openModalElement.dataset.step || 0);
      const lastIndex = openModalElement.querySelectorAll('.modal-panel').length - 1;
      setStep(openModalElement, Math.min(lastIndex, step + 1));
    }

    if (event.key === 'ArrowLeft') {
      const step = Number(openModalElement.dataset.step || 0);
      setStep(openModalElement, Math.max(0, step - 1));
    }
  });
});
