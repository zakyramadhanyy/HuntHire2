/* Headings rise line-by-line from behind a mask (live-site pattern).
   Hero lines are prepared here and played by HH.heroIntro after the preloader. */
window.HH = window.HH || {};

HH.splitLines = function () {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const inHero = !!el.closest('.hero');

    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });

        if (inHero) {
          if (HH.introDone) return;
          gsap.set(self.lines, { yPercent: 110 });
          HH.heroLines = self.lines;
          return;
        }

        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
};
