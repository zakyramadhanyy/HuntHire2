/* The Puzzle mark assembling itself — "Makes the Perfect Connection" (brand guideline p.35).
   Used by the preloader (timed) and the closing CTA (scroll-scrubbed). */
window.HH = window.HH || {};

// [x, y, rotation] offsets in SVG units, one per piece (sq, circle, bar, circle, sq)
const SCATTER = [
  [-260, -180, -120],
  [240, -200, 140],
  [-320, 40, 90],
  [-200, 220, -160],
  [280, 200, 200],
];

HH.preloader = function () {
  return new Promise((resolve) => {
    const el = document.querySelector('[data-preloader]');
    if (!el) return resolve();

    const pieces = el.querySelectorAll('.pz');
    const word = el.querySelector('.preloader__word');
    const count = el.querySelector('[data-count]');
    const counter = { v: 0 };

    gsap
      .timeline({ onComplete: () => el.remove() })
      .from(
        pieces,
        {
          x: (i) => SCATTER[i][0],
          y: (i) => SCATTER[i][1],
          rotation: (i) => SCATTER[i][2],
          scale: 0,
          opacity: 0,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.08,
        },
        0
      )
      .to(counter, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => (count.textContent = Math.round(counter.v)) }, 0)
      .fromTo(word, { clipPath: 'inset(0% 100% 0% 0%)', x: -20 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 1, ease: 'expo.out' }, 0.7)
      .to(pieces, { fill: '#29A869', duration: 0.4, stagger: 0.05 }, 1.5)
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, 2.1)
      .call(resolve, null, 2.4);
  });
};

HH.ctaPuzzle = function () {
  const sec = document.querySelector('[data-cta]');
  if (!sec) return;

  gsap.fromTo(
    sec.querySelectorAll('.cp'),
    {
      x: (i) => SCATTER[i][0] * 0.7,
      y: (i) => SCATTER[i][1] * 0.7,
      rotation: (i) => SCATTER[i][2] * 0.5,
      scale: 0.6,
    },
    {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      ease: 'none',
      stagger: 0.05,
      scrollTrigger: { trigger: sec, start: 'top 85%', end: 'center 60%', scrub: 1 },
    }
  );
};
