/* Hero photo grows from a framed card to full-bleed while scrolling (Michael Page pattern),
   then a dark veil fades in and the brand-voice statement appears word by word. */
window.HH = window.HH || {};

HH.heroExpand = function () {
  const sec = document.querySelector('[data-hero-media]');
  if (!sec) return;

  const frame = sec.querySelector('[data-media-frame]');
  const img = sec.querySelector('[data-media-img]');
  const veil = sec.querySelector('[data-media-veil]');
  const words = sec.querySelectorAll('[data-media-statement] span');
  const gutter = () => Math.max(16, (innerWidth / 1512) * 20);

  gsap
    .timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      frame,
      { clipPath: () => `inset(6% ${gutter()}px 6% ${gutter()}px round 16px)` },
      { clipPath: 'inset(0% 0px 0% 0px round 0px)', ease: 'none', duration: 1 }
    )
    .fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'none', duration: 1 }, 0)
    .to(veil, { opacity: 1, ease: 'none', duration: 0.4 }, 0.7)
    .fromTo(
      words,
      { opacity: 0, yPercent: 60 },
      { opacity: 1, yPercent: 0, stagger: 0.15, duration: 0.4, ease: 'power3.out' },
      0.9
    )
    .to({}, { duration: 0.3 });
};
