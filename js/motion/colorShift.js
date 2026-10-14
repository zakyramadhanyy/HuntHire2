/* Page background flows between brand colours as sections take over the viewport
   (Michael Page pattern, HuntHire palette). */
window.HH = window.HH || {};

HH.themes = {
  light: { bg: '#FDFFFE', fg: '#090F06' },
  mint: { bg: '#C6EBD4', fg: '#090F06' },
  slate: { bg: '#2B484E', fg: '#FDFFFE' },
  lime: { bg: '#C1FF04', fg: '#090F06' },
};

HH.colorShift = function () {
  const apply = (name) => {
    const t = HH.themes[name] || HH.themes.light;
    gsap.to(document.body, { '--bg': t.bg, '--fg': t.fg, duration: 0.8, ease: 'power2.out', overwrite: true });
  };

  document.querySelectorAll('[data-theme-section]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && apply(sec.dataset.themeSection),
    });
  });
};
