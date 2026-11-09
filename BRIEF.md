# Neon Parcel — Landing Animation Brief

**Ngày:** 2026-11-10 (Asia/Saigon)  
**Phạm vi:** research + plan only — **chưa code**. Không sửa repo game.  
**Master tip lúc viết:** `785a204` (Eiffel + Neon wall props + sewer tiles). **Build-time = `origin/master` mới nhất; không pin SHA.** Santorini **chưa** có landmark → skip biome đó trên landing.

---

## 1. Game summary

**Neon Parcel** — rooftop night-courier runner, pixel 2D, pure HTML5 Canvas (`index.html` + `game.js`), zero npm deps trong game. Dash mái neon, xích parcel hồng, stomp drone, boss VoltSec (Dasher / Bomber / Zapper + SHIELDER / elite gunner trên master). **12 map** day/night (`neon` · `santorini` · `halong` · `fuji` · `canyon` · `machu` · `venice` · `iceland` · `sahara` · `cappadocia` · `rio` · `paris`). Street hub (`H` / `?hub=1`): shop, forge, bills, home. Story 5 Nights + skill tree (air slam, roof dash, overdrive…).

- Repo: `https://github.com/dev-to2k/neon-parcel` (private)  
- Internal res: **480×270**, integer scale, `image-rendering: pixelated`  
- Chạy local: `python3 -m http.server 8080` → `http://localhost:8080`  
- **Không có live deploy / homepage / GitHub Pages** (`homepage: null`, `has_pages: false`)  
- Palette chính: bg `#0B0F1A` / `#05071a`, parcel `#FF2BD6`, cyan `#2BFFF2`, player `#39FF14`, warm `#ffc857`  
- CRT sẵn trong game: `#scan` = `repeating-linear-gradient` 1px/3px + neon frame glow (`index.html`)

---

## 2. Usable assets (copy sang landing — giữ credit)

### Media landing (ưu tiên)

| Path | Size | Dùng |
|------|------|------|
| `docs/media/neon-parcel-demo.mp4` | ~2.3 MB | Hero clip tạm / fallback |
| `docs/media/01-title.png` | 960×540 | Poster / OG |
| `docs/media/04-gameplay.png` | 960×540 | Hero poster |
| `docs/media/06-boss-dasher.png` | 960×540 | Boss section |
| `docs/media/102-paris-night.png` | 960×540 | Biome Paris (có Eiffel in-game) |
| `docs/media/100-rio-night.png` | 960×540 | Biome gallery (optional) |
| `docs/media/83-halong-night.png` | 960×540 | Biome gallery (optional) |
| `docs/media/80-santorini-day.png` | 960×540 | **Không dùng làm landmark section** (chưa có landmark art) |

### Warped City parallax — **CC0 1.0** (Luis Zuno / ansimuz)

Nguồn: https://opengameart.org/content/warped-city · chi tiết `docs/ASSET_LICENSES.md`

| Path | px | Layer gợi ý |
|------|-----|-------------|
| `art/neon/warped/skyline-a.png` | 128×240 | Far sky |
| `art/neon/warped/buildings-bg.png` | 144×124 | Mid |
| `art/neon/warped/near-buildings-bg.png` | 493×209 | Near |
| `art/neon/warped/hotel-sign.png` | 68×35 | Accent |
| `art/neon/warped/tileset.png` | 384×256 | Condenser / ladder / vent / pipe stamps (1× blit) |

Ship nguyên file + copy `art/neon/warped/SHA256SUMS`. Credit không bắt buộc (CC0) nhưng ghi footer “Warped City by ansimuz (CC0)”.

### Paris landmark — **CC0 1.0** (Magic105)

| Path | px |
|------|-----|
| `art/paris/eiffel.png` | 48×64 |

Nguồn: https://opengameart.org/content/eiffel-tower

### Mailbox — **CC-BY 3.0** (Molly “Cougarmint” Willits) — **bắt buộc credit footer**

