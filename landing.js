(() => {
  const PLAY_ORIGIN = window.NP_PLAY_ORIGIN || 'http://127.0.0.1:8780';
  const DEMO_ORIGIN = window.NP_DEMO_ORIGIN || 'http://127.0.0.1:8781';
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
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Hero entrance
  gsap.from('.hero-ui > *', {
    y: 18, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', delay: 0.15,
  });

  // Route pin scrub — integer pixel parallax
  const layFar = document.getElementById('layFar');
  const layMid = document.getElementById('layMid');
  const layNear = document.getElementById('layNear');
  const laySign = document.getElementById('laySign');
  const dayNight = document.getElementById('dayNight');
  const courier = document.getElementById('courier');
  const parcelFly = document.getElementById('parcelFly');
  const eiffel = document.getElementById('eiffel');
  const biomeTag = document.getElementById('biomeTag');
  const routeCopy = document.getElementById('routeCopy');
  const mailbox = document.getElementById('mailbox');

  const routeTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#route',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  routeTl.to(layFar, { x: () => -Math.round(innerWidth * 0.35), ease: 'none' }, 0);
  routeTl.to(layMid, { x: () => -Math.round(innerWidth * 0.7), ease: 'none' }, 0);
  routeTl.to(layNear, { x: () => -Math.round(innerWidth * 1.15), ease: 'none' }, 0);
  routeTl.to(laySign, { x: () => -Math.round(innerWidth * 0.9), ease: 'none' }, 0);
  routeTl.to(courier, {
    x: () => Math.round(innerWidth * 0.55),
    y: () => -Math.round(innerHeight * 0.08),
    ease: 'none',
  }, 0);
  routeTl.to(parcelFly, {
    x: () => Math.round(innerWidth * 0.62),
    y: () => -Math.round(innerHeight * 0.12),
    rotation: 18,
    ease: 'none',
  }, 0);
  routeTl.to(dayNight, { opacity: 0.85, ease: 'none' }, 0);
  routeTl.to(eiffel, { opacity: 1, ease: 'none' }, 0.55);
  routeTl.to(mailbox, { x: () => -Math.round(innerWidth * 0.08), ease: 'none' }, 0);

  ScrollTrigger.create({
    trigger: '#route',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      if (p < 0.55) {
        biomeTag.textContent = 'BIOME · NEON';
        routeCopy.textContent = 'Bay cùng parcel qua skyline Warped City (CC0) — integer-pixel parallax.';
      } else {
        biomeTag.textContent = 'BIOME · PARIS';
        routeCopy.textContent = 'Paris night — Eiffel CC0 hiện lên mansard. Giao hàng không ngủ.';
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
