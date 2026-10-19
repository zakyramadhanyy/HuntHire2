/* HuntHire — Opsi B "Puzzle Studio".
   Every interaction is built from the five pieces of the HuntHire Puzzle mark.
   Motion language: calm expo easing (after Fleava), clear orientation and trust cues (after Egon Zehnder).
   The logo itself is never scattered, rotated or recoloured (Brand Guidelines, Logo Do-nots). */
(function () {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const hasGsap = window.gsap && window.ScrollTrigger && window.SplitText && window.Draggable;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  let lenis = null;

  /* ───────── Content ───────── */
  function render() {
    $('[data-hunter-grid]').innerHTML = HH.consultants
      .map(
        (p, i) => `
        <article class="hunter hunter--${(i + Math.floor(i / 4)) % 2 ? 'ci' : 'sq'}" data-cursor-text="View">
          <div class="hunter__mask"><img src="${p.photo}" alt="${p.name}" loading="lazy" /></div>
          <h4>${p.name}</h4>
          <p>${p.role}</p>
          <div class="hunter__links"><a href="mailto:recruitment@hunthire.id" class="uline">Email</a><a href="https://www.linkedin.com/company/hunthire/" class="uline">LinkedIn</a></div>
        </article>`
      )
      .join('');

    // Each row fills the width: number + category | title | summary | arrow
    $('[data-insight-list]').innerHTML = HH.news
      .map(
        (n, i) => `
        <li class="insight">
          <a href="https://hunthire.id/news" data-img="${n.photo}">
            <span class="insight__meta"><span class="insight__num">${String(i + 1).padStart(2, '0')}</span><span class="insight__tag">${n.tag}</span></span>
            <span class="insight__title">${n.title}</span>
            <span class="insight__excerpt">${n.excerpt}</span>
            <span class="insight__arrow"><svg><use href="#arrow" /></svg></span>
          </a>
        </li>`
      )
      .join('');
  }

  /* ───────── Industries: same five pieces, a new picture per industry ─────────
     Every picture uses the logo's own grid so they stay consistent: two columns and three rows
     inside a 240×240 box, the bar always lies flat across one full row, the other four pieces
     fill the remaining two rows, and gaps match the logo (≈20 units). No rotation, nothing
     touches the edges, and the composition is always centred like the logo itself. */
  // Pieces align to the outer edges exactly like the Puzzle mark: left column flush left (x 42),
  // right column flush right (x 198), top row flush top, bottom row flush bottom, middle row centred.
  const SIZE = [[66, 66], [70, 70], [156, 68], [70, 70], [66, 66]]; // sq, ci, bar, ci, sq
  const BAR_ROW = { t: 0, m: 1, b: 2 };
  const xAt = (col, w) => (col === 'L' ? 42 : 198 - w);
  const yAt = (row, h) => [0, 120 - h / 2, 240 - h][row];
  // picture(bar row, cell of sq0, ci1, ci3, sq4) — "a"/"b" = upper/lower free row, L/R = column
  const picture = (bar, sq0, ci1, ci3, sq4) => {
    const free = [0, 1, 2].filter((r) => r !== BAR_ROW[bar]);
    const place = (cell, i) => [xAt(cell[1], SIZE[i][0]), yAt(free[cell[0] === 'a' ? 0 : 1], SIZE[i][1])];
    return [place(sq0, 0), place(ci1, 1), [42, yAt(BAR_ROW[bar], 68)], place(ci3, 3), place(sq4, 4)];
  };
  const LOGO = picture('m', 'aL', 'aR', 'bL', 'bR');
  const LAYOUTS = [
    picture('b', 'aL', 'aR', 'bL', 'bR'), // FMCG — goods resting on a shelf
    picture('m', 'bL', 'aL', 'aR', 'bR'), // FSI — a balance: circles above the beam, squares below
    picture('t', 'aL', 'bL', 'bR', 'aR'), // Manufacturers — a roof over two floors
    picture('b', 'aR', 'aL', 'bR', 'bL'), // Digital Banks
    picture('t', 'aR', 'aL', 'bR', 'bL'), // Financial Tech
    picture('m', 'aR', 'aL', 'bR', 'bL'), // Telco
    picture('b', 'bL', 'aL', 'aR', 'bR'), // Renewable Energy — two suns above the horizon
    picture('t', 'aL', 'aR', 'bL', 'bR'), // Pharmaceutical
    picture('m', 'aL', 'bL', 'bR', 'aR'), // Health
    picture('b', 'aL', 'aR', 'bR', 'bL'), // Tobacco
  ];

  function industries() {
    const box = $('[data-arrange]');
    const parts = $$('.ar', box);
    const items = $$('[data-industry-list] li');
    const caption = $('[data-arrange-caption]');
    const defaultCaption = caption.textContent;

    const arrange = (layout, accent, instant) => {
      const k = box.offsetWidth / 240;
      parts.forEach((el, i) => {
        gsap[instant ? 'set' : 'to'](el, {
          x: layout[i][0] * k,
          y: layout[i][1] * k,
          rotation: 0,
          backgroundColor: i === accent ? '#C1FF04' : '#29A869',
          duration: reduced || instant ? 0 : 0.85,
          delay: reduced || instant ? 0 : i * 0.04,
          ease: 'power3.inOut',
          overwrite: 'auto',
        });
      });
    };

    const activate = (idx) => {
      items.forEach((li, i) => li.classList.toggle('is-active', i === idx));
      if (idx < 0) {
        arrange(LOGO, -1);
        caption.textContent = defaultCaption;
      } else {
        arrange(LAYOUTS[idx], idx % 5);
        caption.textContent = `${$('.row__t', items[idx]).textContent}: same pieces, new picture.`;
      }
    };

    arrange(LOGO, -1, true);
    addEventListener('resize', () => activate(items.findIndex((li) => li.classList.contains('is-active'))));

    if (fine) {
      items.forEach((li, i) => li.addEventListener('pointerenter', () => activate(i)));
      $('[data-industry-list]').addEventListener('pointerleave', () => activate(-1));
    } else {
      items.forEach((li, i) =>
        ScrollTrigger.create({ trigger: li, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && activate(i) })
      );
    }
  }

  /* ───────── Menu: five panels wipe like puzzle columns ───────── */
  function menu() {
    const btn = $('[data-menu-btn]');
    const nav = $('[data-menu]');
    const label = $('[data-menu-text]');
    const links = $$('.menu__link', nav);
    links.forEach((a) => (a.innerHTML = `<span>${a.innerHTML}</span>`));

    const tl = gsap
      .timeline({ paused: true, onReverseComplete: () => nav.classList.remove('is-open') })
      .to($$('.menu__panels i', nav), { scaleY: 1, duration: 0.9, ease: 'expo.inOut', stagger: { each: 0.05, from: 'center' } })
      .from($$('.menu__link span', nav), { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.035 }, '-=0.3')
      .from($$('.menu__label, .menu__foot', nav), { opacity: 0, y: 10, duration: 0.5 }, '<');

    let open = false;
    const toggle = (state = !open) => {
      open = state;
      btn.setAttribute('aria-expanded', open);
      nav.setAttribute('aria-hidden', !open);
      label.textContent = open ? 'Close' : 'Menu';
      document.body.classList.toggle('menu-open', open);
      $('[data-header]').classList.remove('is-hidden');
      if (open) {
        nav.classList.add('is-open');
        tl.timeScale(1).play();
        lenis && lenis.stop();
      } else {
        tl.timeScale(1.4).reverse();
        lenis && lenis.start();
      }
    };

    btn.addEventListener('click', () => toggle());
    links.forEach((a) => a.addEventListener('click', () => open && toggle(false)));
    addEventListener('keydown', (e) => e.key === 'Escape' && open && toggle(false));
  }

  /* ───────── 1. On boarding: the Master Piece builds up behind the wordmark while the counter runs, then the screen lifts ───────── */
  function intro() {
    return new Promise((resolve) => {
      const el = $('[data-intro]');
      const pattern = $('[data-intro-pattern]');
      // Reuse the statement section's Master Piece shapes instead of shipping the artwork twice
      pattern.innerHTML = $('[data-masterpiece]').innerHTML;
      const shapes = $$('.mp', pattern);
      // The statement's scroll animation has already put its own start state on the originals; start the clones clean
      gsap.set(shapes, { clearProps: 'transform,opacity,translate,rotate,scale' });
      const countEl = $('[data-intro-count]', el);
      const word = $('[data-intro-word]', el);
      const count = { v: 0 };
      const LOAD = 2.2;

      gsap
        .timeline({ onComplete: () => { el.remove(); resolve(); } })
        .to(count, { v: 100, duration: LOAD, ease: 'power2.inOut', onUpdate: () => (countEl.textContent = Math.round(count.v)) }, 0)
        .fromTo(word, { clipPath: 'inset(0% 100% 0% 0%)', x: -12 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 1, ease: 'expo.out' }, 0.15)
        .from(shapes, { opacity: 0, scale: 0.85, y: 24, duration: 0.9, ease: 'expo.out', stagger: { each: (LOAD - 0.9) / shapes.length, from: 'random' } }, 0)
        .to([word, countEl], { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in' }, '+=0.25')
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, '-=0.15');
    });
  }

  /* ───────── Split lines ───────── */
  const heroLines = [];
  function lines() {
    $$('[data-lines]').forEach((el) => {
      const inHero = !!el.closest('.hero');
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: 'visible' });
          if (inHero) {
            if (!root.classList.contains('intro-done')) {
              gsap.set(self.lines, { yPercent: 110 });
              heroLines.push(...self.lines);
            }
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
  }

  /* ───────── 2. Hero banner (ref-fleava): photo slider with Prev / Next and an autoplay bar ───────── */
  function heroSlider() {
    const slides = $$('.slide');
    const texts = $$('.htext');
    const bar = $('[data-hero-bar]');
    const DURATION = 6500;
    let i = 0;
    let t0 = performance.now();
    const show = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      texts.forEach((t, k) => t.classList.toggle('is-active', k === i));
      t0 = performance.now();
    };
    $('[data-next]').addEventListener('click', () => show(i + 1));
    $('[data-prev]').addEventListener('click', () => show(i - 1));
    addEventListener('keydown', (e) => {
      if (scrollY > innerHeight * 0.5 || document.body.classList.contains('menu-open')) return;
      if (e.key === 'ArrowRight') show(i + 1);
      if (e.key === 'ArrowLeft') show(i - 1);
    });
    // The first headline waits for the on-boarding to finish before its lines rise
    texts[0].classList.remove('is-active');
    const start = () => {
      show(0);
      if (reduced || !hasGsap) return;
      gsap.ticker.add(() => {
        const progress = (performance.now() - t0) / DURATION;
        bar.style.transform = `scaleX(${Math.min(1, progress)})`;
        if (progress >= 1 && scrollY < innerHeight) show(i + 1); // pause while the hero is covered
      });
    };
    return { start };
  }

  /* ───────── 3. Every great team is a puzzle: the statement fills in as the Master Piece assembles ───────── */
  function statement() {
    const sec = $('[data-statement]');
    const words = SplitText.create($('[data-statement-text]'), { type: 'words', wordsClass: 'word' }).words;
    const shapes = $$('.mp', sec);
    const scatter = shapes.map((_, i) => {
      const a = i * 2.39996; // golden-angle spread so no two shapes share a direction
      const r = 420 + (i % 4) * 90;
      return [Math.cos(a) * r, Math.sin(a) * r * 0.7, ((i * 37) % 70) - 35];
    });
    gsap
      .timeline({ scrollTrigger: { trigger: sec, start: 'top 60%', end: 'bottom bottom', scrub: 0.7 } })
      .from(shapes, {
        x: (i) => scatter[i][0],
        y: (i) => scatter[i][1],
        rotation: (i) => scatter[i][2],
        scale: 0.6,
        opacity: 0,
        ease: 'power3.out',
        duration: 0.9,
        stagger: { each: 0.035, from: 'random' },
      }, 0)
      .to(words, { color: '#090F06', stagger: 0.08, duration: 0.3, ease: 'none' }, 0.35);
  }

  /* ───────── 4–5. The firm & Expertise (ref-fleava): inset photo opens to full bleed, copy dims as it leaves ───────── */
  function firm() {
    const sec = $('[data-firm]');
    gsap.fromTo('[data-firm-media]', { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 10%', scrub: true } });
    gsap.fromTo('[data-firm-img]', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    $$('[data-fade-out]').forEach((el) =>
      gsap.to(el, { opacity: 0.1, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'bottom 75%', end: 'bottom 15%', scrub: true } })
    );
    // Hero copy drifts up and fades while the next section slides over the hero
    gsap.to('[data-hero-content]', { y: -120, opacity: 0, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
  }

  function heroIntro() {
    root.classList.add('intro-done');
    slider.start();
    gsap
      .timeline()
      .from('[data-header] > *', { y: -80, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0)
      .from('.hero__ctrl, .hero__scroll', { opacity: 0, y: 20, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.4);
  }

  /* ───────── Approach: horizontal scroll ───────── */
  function approach() {
    const sec = $('[data-approach]');
    const track = $('[data-approach-track]');
    const steps = $$('.step', track);
    const marks = $$('.ap', sec);
    const num = $('[data-approach-num]');
    const distance = () => track.scrollWidth - innerWidth;

    const scroll = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: sec,
        pin: true,
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          marks.forEach((m, i) => m.classList.toggle('is-on', i <= idx));
          num.textContent = String(idx + 1).padStart(2, '0');
        },
      },
    });

    steps.forEach((step) => {
      const st = { trigger: step, containerAnimation: scroll, start: 'left right', end: 'center center', scrub: true };
      gsap.fromTo($('.step__shape', step), { rotation: -30, scale: 0.4, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: st });
      gsap.from($$('.step__num, h3, p', step), { y: 60, opacity: 0, stagger: 0.1, ease: 'none', scrollTrigger: { ...st, end: 'left 40%' } });
    });
  }

  /* ───────── Cursor (a piece that changes shape) ───────── */
  function cursor() {
    if (!fine) return;
    const c = $('[data-cursor]');
    const label = $('[data-cursor-label]');
    const xTo = gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3.out' });
    addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    addEventListener('pointerdown', () => c.classList.add('is-down'));
    addEventListener('pointerup', () => c.classList.remove('is-down'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target;
      // Priority: draggable piece → named card ("View", "Read"…) → any other link or button
      const drag = t.closest('[data-piece]:not(.is-placed), .fd');
      const named = !drag && !t.closest('.hunter__links') && t.closest('[data-cursor-text]');
      const link = !drag && !named && !t.closest('.insight') && t.closest('a, button');
      // Labelled disc; white where the background is already Lime (hero "For companies" panel)
      c.classList.toggle('is-white', !!named && named.dataset.cursorTone === 'white');
      c.classList.toggle('is-drag', !!drag);
      c.classList.toggle('is-label', !!named);
      c.classList.toggle('is-link', !!link);
      label.textContent = drag ? 'Drag' : named ? named.dataset.cursorText : '';
    });
    document.addEventListener('pointerleave', () => c.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => c.classList.remove('is-hidden'));
  }

  function magnetic() {
    if (!fine) return;
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.18);
        yTo((e.clientY - r.top - r.height / 2) * 0.22);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }


  /* ───────── Insights: shape-masked preview follows the cursor ───────── */
  function insights() {
    if (!fine) return;
    const list = $('[data-insight-list]');
    const prev = $('[data-preview]');
    const img = $('[data-preview-img]');
    // The preview trails the cursor down and to the right, so the title under the pointer stays readable
    const xTo = gsap.quickTo(prev, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(prev, 'y', { duration: 0.6, ease: 'power3.out' });
    let open = false;

    list.addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    const hide = () => {
      open = false;
      gsap.to(prev, { clipPath: 'inset(0% 0% 100% 0% round 12px)', duration: 0.5, ease: 'expo.out' });
    };
    $$('a', list).forEach((a) =>
      a.addEventListener('pointerenter', (e) => {
        if (!open) gsap.set(prev, { x: e.clientX, y: e.clientY });
        open = true;
        img.src = a.dataset.img;
        gsap.to(prev, { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 0.7, ease: 'expo.out' });
        // Black & white first, then it blooms into colour
        gsap.set(img, { filter: 'grayscale(1)' });
        gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 0.8, ease: 'expo.out' });
        gsap.to(img, { filter: 'grayscale(0)', duration: 1.2, delay: 0.25, ease: 'power2.out' });
      })
    );
    list.addEventListener('pointerleave', hide);
    addEventListener('wheel', hide, { passive: true });
  }

  /* ───────── CTA field: pieces swell and turn near the cursor ───────── */
  function field() {
    const sec = $('[data-cta]');
    const box = $('[data-field]');
    let dots = [];

    const build = () => {
      box.innerHTML = '';
      const gap = innerWidth < 640 ? 40 : 56;
      const cols = Math.ceil(sec.offsetWidth / gap);
      const rows = Math.ceil(sec.offsetHeight / gap);
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const el = document.createElement('i');
          if ((r + c) % 2) el.className = 'c';
          const x = c * gap + gap / 2;
          const y = r * gap + gap / 2;
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          box.appendChild(el);
          dots.push({
            x, y,
            s: gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power3.out' }),
            o: gsap.quickTo(el, 'opacity', { duration: 0.5, ease: 'power3.out' }),
            rot: gsap.quickTo(el, 'rotation', { duration: 0.6, ease: 'power3.out' }),
          });
        }
      }
      if (!fine) {
        gsap.to(box.children, { scale: 1.35, opacity: 0.22, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { grid: [rows, cols], from: 'center', each: 0.08 } });
      }
    };

    build();
    let t;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 200); });
    if (!fine) return;

    let raf = 0;
    sec.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = sec.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        dots.forEach((d) => {
          const f = Math.max(0, 1 - Math.hypot(d.x - mx, d.y - my) / 200);
          d.s(1 + f * 2.4);
          d.o(0.12 + f * 0.88);
          d.rot(f * 90);
        });
      });
    });
    sec.addEventListener('pointerleave', () => dots.forEach((d) => { d.s(1); d.o(0.12); d.rot(0); }));
  }

  /* ───────── Footer: 15 Puzzle pieces with real physics (Matter.js) ─────────
     The pieces drop into a tidy arrangement on top of the wordmark:
       wide screens → one straight row;
       narrow screens → two stable tiers (bars and squares below, circles resting on the squares).
     Grab any piece and throw it: it keeps its momentum, spins, bounces, rolls and stacks. */
  const SET = ['sq', 'ci', 'bar', 'ci', 'sq'];
  const UNIT = { sq: [66, 66], ci: [70, 70], bar: [156, 68] }; // the Puzzle mark's own proportions

  function footer() {
    const drop = $('[data-drop]');
    const word = $('[data-footer-word]');

    // The wordmark rises as one block (per-letter staggering looked broken mid-way)
    gsap.from(word, { yPercent: 35, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 98%', once: true } });

    const types = Array.from({ length: 15 }, (_, i) => SET[i % SET.length]);
    drop.innerHTML = types.map((t) => `<i class="fd fd--${t}"></i>`).join('');
    const parts = $$('.fd', drop);
    const paint = (el, x, y, w, h, angle) => (el.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) rotate(${angle}rad)`);

    if (!window.Matter) {
      drop.classList.add('is-static');
      parts.forEach((el) => el.classList.add('is-live'));
      return;
    }

    // Work out a tidy resting place for every piece: [{ i, x, y, w, h, tier }]
    const plan = () => {
      const W = drop.clientWidth;
      const H = drop.clientHeight;
      const n = types.length;
      const rowUnits = types.reduce((a, t) => a + UNIT[t][0], 0);
      const gap = 12;
      const kRow = Math.min(0.86, (W * 0.96 - gap * (n - 1)) / rowUnits);
      const spots = [];
      if (kRow >= 0.5) {
        // One straight row, centred
        let x = (W - (rowUnits * kRow + gap * (n - 1))) / 2;
        types.forEach((t, i) => {
          const [w, h] = UNIT[t].map((v) => v * kRow);
          spots.push({ i, x: x + w / 2, y: H - h / 2, w, h, tier: 0, k: kRow });
          x += w + gap;
        });
        return { k: kRow, spots };
      }
      // Two tiers: rectangles on the floor (square · bar · square, three times), circles on the squares
      const rects = types.map((t, i) => ({ t, i })).filter((p) => p.t !== 'ci');
      const order = [...rects.filter((p) => p.t === 'sq'), ...rects.filter((p) => p.t === 'bar')];
      const bottom = [0, 1, 2].flatMap((g) => [order[g * 2], order[6 + g], order[g * 2 + 1]]); // sq bar sq ×3
      const g2 = 6;
      const bottomUnits = bottom.reduce((a, p) => a + UNIT[p.t][0], 0);
      const k = Math.min(0.6, (W * 0.97 - g2 * (bottom.length - 1)) / bottomUnits);
      let x = (W - (bottomUnits * k + g2 * (bottom.length - 1))) / 2;
      const squareTops = [];
      bottom.forEach((p) => {
        const [w, h] = UNIT[p.t].map((v) => v * k);
        spots.push({ i: p.i, x: x + w / 2, y: H - h / 2, w, h, tier: 0, k });
        if (p.t === 'sq') squareTops.push({ x: x + w / 2, top: H - h });
        x += w + g2;
      });
      const circles = types.map((t, i) => ({ t, i })).filter((p) => p.t === 'ci');
      circles.forEach((p, n2) => {
        const d = UNIT.ci[0] * k;
        const base = squareTops[n2];
        spots.push({ i: p.i, x: base.x, y: base.top - d / 2, w: d, h: d, tier: 1, k });
      });
      return { k, spots };
    };

    const { Engine, Bodies, Body, Composite, Constraint } = Matter;
    // No sleeping: a sleeping piece would hang in mid-air when the piece under it is pulled away
    const engine = Engine.create({ enableSleeping: false });
    engine.gravity.y = 1.15;
    const MATERIAL = { restitution: 0.32, friction: 0.4, frictionStatic: 0.8, frictionAir: 0.014, density: 0.0018 };
    let bodies = [];
    let lastWidth = 0;

    // (Re)build the stage. fromAbove: pieces fall in one after another; otherwise they start at rest.
    const build = (fromAbove) => {
      Composite.clear(engine.world, false);
      const W = drop.clientWidth;
      const H = drop.clientHeight;
      const T = 400;
      lastWidth = W;
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + T / 2, W + T * 2, T, { isStatic: true, friction: 0.7 }),
        Bodies.rectangle(-T / 2, H / 2, T, H * 3, { isStatic: true }),
        Bodies.rectangle(W + T / 2, H / 2, T, H * 3, { isStatic: true }),
        Bodies.rectangle(W / 2, -T / 2, W + T * 2, T, { isStatic: true }),
      ]);
      const { k, spots } = plan();
      drop.style.setProperty('--k', k.toFixed(4));
      bodies = [];
      spots
        .sort((a, b) => a.tier - b.tier || a.x - b.x)
        .forEach((s, n) => {
          const el = parts[s.i];
          const body = types[s.i] === 'ci'
            ? Bodies.circle(s.x, s.y, s.w / 2, MATERIAL)
            : Bodies.rectangle(s.x, s.y, s.w, s.h, { ...MATERIAL, chamfer: { radius: 1 } });
          body.el = el;
          body.size = [s.w, s.h];
          bodies[s.i] = body;
          if (!fromAbove) {
            Composite.add(engine.world, body);
            el.classList.add('is-live');
            paint(el, s.x, s.y, s.w, s.h, 0);
            return;
          }
          // Drop straight down above its spot: lower tier first, circles once the squares have landed
          el.classList.remove('is-live');
          setTimeout(() => {
            Body.setPosition(body, { x: s.x, y: s.h / 2 + 2 });
            Composite.add(engine.world, body);
            el.classList.add('is-live');
          }, s.tier * 700 + n * 45);
        });
    };

    // Drag & throw: a soft spring pulls the grabbed point toward the pointer
    let grab = null;
    const local = (e) => {
      const r = drop.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    parts.forEach((el, i) => {
      el.addEventListener('pointerdown', (e) => {
        const body = bodies[i];
        if (!body || !Composite.get(engine.world, body.id, 'body')) return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        const p = local(e);
        grab = {
          el,
          id: e.pointerId,
          c: Constraint.create({
            pointA: p,
            bodyB: body,
            pointB: { x: p.x - body.position.x, y: p.y - body.position.y },
            angleB: body.angle,
            stiffness: 0.16,
            damping: 0.12,
            length: 0,
          }),
        };
        Composite.add(engine.world, grab.c);
        el.classList.add('is-grabbed');
      });
      el.addEventListener('pointermove', (e) => grab && grab.id === e.pointerId && (grab.c.pointA = local(e)));
      const release = (e) => {
        if (!grab || grab.id !== e.pointerId) return;
        Composite.remove(engine.world, grab.c);
        grab.el.classList.remove('is-grabbed');
        grab = null;
      };
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      el.addEventListener('lostpointercapture', release);
    });

    // Step the simulation only while the footer is on screen
    let visible = false;
    let running = false;
    let dropped = false;
    let last = 0;
    const tick = (now) => {
      if (!visible) { running = false; return; }
      const dt = Math.min(1000 / 50, now - (last || now));
      last = now;
      Engine.update(engine, dt || 1000 / 60);
      bodies.forEach((b) => {
        if (!b) return;
        if (b.speed > 38) Body.setVelocity(b, { x: b.velocity.x * 0.9, y: b.velocity.y * 0.9 }); // no tunnelling
        paint(b.el, b.position.x, b.position.y, b.size[0], b.size[1], b.angle);
      });
      requestAnimationFrame(tick);
    };
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) return;
      if (!dropped) { dropped = true; build(true); }
      if (!running) { running = true; last = 0; requestAnimationFrame(tick); }
    }, { threshold: 0.2 }).observe(drop);

    // A real width change (rotation, window resize) re-tidies the pieces; mobile URL-bar jitter does not
    let t;
    addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => dropped && Math.abs(drop.clientWidth - lastWidth) > 30 && build(false), 200);
    });
  }

  /* ───────── Generic reveals ───────── */
  function reveals() {
    gsap.from('.hunter__mask', {
      clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', stagger: 0.07, clearProps: 'clipPath',
      scrollTrigger: { trigger: '[data-hunter-grid]', start: 'top 80%', once: true },
    });
    gsap.from('.hunter__mask img', { scale: 1.25, duration: 1.8, ease: 'expo.out', stagger: 0.07, clearProps: 'transform', scrollTrigger: { trigger: '[data-hunter-grid]', start: 'top 80%', once: true } });
    gsap.from('.hunter h4, .hunter p, .hunter__links', { y: 16, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.03, scrollTrigger: { trigger: '[data-hunter-grid]', start: 'top 75%', once: true } });
    // Supporting copy rises gently once its section is in view
    ScrollTrigger.batch('.eyebrow, [data-up]:not(.eyebrow), .industries__caption, .hunters__head .btn, .insights__head .link-arrow, .footer__col, .footer__bottom', {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.from(els, { y: 24, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06 }),
    });
    gsap.from('.insight', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '[data-insight-list]', start: 'top 85%', once: true } });
    // Rows and the expertise line arrive one item at a time
    $$('[data-stagger]').forEach((list) =>
      // Explicit end values, then hand opacity back to CSS (rows dim each other on hover)
      gsap.fromTo(list.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.06, clearProps: 'opacity,transform', scrollTrigger: { trigger: list, start: 'top 85%', once: true } })
    );
    // Reveal the box, not the pieces: the pieces' tweens belong to the industry hover and must not cancel this
    gsap.from('[data-arrange]', { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-arrange]', start: 'top 80%', once: true } });
  }

  /* ───────── On-site experience: orientation, progress, smooth hand-offs ───────── */
  function rollLabels() {
    // Buttons get a rolling label; aria stays on the original text
    $$('.btn, .chip').forEach((el) => {
      if (el.querySelector('.roll') || el.children.length) return;
      const t = el.textContent.trim();
      el.innerHTML = `<span class="roll"><span>${t}</span><span aria-hidden="true">${t}</span></span>`;
    });
  }

  function lazyFade() {
    $$('img[loading="lazy"]').forEach((img) => {
      const done = () => img.classList.add('is-loaded');
      img.complete && img.naturalWidth ? done() : img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  function experience() {
    const header = $('[data-header]');
    const crumb = $('[data-crumb]');
    const crumbText = $('[data-crumb-text]');
    const totop = $('[data-totop]');
    const ring = $('[data-totop-ring]');
    const LEN = 138.2;
    let current = '';

    // Header colour follows the section beneath it (light / dark / lime)
    const setTheme = (t) => {
      header.classList.remove('t-dark', 't-split', 't-lime');
      if (t && t !== 'light') header.classList.add(`t-${t}`);
    };
    $$('[data-theme]').forEach((sec) =>
      ScrollTrigger.create({ trigger: sec, start: 'top 40px', end: 'bottom 40px', onToggle: (st) => st.isActive && setTheme(sec.dataset.theme) })
    );
    ScrollTrigger.create({
      trigger: '[data-hero]',
      start: 'top top',
      end: 'bottom 40px',
      onToggle: (st) => st.isActive && setTheme('dark'),
    });

    // Header steps aside while reading down, returns the moment you scroll up
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        const y = self.scroll();
        const menuOpen = document.body.classList.contains('menu-open');
        if (!menuOpen) header.classList.toggle('is-hidden', self.direction === 1 && y > innerHeight * 0.9);
        // On touch screens the button only shows while scrolling back up, so it never sits on content being read
        totop.classList.toggle('is-on', y > innerHeight && (fine || self.direction === -1));
        header.classList.toggle('is-solid', y > innerHeight * 1.2);
        ring.style.strokeDashoffset = (LEN * (1 - self.progress)).toFixed(1);
      },
    });

    // The header names the section you are in
    const setCrumb = (name) => {
      if (name === current) return;
      current = name;
      gsap.to(crumbText, {
        yPercent: -100, opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete() {
          crumbText.textContent = name;
          crumb.style.width = name ? `${crumbText.offsetWidth + 6}px` : '0px';
          gsap.fromTo(crumbText, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
        },
      });
    };
    $$('[data-section]').forEach((sec) =>
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (st) => st.isActive && setCrumb(sec.dataset.section),
      })
    );
    ScrollTrigger.create({ trigger: '[data-hero]', start: 'top top', end: 'bottom 50%', onToggle: (st) => st.isActive && setCrumb('') });

    totop.addEventListener('click', () => (lenis ? lenis.scrollTo(0, { duration: 1.8 }) : scrollTo({ top: 0, behavior: 'smooth' })));

    // Leaving for another page: five columns close over the screen, then navigate
    const veil = $$('[data-veil] i');
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="http"]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      gsap.to(veil, { scaleY: 1, duration: 0.7, ease: 'expo.inOut', stagger: { each: 0.05, from: 'center' }, onComplete: () => (location.href = a.href) });
    });
    // Coming back via the browser's back button shows the page again
    addEventListener('pageshow', (e) => e.persisted && gsap.set(veil, { scaleY: 0 }));
  }

  /* ───────── Boot ───────── */
  render();
  rollLabels();
  const slider = heroSlider();

  if (!hasGsap) {
    root.classList.remove('js-motion');
    slider.start();
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

  industries();
  menu();

  if (reduced) {
    root.classList.remove('js-motion');
    // No scroll-driven header theming here: keep the header on its light frosted strip so it always reads
    const header = $('[data-header]');
    header.classList.remove('t-dark');
    header.classList.add('is-solid');
    slider.start();
    return;
  }

  history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    window.HHLenis = lenis;
  }

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) }) : target.scrollIntoView({ behavior: 'smooth' });
      if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true }); // skip link hands focus to <main>
    })
  );

  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))])
    .then(() => {
      lines();
      statement();
      firm();
      approach();
      cursor();
      magnetic();
      insights();
      field();
      footer();
      reveals();
      lazyFade();
      experience();
      return intro();
    })
    .then(() => {
      lenis && lenis.start();
      heroIntro();
      ScrollTrigger.refresh();
    });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
