(() => {
  const PLAY_ORIGIN = window.NP_PLAY_ORIGIN || 'https://dev-to2k.github.io/neon-parcel-play';
  const DEMO_ORIGIN = window.NP_DEMO_ORIGIN || 'https://raw.githack.com/dev-to2k/neon-parcel-demo/main';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-play]').forEach((el) => { el.href = PLAY_ORIGIN + '/index.html'; });

  const demoDialog = document.getElementById('demoDialog');
  const demoFrame = document.getElementById('demoFrame');
  document.getElementById('btnDemo').addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.title = 'Neon Parcel: bot chơi thử';
    iframe.src = DEMO_ORIGIN + '/index.html?auto=1&map=neon';
    iframe.allow = 'autoplay';
    demoFrame.replaceChildren(iframe);
    demoDialog.showModal();
  });
  document.getElementById('demoClose').addEventListener('click', () => demoDialog.close());
  demoDialog.addEventListener('click', (e) => { if (e.target === demoDialog) demoDialog.close(); });
  demoDialog.addEventListener('close', () => demoFrame.replaceChildren());

  const tour = document.getElementById('tour');
  const track = document.getElementById('tourTrack');
  const stops = Array.from(track.querySelectorAll('.stop'));
  const routeLine = document.getElementById('routeLine');
  const routeDots = document.getElementById('routeDots');
  const tourCount = document.getElementById('tourCount');
  const timeBtns = Array.from(document.querySelectorAll('[data-time-btn]'));

  routeDots.append(...stops.map(() => document.createElement('li')));
  const dots = Array.from(routeDots.children);

  function setProgress(p) {
    const i = Math.round(p * (stops.length - 1));
    routeLine.style.setProperty('--p', p.toFixed(4));
    tourCount.textContent = String(i + 1).padStart(2, '0');
    dots.forEach((dot, n) => dot.classList.toggle('on', n <= i));
  }
  setProgress(0);

  track.addEventListener('scroll', () => {
    const max = track.scrollWidth - track.clientWidth;
    if (max > 0) setProgress(track.scrollLeft / max);
  }, { passive: true });

  timeBtns.forEach((btn) => btn.addEventListener('click', () => {
    tour.dataset.time = btn.dataset.timeBtn;
    timeBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  }));

  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.15, syncTouch: true, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  gsap.from('.hero-in > *', { y: 28, opacity: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.1 });
  gsap.from('.hud li', { y: 20, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', delay: 0.6 });
  gsap.to('.hero-video', {
    yPercent: 10, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    tour.classList.add('is-pinned');
    const last = stops[stops.length - 1];
    const dist = () => Math.max(0, last.offsetLeft + last.offsetWidth + stops[0].offsetLeft - innerWidth);
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.tour-pin', start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress),
      },
    });
    return () => tour.classList.remove('is-pinned');
  });

  ScrollTrigger.batch('.reveal', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.from(els, { y: 32, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }),
  });

  gsap.from('.cta-end h2', {
    scale: 0.86, opacity: 0, duration: 0.7, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '.cta-end', start: 'top 70%', once: true },
  });
})();
