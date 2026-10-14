/* Boot order: render content → smooth scroll → motion modules → preloader → hero intro. */
(function () {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const libsOk = window.gsap && window.ScrollTrigger && window.SplitText;

  HH.renderConsultants();
  HH.renderNews();

  // Reduced motion or a failed CDN: show everything statically
  if (reduced || !libsOk) {
    root.classList.remove('js-motion', 'is-loading');
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    HH.lenis = lenis;
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);

  fontsReady
    .then(() => {
      HH.colorShift();
      HH.splitLines();
      HH.scrubText();
      HH.heroExpand();
      HH.stackCards();
      HH.ctaPuzzle();
      HH.sections.init(lenis);
      HH.magnetic();
      return HH.preloader();
    })
    .then(() => {
      root.classList.remove('is-loading');
      if (lenis) lenis.start();
      HH.heroIntro();
      ScrollTrigger.refresh();
    });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