| Path | px |
|------|-----|
| `art/depot/mailbox-flag-up.png` | 22×24 |
| `art/depot/mailbox-flag-up-source.png` | 32×32 (nguồn) |

Nguồn: https://opengameart.org/content/maibox-sprite-pack · notice ship: `CREDITS.txt`  
Footer text (giữ nguyên ý): *Mailbox sprite © Molly "Cougarmint" Willits — CC-BY 3.0 — modified (shortened post).*

### Font — **SIL OFL 1.1**

| Path | Face |
|------|------|
| `fonts/fusion-pixel-12px-latin.woff2` | HubPixel / Fusion Pixel 12 (TakWolf) |
| `fonts/OFL.txt` | License |
| `fonts/LICENSES/{ark-pixel,cubic-11,galmuri}/` | Notices phụ |

Body 12px native; title integer **2×** nearest-neighbor. Nguồn: https://github.com/TakWolf/fusion-pixel-font

### Không dùng / tránh

- Santorini landmark (chưa có)  
- Sewer `art/sewer/*` (không phải tone marketing rooftop)  
- Invent placeholder art khi đã có asset repo  
- Warped City **audio** (không CC0) — không ship  
- Addon Warped City paid — không có trong repo

---

## 3. Stack đề xuất — **ĐỒNG Ý** group / Codex

### Stack chốt

```
static HTML/CSS/JS
+ GSAP 3 (ScrollTrigger, SplitText)   — Standard “No Charge”, free commercial từ 2025-04-30
+ Lenis (MIT)                           — smooth scroll, <5kb, sync với ScrollTrigger qua scrollerProxy
```

**Cấm:** React · Three.js · PixiJS · OGL · WebGL shaders · Motion/R3F (overkill + lệch pixel aesthetic).

### Vì sao agree Codex / group

| Điểm Codex | Verdict |
|------------|---------|
| Static HTML + GSAP + Lenis, no Three/Pixi | **Agree** — X gần đây (Awwwards Agrumea, nhiều demo) vẫn GSAP+Lenis là combo phổ biến; pixel game không cần WebGL |
| Warped City layers integer-pixel scale | **Agree** — khớp `image-rendering:pixelated` + blit 1× trong game |
| Parcel bay qua skyline trên scroll | **Agree** — pin + scrub ScrollTrigger = wow mà nhẹ |
| Real gameplay clip / embedded canvas | **Agree có sửa origin** — xem §5 `?auto=1` |
| Neon-flicker + light scanline | **Agree có giới hạn WCAG** — xem §6 |
| `prefers-reduced-motion` | **Agree** — bắt buộc |
| No React | **Agree** — game đã zero-deps; landing nên ship tĩnh (Cloudflare Pages / Netlify / GH Pages) |

