(function () {
  if (window.PresencePageTransition && typeof window.PresencePageTransition.navigate === "function") {
    return;
  }

  window.PresencePageTransition = {
    navigate(href) {
      if (!href) return false;
      window.location.href = href;
      return true;
    },
  };
})();
