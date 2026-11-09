(() => {
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const PLAY_ORIGIN = window.NP_PLAY_ORIGIN || (isLocal
    ? 'http://127.0.0.1:8780'
    : 'https://cdn.jsdelivr.net/gh/dev-to2k/neon-parcel-play@main');
  const DEMO_ORIGIN = window.NP_DEMO_ORIGIN || (isLocal
    ? 'http://127.0.0.1:8781'
    : 'https://rawcdn.githack.com/dev-to2k/neon-parcel-demo/main');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openPlay() {
    // Real game, no ?auto=1, own origin
    window.open(PLAY_ORIGIN + '/index.html?map=neon', '_blank', 'noopener');
  }
  document.querySelectorAll('[data-play]').forEach((el) => el.addEventListener('click', openPlay));

  // Demo bot: swap hero video for iframe on demo origin
  const frame = document.getElementById('heroFrame');
  const video = document.getElementById('heroVideo');
  let demoLoaded = false;
  function loadDemo() {
    if (demoLoaded) return;
    demoLoaded = true;
    if (video) {
      video.pause();
      video.style.display = 'none';
    }
    const iframe = document.createElement('iframe');
    iframe.title = 'Neon Parcel autoplay demo';
    iframe.src = DEMO_ORIGIN + '/index.html?auto=1&map=neon';
    iframe.allow = 'autoplay';
    iframe.loading = 'lazy';
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;image-rendering:pixelated';
    frame.appendChild(iframe);
  }
  const btnDemo = document.getElementById('btnDemo');
  if (btnDemo) btnDemo.addEventListener('click', loadDemo);

  // Integer scale hint: hero frame is 2x of 480x270 via CSS aspect-ratio + max 960

  if (reduce || !window.gsap) {
    // Static fallbacks
    document.querySelectorAll('.reveal').forEach((el) => { el.style.opacity = 1; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Lenis + ScrollTrigger proxy
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.15,
      // keep native scroll so layout/pin stays correct
      syncTouch: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__npLenis = lenis;
  }
  window.__npScrollTo = (y) => {
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  };

  // Hero entrance
  gsap.from('.hero-ui > *', {
    y: 18, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', delay: 0.15,
  });

  // Route pin scrub — GSAP pin + full-viewport parallax + Neon→Paris
  const layFar = document.getElementById('layFar');
  const layMid = document.getElementById('layMid');
  const layNear = document.getElementById('layNear');
  const laySign = document.getElementById('laySign');
  const dayNight = document.getElementById('dayNight');
  const nightVeil = document.getElementById('nightVeil');
  const courier = document.getElementById('courier');
  const parcelFly = document.getElementById('parcelFly');
  const eiffel = document.getElementById('eiffel');
  const biomeTag = document.getElementById('biomeTag');
  const routeCopy = document.getElementById('routeCopy');
  const mailbox = document.getElementById('mailbox');
  const plateNeon = document.getElementById('plateNeon');
  const plateParis = document.getElementById('plateParis');
  const routeSticky = document.querySelector('.route-sticky');
  const px = (n) => Math.round(n);

  // Pin the viewport panel for the whole route section height
  ScrollTrigger.create({
    trigger: '#route',
    start: 'top top',
    end: 'bottom bottom',
    pin: routeSticky,
    pinSpacing: false,
    anticipatePin: 1,
  });

  gsap.set([layFar, layMid, layNear, laySign], { opacity: 1 });
  gsap.set(plateNeon, { opacity: 0 });
  gsap.set([plateParis, eiffel], { opacity: 0 });

  const routeTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#route',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
  });

  routeTl.to(layFar, { x: () => px(-innerWidth * 0.45), ease: 'none' }, 0);
  routeTl.to(layMid, { x: () => px(-innerWidth * 0.9), ease: 'none' }, 0);
  routeTl.to(layNear, { x: () => px(-innerWidth * 1.4), ease: 'none' }, 0);
  routeTl.to(laySign, { x: () => px(-innerWidth * 1.1), ease: 'none' }, 0);

  // Fly across — mostly X; tiny bob so they stay on rooftops
  routeTl.fromTo(courier,
    { x: 0, y: 0 },
    { x: () => px(innerWidth * 0.7), y: () => px(-innerHeight * 0.03), ease: 'none' },
    0
  );
  routeTl.fromTo(parcelFly,
    { x: 0, y: 0, rotation: -6 },
    { x: () => px(innerWidth * 0.76), y: () => px(-innerHeight * 0.05), rotation: 20, ease: 'none' },
    0
  );
  routeTl.to(mailbox, { x: () => px(-innerWidth * 0.1), ease: 'none' }, 0);

  // Day → night, then Paris plate + Eiffel over dimmed neon layers
  routeTl.to(dayNight, { opacity: 0, ease: 'none' }, 0);
  routeTl.to(nightVeil, { opacity: 0.85, ease: 'none' }, 0);
  // Keep Warped layers mostly opaque so rooftops stay full-bleed; Paris = tint + Eiffel
  routeTl.to([layNear, layMid, laySign], { opacity: 0.55, ease: 'none' }, 0.5);
  routeTl.to(layFar, { opacity: 0.45, ease: 'none' }, 0.5);
  routeTl.fromTo(plateParis, { opacity: 0 }, { opacity: 0.38, ease: 'none' }, 0.4);
  routeTl.fromTo(eiffel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'none' }, 0.38);

  ScrollTrigger.create({
    trigger: '#route',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      if (p < 0.35) {
        biomeTag.textContent = 'BIOME · NEON · DAY→NIGHT';
        routeCopy.textContent = 'Bay cùng parcel qua skyline Warped City (CC0) — parallax integer-pixel.';
      } else if (p < 0.5) {
        biomeTag.textContent = 'BIOME · NEON · NIGHT';
        routeCopy.textContent = 'Đêm neon — rooftops + mailbox depot. Giữ combo, giao hàng.';
      } else {
        biomeTag.textContent = 'BIOME · PARIS · NIGHT';
        routeCopy.textContent = 'Paris night — Eiffel CC0 hiện lên. Delivery route tiếp tục.';
      }
    },
  });

  // SplitText terminal
  function splitReveal(el, delay = 0) {
    if (!el) return;
    try {
      const split = SplitText.create(el, { type: 'chars', charsClass: 'char' });
      gsap.set(split.chars, { opacity: 0, y: 12 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(split.chars, {
            opacity: 1, y: 0, duration: 0.45, stagger: 0.02,
            ease: 'power2.out', delay,
          });
        },
      });
    } catch (e) {
      gsap.from(el, { opacity: 0, y: 16, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 80%' } });
    }
  }
  splitReveal(document.getElementById('splitA'), 0);
  splitReveal(document.getElementById('splitB'), 0.15);

  // Cards / biomes reveal
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 24, duration: 0.55, delay: (i % 4) * 0.05,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Soft neon pulse on primary CTA — kept under 3 flashes/s (period ~1.2s, 1 opacity bump)
  gsap.to('.btn.primary', {
    boxShadow: '0 0 28px #ff2bd688',
    duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut',
  });

  // Lazy demo when hero frame ~50% in view after user scrolled back? Optional — click only to save bandwidth
})();
