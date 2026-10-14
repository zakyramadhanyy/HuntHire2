/* "Why" cards stay sticky; each one shrinks and dims as the next slides over it.
   Photos inside cards (and any [data-parallax] image) drift for depth. */
window.HH = window.HH || {};

HH.stackCards = function () {
  const cards = gsap.utils.toArray('[data-card]');
  const header = document.querySelector('[data-header]');

  cards.forEach((card, i) => {
    const shade = document.createElement('div');
    shade.className = 'card__shade';
    card.appendChild(shade);

    const next = cards[i + 1];
    if (!next) return;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',
          end: () => `top ${header.offsetHeight + 12}px`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .to(card, { scale: 0.92, ease: 'none' }, 0)
      .to(shade, { opacity: 0.35, ease: 'none' }, 0);
  });

  gsap.utils.toArray('[data-parallax]').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: 0 },
      {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
};