GSAP: toàn bộ plugin cũ Club (SplitText, MorphSVG, ScrollTrigger…) **free commercial** — [Pricing](https://gsap.com/pricing/) · [Standard License](https://gsap.com/community/standard-license/) · cấm duy nhất: tool visual no-code cạnh Webflow.  
Lenis: MIT — https://github.com/darkroomengineering/lenis

**Không dùng GSAP ScrollSmoother** nếu đã dùng Lenis (trùng vai trò); gắn Lenis → `ScrollTrigger.scrollerProxy`.

---

## 4. Section plan (6 sections)

### (1) Hero — real gameplay first

1. Poster = `docs/media/04-gameplay.png` (hoặc frame capture mới).  
2. Short muted loop video (capture mới trên box, hoặc tạm `neon-parcel-demo.mp4`) — `playsinline` `muted` `loop`.  
3. **Lazy:** khi click “Xem demo bot” / in-view → iframe **demo origin** `…/index.html?auto=1&map=neon` (không phải origin play).  
4. Scale iframe/canvas **integer × (480×270)** only (1×/2×/3×…), CSS `image-rendering: pixelated`.  
5. CTA chính **“Chơi ngay”** → mở game **không** `?auto=1` trên **origin play thật** (tab mới hoặc đổi `iframe.src`). CTA phải **đọc được ≤ 1 giây** trên nền neon (contrast cao, không chỉ dựa flicker).

### (2) Pinned scroll — delivery route

- Pin full-viewport. Scrub Lenis+ScrollTrigger.  
- Layers Warped City CC0, **translate bằng số nguyên pixel** (step `Math.round`), tốc độ khác nhau (sky 0.2 · mid 0.45 · near 0.8).  
- Sprite parcel `#FF2BD6` / courier bay ngang; scrub **day→night** (CSS filter / overlay gradient từ shot day→night Neon).  
- Biome swap cuối pin: **Neon → Paris** dùng `102-paris-night.png` + `art/paris/eiffel.png` (integer scale). **Không** Santorini.

### (3) Terminal copy — Fusion Pixel + SplitText

- Font `HubPixel` từ woff2 repo.  
- SplitText chars/lines kiểu terminal reveal (“ROOFTOP NIGHT COURIER” · “DELIVER. STOMP. SURVIVE.”).  
- Reuse CRT: copy `#scan` gradient từ `index.html`; flicker neon **≤ 3 flash/giây** (WCAG 2.3.1).

### (4) How to play / feel

- 3–4 icon steps từ screenshots repo (run · chain parcel · stomp · zipline).  
- Stagger fade-up ScrollTrigger; không invent art.

### (5) Biomes + bosses

- Horizontal snap gallery: Neon / Paris / Rio / Ha Long shots (`docs/media/*`). Skip Santorini landmark claim.  
- Boss card: `06-boss-dasher.png`.

### (6) Play CTA + credits footer

- Big CTA → origin play (no auto).  
- Footer **bắt buộc** CC-BY mailbox + optional CC0 Warped City / Eiffel / Fusion Pixel OFL.  
- Copy nguyên `CREDITS.txt` (hoặc link). Ship `CREDITS.txt` cạnh landing.

---

## 5. `?auto=1` / localStorage — demo origin riêng

Từ `game.js`:

- `AUTO = params.get('auto')==='1'` → bot attract, bỏ title vào `play`.  
- **Không** ghi `np_career` / `np_story` / `np_skills` / `np_life` / `np_map` khi AUTO (guard `!AUTO`).  
- **Có ghi `np_hi`** ở `gameOver` (~L602) và `toTitle` — bot chết → ghi high score vào cùng origin.  
- Player **không takeover** được bot iframe (`?auto=1`).

**Rule landing:**

| Mục đích | URL | Origin |
|----------|-----|--------|
| Demo bot (attract) | `/index.html?auto=1&map=neon` | **`demo.` subdomain hoặc `/demo/` path khác origin** (vd. `demo.neonparcel.example` hoặc `neonparcel.example/demo/` served riêng storage) |
| Chơi thật | `/index.html` (no auto) | Origin chính / link trực tiếp |

**Cách host demo origin (gợi ý):**

1. Cloudflare Pages / Netlify: site phụ `demo-neon-parcel` trỏ subdomain `demo.…`, cùng build static copy của game.  
2. Hoặc path `/demo/` trên **hostname khác** (không đủ nếu cùng host — `localStorage` theo origin = scheme+host+port).  
3. Landing page origin thứ 3 chỉ embed iframe → demo; CTA “Chơi” `target=_blank` → play origin.

Không cần đào thêm `np_hi`.

---

## 6. A11y / perf / mobile

- `prefers-reduced-motion: reduce` → tắt Lenis smooth, tắt pin scrub phức tạp (static poster + fade đơn), **tắt hết neon flicker & scan pulse**.  
- Neon/CRT flash **< 3 lần/giây** (WCAG 2.3.1 Three Flashes).  
- CTA contrast đủ đọc trong **1 giây** trên bg neon (không phụ thuộc animation).  
- Target **Lighthouse mobile Performance ≥ 90**: lazy iframe, compress poster WebP/AVIF giữ pixelated nearest khi scale, GSAP CDN hoặc bundle tree-shake, không WebGL.  
- Touch: Lenis touch-friendly; pin section có fallback swipe gallery nếu pin nặng trên low-end.

---

## 7. Capture hero video / poster trên box

Game canvas 480×270. Quy trình headless trên box (không đụng repo game — clone RO hoặc serve copy):

```bash
# 1) Serve read-only tree
cd /workspace/neon-parcel-ro && python3 -m http.server 8765

# 2) Playwright / Puppeteer record (cài nếu thiếu)
npx --yes playwright install chromium
node <<'JS'
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:8765/index.html?auto=1&map=neon', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // poster
  await page.locator('#game').screenshot({ path: '/workspace/neon-parcel-landing/hero-poster.png' });
  // short WebM via CDP Page.startScreencast hoặc recordVideo:
  // relaunch context with recordVideo: { dir, size: {width:960,height:540} }
  const ctx = await browser.newContext({
    viewport: { width: 960, height: 540 },
    recordVideo: { dir: '/workspace/neon-parcel-landing/captures', size: { width: 960, height: 540 } }
  });
  const p2 = await ctx.newPage();
  await p2.goto('http://127.0.0.1:8765/index.html?auto=1&map=neon');
  await p2.waitForTimeout(8000);
  await ctx.close(); // flushes video
  await browser.close();
})();
JS

# 3) Transcode gọn (optional)
ffmpeg -y -i captures/*.webm -an -c:v libx264 -pix_fmt yuv420p -crf 28 \
  /workspace/neon-parcel-landing/hero-loop.mp4
```

Scale hiển thị chỉ **960×540 (2×)** hoặc **1440×810 (3×)** — integer của 480×270. Giữ `image-rendering: pixelated` trên `<video>` / poster `<img>`.

---

## 8. X signal (gần đây)

- Awwwards SOTD Agrumea: Three + **GSAP + Lenis** (ta **bỏ Three**, giữ GSAP+Lenis cho pixel).  
- Nhiều share “scroll-animation: GSAP, ScrollTrigger, Lenis” (Kiln skills, agency landings).  
- GSAP free + SplitText pinned scroll demos vẫn hot.  
→ Stack group chọn **khớp trend** mà đúng medium pixel 2D.

---

## 9. References (đã HTTP 200 lúc viết brief)

1. https://gsap.com/pricing/ — GSAP 100% free  
2. https://gsap.com/community/standard-license/ — Standard No Charge (gồm SplitText)  
3. https://gsap.com/docs/v3/Plugins/ScrollTrigger/  
4. https://gsap.com/docs/v3/Plugins/SplitText/  
5. https://webflow.com/updates/gsap-becomes-free — thông báo free 2025-04-30  
6. https://github.com/darkroomengineering/lenis — Lenis MIT  
7. https://lenis.darkroom.engineering/  
8. https://opengameart.org/content/warped-city — CC0 parallax  
9. https://opengameart.org/content/eiffel-tower — CC0 Eiffel  
10. https://opengameart.org/content/maibox-sprite-pack — CC-BY mailbox  
11. https://github.com/TakWolf/fusion-pixel-font — OFL font  
12. https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html — flicker ≤3/s  

---

## 10. Next (khi được lệnh build)

1. Scaffold `/workspace/neon-parcel-landing/` static (không commit vào `neon-parcel`).  
2. Copy assets + `CREDITS.txt` + font + OFL.  
3. Capture hero poster/video trên box.  
4. Implement 6 sections theo plan; demo iframe → demo origin.  
5. Lighthouse mobile + reduced-motion QA.

**Done =** brief này; chưa ship HTML.
