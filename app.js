/* HuntHire — Opsi B "Puzzle Studio".
   Every interaction is built from the five pieces of the HuntHire Puzzle mark. */
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
        <article class="hunter hunter--${(i + Math.floor(i / 4)) % 2 ? 'ci' : 'sq'}">
          <div class="hunter__mask"><img src="${p.photo}" alt="${p.name}" loading="lazy" /></div>
          <h4>${p.name}</h4>
          <p>${p.role}</p>
          <div class="hunter__links"><a href="mailto:recruitment@hunthire.id">Email</a><a href="https://www.linkedin.com/company/hunthire/">LinkedIn</a></div>
        </article>`
      )
      .join('');

    $('[data-insight-list]').innerHTML = HH.news
      .map(
        (n) => `
        <li class="insight">
          <a href="https://hunthire.id/news" data-img="${n.photo}">
            <span class="insight__tag">${n.tag}</span>
            <span class="insight__title">${n.title}</span>
            <span class="insight__arrow"><svg><use href="#arrow" /></svg></span>
          </a>
        </li>`
      )
      .join('');
  }

  /* ───────── Services accordion: the image mask changes shape per service ───────── */
  const MASKS = { sq: '0% 0% 0% 0%', ci: '50% 50% 50% 50%', bar: '50% 50% 0% 0%', ci2: '50% 0% 50% 0%' };

  function accordion() {
    const items = $$('.acc__item');
    const mask = $('[data-service-mask]');

    const setOpen = (item, open) => {
      if (item.classList.contains('is-open') === open) return;
      const panel = $('.acc__panel', item);
      item.classList.toggle('is-open', open);
      $('.acc__btn', item).setAttribute('aria-expanded', open);
      if (!hasGsap) return;
      if (open) gsap.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.7, ease: 'expo.out' });
      else gsap.to(panel, { height: 0, duration: 0.5, ease: 'expo.out' });
    };

    items.forEach((item) => {
      $('.acc__btn', item).addEventListener('click', () => {
        items.forEach((o) => setOpen(o, o === item));
        if (!hasGsap) return;
        gsap.to(mask, { borderRadius: MASKS[item.dataset.shape], duration: 1.1, ease: 'expo.out' });
        gsap.fromTo($('img', mask), { scale: 1.15 }, { scale: 1, duration: 1.2, ease: 'expo.out' });
      });
    });
  }

  /* ───────── Puzzle game ───────── */
  const INFO = [
    ['Research', 'Conduct in-depth research', 'We study your company and culture and present it as a compelling pitch to high-potential candidates.'],
    ['STAR', 'Using the STAR approach', 'Pre-screening interviews make sure candidates match at least 70% of your requirements.'],
    ['Network', 'A network built since 2018', 'We constantly build and maintain a vast talent network across Indonesia and Southeast Asia.'],
    ['Speed', 'Speed is our secret weapon', 'We are renowned for delivering exceptional candidates with unprecedented agility.'],
    ['Care', 'Take all the responsibility', 'From first contact to day one, including salary negotiation and support through probation.'],
  ];

  function game() {
    const section = $('[data-game]');
    const board = $('[data-board]');
    const slots = $$('[data-slot]');
    const pieces = $$('[data-piece]');
    const done = $('[data-game-done]');
    const tag = $('[data-info-tag]');
    const title = $('[data-info-title]');
    const text = $('[data-info-text]');
    const shapeOf = (el) => (el.className.match(/--(sq|ci|bar)/) || [])[1];
    const center = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const tilt = () => gsap.utils.random(-14, 14);

    const showInfo = (id) => {
      const [t, h, p] = INFO[id];
      tag.textContent = t;
      title.textContent = h;
      text.textContent = p;
      gsap.fromTo([title, text], { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.05 });
    };

    const freeSlotFor = (piece, near) => {
      const free = slots.filter((s) => !s.classList.contains('is-filled') && shapeOf(s) === shapeOf(piece));
      if (!near) return free.find((s) => s.dataset.slot === piece.dataset.piece) || free[0];
      const c = center(piece);
      let best = null;
      let bestD = Infinity;
      free.forEach((s) => {
        const d = Math.hypot(center(s).x - c.x, center(s).y - c.y);
        if (d < bestD) [best, bestD] = [s, d];
      });
      return best && bestD < best.offsetWidth * 0.7 ? best : null;
    };

    const snapTo = (piece, slot, duration) => {
      const a = center(piece);
      const b = center(slot);
      gsap.to(piece, { x: `+=${b.x - a.x}`, y: `+=${b.y - a.y}`, rotation: 0, scale: 1, duration, ease: 'back.out(1.8)' });
    };

    const place = (piece, slot) => {
      piece._slot = slot;
      slot.classList.add('is-filled');
      piece.classList.add('is-placed');
      piece._drag && piece._drag.disable();
      snapTo(piece, slot, 0.7);
      showInfo(+piece.dataset.piece);
      if (pieces.every((p) => p._slot)) setTimeout(complete, 650);
    };

    const complete = () => {
      gsap
        .timeline()
        .to(pieces, { backgroundColor: '#C1FF04', color: '#090F06', duration: 0.25, stagger: 0.07 })
        .to(pieces, { backgroundColor: '#29A869', color: '#FDFFFE', duration: 0.4, stagger: 0.07 })
        .fromTo(board, { scale: 1 }, { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 0)
        .to(done, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.3);
      burst();
      tag.textContent = 'Complete';
      title.textContent = 'Perfect fit.';
      text.textContent = 'Research, STAR, network, speed and care. Put together, that is a HuntHire placement.';
    };

    const burst = () => {
      const box = $('[data-confetti]');
      const s = section.getBoundingClientRect();
      const b = center(board);
      const colors = ['#29A869', '#C1FF04', '#2B484E', '#A0D9CE', '#090F06'];
      for (let i = 0; i < 36; i++) {
        const el = document.createElement('i');
        el.style.background = colors[i % colors.length];
        el.style.left = `${b.x - s.left}px`;
        el.style.top = `${b.y - s.top}px`;
        if (i % 2) el.style.borderRadius = '50%';
        if (i % 5 === 0) el.style.width = '30px';
        box.appendChild(el);
        const angle = Math.random() * Math.PI * 2;
        const dist = gsap.utils.random(140, 420);
        gsap
          .timeline({ onComplete: () => el.remove() })
          .to(el, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 80, rotation: gsap.utils.random(-360, 360), duration: 1, ease: 'expo.out' })
          .to(el, { y: '+=180', opacity: 0, duration: 0.8, ease: 'power2.in' }, 0.6);
      }
    };

    pieces.forEach((piece) => {
      gsap.set(piece, { rotation: tilt() });
      piece.addEventListener('pointerenter', () => !piece._slot && showInfo(+piece.dataset.piece));
      // Keyboard: Enter/Space places the piece
      piece.addEventListener('click', (e) => {
        if (e.detail !== 0 || piece._slot) return;
        const slot = freeSlotFor(piece, false);
        if (slot) place(piece, slot);
      });

      piece._drag = Draggable.create(piece, {
        type: 'x,y',
        zIndexBoost: false,
        onPress() {
          piece.classList.add('is-dragging');
          root.classList.add('is-dragging');
          gsap.to(piece, { scale: 1.08, rotation: 0, duration: 0.3, ease: 'expo.out' });
          showInfo(+piece.dataset.piece);
        },
        onDrag() {
          const target = freeSlotFor(piece, true);
          slots.forEach((s) => s.classList.toggle('is-hot', s === target));
        },
        onRelease() {
          piece.classList.remove('is-dragging');
          root.classList.remove('is-dragging');
          slots.forEach((s) => s.classList.remove('is-hot'));
          const slot = freeSlotFor(piece, true);
          if (slot) place(piece, slot);
          else gsap.to(piece, { x: 0, y: 0, scale: 1, rotation: tilt(), duration: 0.9, ease: 'elastic.out(1, 0.5)' });
        },
      })[0];
    });

    $('[data-game-solve]').addEventListener('click', () => {
      pieces
        .filter((p) => !p._slot)
        .forEach((p, i) => setTimeout(() => !p._slot && place(p, freeSlotFor(p, false)), i * 220));
    });

    $('[data-game-reset]').addEventListener('click', () => {
      pieces.forEach((p) => {
        p._slot = null;
        p.classList.remove('is-placed');
        p._drag.enable();
      });
      slots.forEach((s) => s.classList.remove('is-filled'));
      gsap.to(pieces, { x: 0, y: 0, rotation: tilt, duration: 0.9, ease: 'elastic.out(1, 0.6)', stagger: 0.05 });
      gsap.to(done, { opacity: 0, y: 20, duration: 0.3 });
      tag.textContent = 'Start here';
      title.textContent = 'Grab any piece';
      text.textContent = 'Each shape stands for one part of how we hunt. Drop it on its outline.';
    });

    // Keep placed pieces glued to their slots when the layout changes
    addEventListener('resize', () => pieces.forEach((p) => p._slot && snapTo(p, p._slot, 0)));
  }

  /* ───────── Industries: same five pieces, a new picture per industry ───────── */
  // [x, y, rotation] in units of a 240×240 box; piece order: sq, ci, bar, ci, sq
  const LOGO = [[42, 0, 0], [128, 0, 0], [42, 86, 0], [42, 170, 0], [132, 174, 0]];
  const LAYOUTS = [
    [[20, 160, 0], [96, 156, 0], [42, 70, 0], [170, 156, 0], [150, 0, 45]], // FMCG — a stocked shelf
    [[87, 0, 0], [85, 74, 0], [42, 160, 0], [10, 74, 0], [160, 74, 0]], // FSI — a pillar
    [[0, 170, 0], [170, 20, 0], [42, 86, -20], [90, 170, 0], [170, 170, 0]], // Manufacturers
    [[20, 20, 45], [150, 20, 0], [42, 110, 0], [20, 170, 0], [150, 170, 45]], // Digital Banks
    [[87, 30, 45], [20, 150, 0], [42, 90, 90], [150, 150, 0], [87, 174, 0]], // Financial Tech
    [[87, 174, 0], [85, 90, 0], [42, 20, 0], [10, 90, 0], [160, 90, 0]], // Telco — a tower
    [[0, 0, 0], [85, 85, 0], [42, 170, 0], [170, 0, 0], [87, 0, 45]], // Renewable Energy
    [[87, 87, 45], [10, 10, 0], [42, 170, 0], [160, 10, 0], [150, 87, 0]], // Pharmaceutical
    [[87, 20, 0], [20, 90, 0], [42, 90, 90], [150, 90, 0], [87, 160, 0]], // Health — a cross
    [[20, 100, 0], [150, 10, 0], [42, 170, 0], [20, 10, 0], [160, 100, 30]], // Tobacco
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
          rotation: layout[i][2],
          backgroundColor: i === accent ? '#C1FF04' : '#29A869',
          duration: reduced || instant ? 0 : 0.9,
          delay: reduced || instant ? 0 : i * 0.035,
          ease: 'expo.out',
          overwrite: true,
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
        caption.textContent = `${items[idx].textContent}: same pieces, new picture.`;
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
      .to($$('.menu__panels i', nav), { scaleY: 1, duration: 0.7, ease: 'expo.inOut', stagger: { each: 0.06, from: 'center' } })
      .from($$('.menu__link span', nav), { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.035 }, '-=0.25')
      .from($$('.menu__label, .menu__foot', nav), { opacity: 0, y: 10, duration: 0.5 }, '<');

    let open = false;
    const toggle = (state = !open) => {
      open = state;
      btn.setAttribute('aria-expanded', open);
      nav.setAttribute('aria-hidden', !open);
      label.textContent = open ? 'Close' : 'Menu';
      document.body.classList.toggle('menu-open', open);
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

  /* ───────── Intro: pieces drop, click, the bar floods into the hero ───────── */
  function intro() {
    return new Promise((resolve) => {
      const el = $('[data-intro]');
      const pieces = $$('.ip', el);
      const bar = $('.ip--bar', el);
      const flood = $('[data-intro-flood]');
      const client = $('.side--client');
      const rect = (node) => node.getBoundingClientRect();

      gsap
        .timeline({ onComplete: () => { el.remove(); resolve(); } })
        .from(pieces, { y: -700, rotation: () => gsap.utils.random(-120, 120), duration: 1, ease: 'bounce.out', stagger: 0.1 })
        .to(pieces, { scale: 1.12, duration: 0.12, yoyo: true, repeat: 1, stagger: 0.04, ease: 'power2.out' })
        .fromTo($('[data-intro-word]', el), { clipPath: 'inset(0% 100% 0% 0%)', x: -16 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 0.9, ease: 'expo.out' }, '-=0.3')
        .from($('[data-intro-tag]', el), { opacity: 0, y: 10, duration: 0.6 }, '<0.2')
        .set(flood, {
          left: () => rect(bar).left,
          top: () => rect(bar).top,
          width: () => rect(bar).width,
          height: () => rect(bar).height,
          opacity: 1,
        }, '+=0.25')
        .to(flood, { left: 0, top: 0, width: () => innerWidth, height: () => innerHeight, duration: 0.85, ease: 'expo.inOut' })
        .set([$('.intro__logo', el), $('[data-intro-tag]', el)], { opacity: 0 })
        .set(el, { backgroundColor: 'transparent' })
        .to(flood, {
          left: () => rect(client).left,
          top: () => rect(client).top,
          width: () => rect(client).width,
          height: () => rect(client).height,
          duration: 0.85,
          ease: 'expo.inOut',
        });
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

  /* ───────── Hero ───────── */
  function hero() {
    const sec = $('[data-hero]');
    const client = $('.side--client');
    const talent = $('.side--talent');
    const mark = $('[data-hero-mark]');
    const parts = $$('.hp', mark);
    const statement = $('[data-hero-statement]');

    gsap.set(mark, { xPercent: -50, yPercent: -50, x: 0, y: 0 });

    // Scroll: the two audiences pull apart, the mark explodes, the statement fills in
    const words = SplitText.create(statement, { type: 'words', wordsClass: 'word' }).words;
    const fly = [[-420, -260, -160], [380, -300, 200], [-520, 60, 90], [-300, 320, -220], [460, 280, 180]];
    gsap
      .timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.7 } })
      .to(client, { xPercent: -100, ease: 'power2.in', duration: 1 }, 0)
      .to(talent, { xPercent: 100, ease: 'power2.in', duration: 1 }, 0)
      .to(parts, { x: (i) => fly[i][0], y: (i) => fly[i][1], rotation: (i) => fly[i][2], opacity: 0, ease: 'power2.in', duration: 0.9 }, 0)
      .to('.hero__hint, .hero__meta', { opacity: 0, duration: 0.2 }, 0)
      .to(words, { color: '#090F06', stagger: 0.08, duration: 0.3, ease: 'none' }, 0.75);

    // Hover: the mark leans toward the audience you point at
    const grow = (side) =>
      gsap.to(parts, {
        scale: (i) => (side === 'client' ? ([0, 2, 3].includes(i) ? 1.08 : 0.88) : [1, 4].includes(i) ? 1.08 : 0.88),
        duration: 0.6,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    client.addEventListener('pointerenter', () => grow('client'));
    talent.addEventListener('pointerenter', () => grow('talent'));
    $('[data-split-root]').addEventListener('pointerleave', () => gsap.to(parts, { scale: 1, duration: 0.6, ease: 'expo.out' }));

    if (fine) {
      const xTo = gsap.quickTo(mark, 'x', { duration: 1, ease: 'power3.out' });
      const yTo = gsap.quickTo(mark, 'y', { duration: 1, ease: 'power3.out' });
      sec.addEventListener('pointermove', (e) => {
        xTo((e.clientX / innerWidth - 0.5) * 60);
        yTo((e.clientY / innerHeight - 0.5) * 40);
      });
    }
  }

  function heroIntro() {
    root.classList.add('intro-done');
    const parts = $$('.hp');
    gsap
      .timeline()
      .from('[data-header] > *', { y: -80, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0)
      .to(heroLines, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }, 0.05)
      .from('.side__label, .side__text, .side__cta', { opacity: 0, y: 20, duration: 0.9, ease: 'expo.out', stagger: 0.05 }, 0.3)
      .from(parts, { x: () => gsap.utils.random(-300, 300), y: () => gsap.utils.random(-300, 300), rotation: () => gsap.utils.random(-180, 180), scale: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06 }, 0.1)
      .from('.hero__meta, .hero__hint', { opacity: 0, duration: 0.8 }, 0.6);
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
      gsap.fromTo($('.step__shape', step), { rotation: -120, scale: 0.3 }, { rotation: 0, scale: 1, ease: 'none', scrollTrigger: st });
      gsap.from($$('.step__num, h3, p', step), { y: 60, opacity: 0, stagger: 0.1, ease: 'none', scrollTrigger: { ...st, end: 'left 40%' } });
    });
  }

  /* ───────── Numbers ───────── */
  function numbers() {
    $$('[data-count]').forEach((el) => {
      const end = +el.dataset.count;
      const start = end > 1000 ? 1990 : 0;
      const suffix = el.dataset.suffix || '';
      const o = { v: start };
      gsap.to(o, {
        v: end,
        duration: 1.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => (el.textContent = Math.round(o.v) + suffix),
      });
    });
    gsap.from('.stat__shape', { scale: 0, rotation: 90, duration: 1.2, ease: 'back.out(1.6)', stagger: 0.1, clearProps: 'transform', scrollTrigger: { trigger: '[data-numbers]', start: 'top 80%', once: true } });
  }

  /* ───────── Cursor (a piece that changes shape) ───────── */
  function cursor() {
    if (!fine) return;
    const c = $('[data-cursor]');
    const label = $('[data-cursor-label]');
    const xTo = gsap.quickTo(c, 'x', { duration: 0.25, ease: 'power3.out' });
    const yTo = gsap.quickTo(c, 'y', { duration: 0.25, ease: 'power3.out' });
    addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    document.addEventListener('pointerover', (e) => {
      const t = e.target;
      const drag = t.closest('[data-piece]:not(.is-placed), .fd');
      c.classList.toggle('is-drag', !!drag);
      label.textContent = drag ? 'Drag' : '';
      c.classList.toggle('is-square', !drag && !!t.closest('[data-cursor-type="square"]'));
      c.classList.toggle('is-link', !drag && !t.closest('[data-cursor-type="square"]') && !!t.closest('a, button'));
      c.classList.toggle('is-hidden', !!t.closest('.insight'));
    });
    document.addEventListener('pointerleave', () => c.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => c.classList.remove('is-hidden'));
  }

  function magnetic() {
    if (!fine) return;
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ───────── Header logo: pieces scatter on hover, click back together ───────── */
  function logoHover() {
    const logo = $('[data-logo]');
    const parts = $$('.lp', logo);
    logo.addEventListener('pointerenter', () =>
      gsap.to(parts, { x: () => gsap.utils.random(-50, 50), y: () => gsap.utils.random(-50, 50), rotation: () => gsap.utils.random(-90, 90), duration: 0.5, ease: 'expo.out', stagger: 0.02 })
    );
    logo.addEventListener('pointerleave', () => gsap.to(parts, { x: 0, y: 0, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)', stagger: 0.03 }));
  }

  /* ───────── Insights: shape-masked preview follows the cursor ───────── */
  function insights() {
    if (!fine) return;
    const list = $('[data-insight-list]');
    const prev = $('[data-preview]');
    const img = $('[data-preview-img]');
    const xTo = gsap.quickTo(prev, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(prev, 'y', { duration: 0.5, ease: 'power3.out' });
    const rTo = gsap.quickTo(prev, 'rotation', { duration: 0.6, ease: 'power3.out' });
    let lastX = 0;

    list.addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.8));
      lastX = e.clientX;
    });
    const hide = () => gsap.to(prev, { clipPath: 'circle(0% at 50% 50%)', duration: 0.5, ease: 'expo.out' });
    $$('a', list).forEach((a, i) =>
      a.addEventListener('pointerenter', (e) => {
        if (!prev.style.clipPath || prev.style.clipPath.startsWith('circle(0')) gsap.set(prev, { x: e.clientX, y: e.clientY });
        img.src = a.dataset.img;
        gsap.to(prev, { clipPath: 'circle(75% at 50% 50%)', borderRadius: i % 2 ? '50%' : '0%', duration: 0.6, ease: 'expo.out' });
        gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 0.8, ease: 'expo.out' });
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
        gsap.to(box.children, { scale: 1.8, opacity: 0.35, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { grid: [rows, cols], from: 'center', each: 0.06 } });
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

  /* ───────── Footer: pieces drop into a pile you can toss around ───────── */
  function footer() {
    const drop = $('[data-drop]');
    const parts = $$('.fd', drop);
    parts.forEach((p, i) => (p.style.left = `${4 + i * 9.2 + gsap.utils.random(-2, 2)}%`));

    gsap.fromTo(
      parts,
      { y: -500, rotation: () => gsap.utils.random(-180, 180) },
      { y: 0, rotation: () => gsap.utils.random(-25, 25), duration: 1.4, ease: 'bounce.out', stagger: 0.08, scrollTrigger: { trigger: drop, start: 'top 90%', once: true } }
    );

    Draggable.create(parts, {
      type: 'x,y',
      bounds: $('[data-footer]'),
      onPress() { gsap.to(this.target, { scale: 1.1, duration: 0.2 }); },
      onRelease() { gsap.to(this.target, { y: 0, scale: 1, rotation: gsap.utils.random(-30, 30), duration: 1.2, ease: 'bounce.out' }); },
    });

    const word = $('[data-footer-word]');
    const chars = SplitText.create(word, { type: 'chars', charsClass: 'char' }).chars;
    gsap.from(chars, { yPercent: 100, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: word, start: 'top 95%', once: true } });
    chars.forEach((ch) =>
      ch.addEventListener('pointerenter', () => gsap.fromTo(ch, { yPercent: 0 }, { yPercent: -18, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out', color: '#C1FF04' }))
    );
  }

  /* ───────── Generic reveals ───────── */
  function reveals() {
    gsap.from('.hunter__mask', {
      scale: 0, rotation: (i) => (i % 2 ? -30 : 30), duration: 1.1, ease: 'back.out(1.6)', stagger: 0.07, clearProps: 'transform',
      scrollTrigger: { trigger: '[data-hunter-grid]', start: 'top 80%', once: true },
    });
    gsap.from('.insight', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '[data-insight-list]', start: 'top 85%', once: true } });
    gsap.from('.acc__item', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '[data-acc]', start: 'top 85%', once: true } });
    gsap.from('.slot', { scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(2)', stagger: 0.06, scrollTrigger: { trigger: '[data-board]', start: 'top 80%', once: true } });
    gsap.from('[data-piece]', { y: -260, opacity: 0, duration: 1.2, ease: 'bounce.out', stagger: 0.08, scrollTrigger: { trigger: '[data-tray]', start: 'top 80%', once: true } });
    gsap.from('.ar', { scale: 0, duration: 1, ease: 'back.out(2)', stagger: 0.06, scrollTrigger: { trigger: '[data-arrange]', start: 'top 80%', once: true } });
    gsap.from('.services__mask', { clipPath: 'inset(50% 50% 50% 50%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.services__mask', start: 'top 80%', once: true } });
  }

  /* ───────── Boot ───────── */
  render();
  accordion();

  if (!hasGsap) {
    root.classList.remove('js-motion');
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

  game();
  industries();
  menu();

  if (reduced) {
    root.classList.remove('js-motion');
    return;
  }

  history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
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
      lenis ? lenis.scrollTo(target, { duration: 1.4 }) : target.scrollIntoView({ behavior: 'smooth' });
    })
  );

  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))])
    .then(() => {
      lines();
      hero();
      approach();
      numbers();
      cursor();
      magnetic();
      logoHover();
      insights();
      field();
      footer();
      reveals();
      return intro();
    })
    .then(() => {
      lenis && lenis.start();
      heroIntro();
      ScrollTrigger.refresh();
    });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
