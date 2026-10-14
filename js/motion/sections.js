/* Content rendering + per-section motion that doesn't warrant its own module. */
window.HH = window.HH || {};

const fine = () => matchMedia('(pointer: fine)').matches;

/* ── Rendering (runs with or without motion) ── */
HH.renderConsultants = function () {
  const list = document.querySelector('[data-consultant-list]');
  if (!list) return;

  list.innerHTML = HH.consultants
    .map(
      (p) => `
      <div class="swiper-slide">
        <article class="person">
          <div class="person__photo"><img src="${p.photo}" alt="${p.name}" loading="lazy" /></div>
          <h4 class="person__name">${p.name}</h4>
          <p class="person__role">${p.role}</p>
          <div class="person__links">
            <a href="mailto:recruitment@hunthire.id">Email</a>
            <a href="https://www.linkedin.com/company/hunthire/">LinkedIn</a>
          </div>
        </article>
      </div>`
    )
    .join('');

  document.querySelector('[data-total]').textContent = HH.consultants.length;
  if (!window.Swiper) return;

  const current = document.querySelector('[data-current]');
  new Swiper('[data-consultants]', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    speed: 800,
    navigation: { prevEl: '[data-prev]', nextEl: '[data-next]' },
    on: { slideChange: (s) => (current.textContent = s.activeIndex + 1) },
  });
};

HH.renderNews = function () {
  const list = document.querySelector('[data-news-list]');
  if (!list) return;

  list.innerHTML = HH.news
    .map(
      (n) => `
      <a class="post" href="https://hunthire.id/news">
        <div class="post__media"><img src="${n.photo}" alt="" loading="lazy" /><span class="post__tag">${n.tag}</span></div>
        <h4 class="post__title">${n.title}</h4>
        <p class="post__excerpt">${n.excerpt}</p>
        <span class="post__more">Read More <i><svg><use href="#arrow" /></svg></i></span>
      </a>`
    )
    .join('');
};

/* ── Hero intro (after preloader) ── */
HH.heroIntro = function () {
  HH.introDone = true;
  const tl = gsap.timeline();

  tl.from('[data-header]', { yPercent: -100, duration: 1, ease: 'expo.out', clearProps: 'transform' }, 0);
  if (HH.heroLines) tl.to(HH.heroLines, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 }, 0.1);
  tl.fromTo('.hero [data-fade]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1 }, 0.5);
  tl.from('.hero .shape', { scale: 0, duration: 1.2, ease: 'back.out(2)', stagger: 0.06 }, 0.3);
};

/* ── Scroll motion ── */
HH.sections = {
  init(lenis) {
    this.header(lenis);
    this.progress();
    this.fades();
    this.floatShapes();
    this.marquee();
    this.industryList();
    this.service();
    this.consultants();
    this.news();
  },

  header(lenis) {
    const header = document.querySelector('[data-header]');
    let last = 0;
    const onScroll = (y) => {
      header.classList.toggle('is-hidden', y > last && y > 200);
      last = y;
    };
    if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
    else addEventListener('scroll', () => onScroll(scrollY), { passive: true });
  },

  progress() {
    gsap.to('[data-progress]', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
  },

  fades() {
    gsap.utils.toArray('[data-fade]').forEach((el) => {
      if (el.closest('.hero')) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
      );
    });
  },

  // Puzzle shapes drift idly, follow the cursor by depth, and lift away on scroll
  floatShapes() {
    const wrap = document.querySelector('[data-float-shapes]');
    if (!wrap) return;
    const shapes = gsap.utils.toArray(wrap.children);

    shapes.forEach((s) => {
      gsap.to(s, {
        yPercent: 'random(-60, 60)',
        rotation: 'random(-25, 25)',
        duration: 'random(3, 5)',
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    gsap.to(wrap, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    if (!fine()) return;
    const movers = shapes.map((s) => ({
      depth: parseFloat(s.dataset.depth) || 1,
      x: gsap.quickTo(s, 'x', { duration: 1, ease: 'power3.out' }),
      y: gsap.quickTo(s, 'y', { duration: 1, ease: 'power3.out' }),
    }));
    addEventListener('pointermove', (e) => {
      const dx = e.clientX / innerWidth - 0.5;
      const dy = e.clientY / innerHeight - 0.5;
      movers.forEach((m) => {
        m.x(dx * 70 * m.depth);
        m.y(dy * 70 * m.depth);
      });
    });
  },

  // Endless industry ticker that speeds up with scroll velocity
  marquee() {
    const track = document.querySelector('[data-marquee] .marquee__track');
    if (!track) return;
    track.innerHTML += track.innerHTML;

    const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 });
    ScrollTrigger.create({
      trigger: '.industry',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 200, 6);
        gsap.to(loop, {
          timeScale: boost,
          duration: 0.25,
          overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: 1, duration: 1.2 }),
        });
      },
    });
  },

  // Underlines draw left → right, items rise in sequence
  industryList() {
    const items = gsap.utils.toArray('.industry__list li');
    gsap.fromTo(
      items,
      { '--line': 0, opacity: 0, y: 24 },
      {
        '--line': 1,
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '.industry__list', start: 'top 85%', once: true },
      }
    );
  },

  // Giant sticky title gets covered by the photo rising and growing over it
  service() {
    const title = document.querySelector('[data-service-title]');
    const media = document.querySelector('[data-service-media]');
    if (!title || !media) return;

    SplitText.create(title, {
      type: 'lines,chars',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.025,
          scrollTrigger: { trigger: '[data-service-stage]', start: 'top 70%', once: true },
        }),
    });

    gsap.fromTo(
      media,
      { scale: 0.6, borderRadius: 48 },
      { scale: 1, borderRadius: 16, ease: 'none', scrollTrigger: { trigger: media, start: 'top bottom', end: 'top 20%', scrub: true } }
    );
    gsap.to(title, {
      scale: 0.85,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: media, start: 'top 70%', end: 'top 10%', scrub: true },
    });

    gsap.from('.service-row', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.service__list', start: 'top 85%', once: true },
    });
  },

  // Cards slide in; a lime "Drag" bubble follows the cursor over the carousel
  consultants() {
    gsap.from('.consultants .swiper-slide', {
      x: 120,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '.consultants__slider', start: 'top 85%', once: true },
    });

    const cursor = document.querySelector('[data-drag-cursor]');
    const slider = document.querySelector('[data-consultants]');
    if (!cursor || !slider || !fine()) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
    addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    slider.addEventListener('pointerenter', () => gsap.to(cursor, { scale: 1, duration: 0.5, ease: 'expo.out' }));
    slider.addEventListener('pointerleave', () => gsap.to(cursor, { scale: 0, duration: 0.4, ease: 'expo.out' }));
    slider.addEventListener('pointerdown', () => gsap.to(cursor, { scale: 0.8, duration: 0.3 }));
    slider.addEventListener('pointerup', () => gsap.to(cursor, { scale: 1, duration: 0.3 }));
  },

  // Cards rise; photos unveil from the bottom
  news() {
    const posts = gsap.utils.toArray('.post');
    const trigger = { trigger: '.news__grid', start: 'top 85%', once: true };
    gsap.from(posts, { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: trigger });
    gsap.fromTo(
      posts.map((p) => p.querySelector('.post__media')),
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out', stagger: 0.1, scrollTrigger: { ...trigger } }
    );
  },
};
