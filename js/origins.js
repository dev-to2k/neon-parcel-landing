// Public origins (Pages for play; githack for demo = isolated localStorage)
window.NP_PLAY_ORIGIN = (typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname))
  ? 'http://127.0.0.1:8780'
  : 'https://dev-to2k.github.io/neon-parcel-play';
window.NP_DEMO_ORIGIN = (typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname))
  ? 'http://127.0.0.1:8781'
  : 'https://raw.githack.com/dev-to2k/neon-parcel-demo/main';
