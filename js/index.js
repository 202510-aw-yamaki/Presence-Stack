document.addEventListener('DOMContentLoaded', () => {
  const scrollArea = document.querySelector('.slide-body');

  if (!scrollArea) {
    return;
  }

  const syncScrolledState = () => {
    document.body.classList.toggle('is-scrolled', scrollArea.scrollTop > 8);
  };

  scrollArea.addEventListener('scroll', syncScrolledState, { passive: true });
  syncScrolledState();
});
