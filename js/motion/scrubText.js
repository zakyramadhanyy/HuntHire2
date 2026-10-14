/* Paragraph turns from grey to ink word-by-word as it scrolls through (live-site pattern). */
window.HH = window.HH || {};

HH.scrubText = function () {
  document.querySelectorAll('[data-scrub-text]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      wordsClass: 'word',
      autoSplit: true,
      onSplit(self) {
        return gsap.to(self.words, {
          color: getComputedStyle(el).color,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
        });
      },
    });
  });
};
