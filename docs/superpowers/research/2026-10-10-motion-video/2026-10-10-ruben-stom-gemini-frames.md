# Technical Breakdown: "Animate Insane Websites with AI" by Ruben Stom

---

## 1. Video Metadata & Thesis Summary

* **Title:** Animate Insane Websites with AI
* **Author / Channel:** Ruben Stom
* **Length:** 08:45 (525 seconds)
* **Thesis Summary (3 Lines):**
  1. What elevates a website from an ordinary layout to a high-end, premium experience is deliberate, well-executed motion that holds visitor attention and steers gaze.
  2. Rather than animating arbitrarily, designers building with AI should select motion with clear intent from five core archetypes ordered from subtle to dramatic (Reveal, Parallax, Intro/Loading, Travel, Video) using structured, multi-part prompt formulas.
  3. Achieving award-quality web animation requires strict engineering discipline: omitting motion on dense layouts, disabling parallax on mobile viewports, compressing media to display dimensions, and replacing native video scrub seeking with canvas image sequences for 60fps responsiveness.

---

## 2. Chaptered Timeline

| Timestamp | Chapter Title | On-Screen Focus & Narrative Breakdown |
| :--- | :--- | :--- |
| **00:00 – 00:48** | **Intro** | Why motion makes websites feel premium; holding attention and directing user gaze; introduction of the five motion tiers ordered from subtle to dramatic; announcement of the Cadence resource. |
| **00:48 – 02:12** | **01 Reveal Animations** | Definition and mechanics; unmasking elements as they enter viewport; demos of Wipe Reveal, Scroll-Driven Text Reveal, Staggered Grid Fade-Up, and Full Section Slide-Over; when to avoid; 3-part prompt formula. |
| **02:12 – 03:26** | **02 Parallax** | Creating optical depth perception; Layered Parallax (Mount Fuji / Haruka), Side-by-Side Floating Gallery, and Inner-Frame Window Shift; spatial planning rules; mobile phone constraints (turning it off); prompting syntax. |
| **03:26 – 04:39** | **03 Loading and Intro Animations** | First-load entrance sequences; masking asset load overhead; Minimal Text Expansion vs. Photo Ring / Wreath Intro; site suitability (artistic vs. information-seeking); 3-part sequence prompt and the two cardinal rules (under 3s, first visit only). |
| **04:39 – 06:12** | **04 Travel Animations** | Paths from point A to point B; bird's-eye portfolio overviews; 3D Perspective Plane ("Fieldnotes"), Camera Fly-Through, Concentric Orbital Rings, and 3D Spherical Meshes (exterior & interior views); payload bottlenecks and image optimization prompts. |
| **06:12 – 07:54** | **05 Video Animations** | The pinnacle of cinematic web design; playback triggers (on load, on click, on scroll); Sable concert grand piano unveil; Kova mechanical keyboard exploded 3D view; Apple iPhone 16 Pro camera orbit reference; Seedance 2.5 Start/End Frame chaining (Aura headphones); Lume sneaker unboxing; video markup, WebM/MP4 dual delivery, and Image Sequence vs. Video scrubbing comparison. |
| **07:54 – 08:25** | **Outro & Cadence Resource** | Walkthrough of Cadence (`cadence.rubenstom.com`), a free library of 100+ copyable web animations with prompts and code; card hover interactions and copy buttons. |
| **08:25 – 08:45** | **Thank You! / End Screen** | Call to subscribe for weekly videos on AI design workflows; video recommendations; sign-off. |

---

## 3. Exhaustive Analysis of Every Animation & Interaction Technique Shown

### Tier 1: Reveal Animations (`00:48 – 02:12`)

#### A. Horizontal Wipe Reveal
* **Timestamp:** `01:03 – 01:17`
* **Trigger:** Scroll (triggered the moment the section / card boundary crosses the viewport threshold).
* **On-Screen Motion Description:**
  * *What moves:* A rectangular clipping mask unmasks portrait photographs (men in coats, fashion editorial "Atelier").
  * *Direction:* Strictly horizontal, from left to right (`Wipe right`).
  * *Distance:* 100% of the image element's bounding width.
  * *Timing & Duration:* ~0.8s – 1.0s.
  * *Easing Feel:* Smooth ease-out (`cubic-bezier(0.25, 1, 0.5, 1)` or `power2.out`). Starts briskly as the element enters view, decelerating gently to reveal the final right edge.
* **How It Is Built (Shown / Stated):**
  * *Prompt Structure:* Requires 3 inputs: `01 Type` (Wipe), `02 Direction` (Wipe right / from left to right), `03 Elements` (Every image on the page).
  * *Prompt Transcribed Verbatim (`02:00 – 02:10`):*
    > `"Add a wipe reveal, from left to right, to every image on the page."`
  * *Implementation Mechanism:* CSS `clip-path: inset(0 100% 0 0)` interpolating to `clip-path: inset(0 0% 0 0)` or an overlapping container div unmasking via `overflow: hidden`, triggered via ScrollTrigger or IntersectionObserver.
* **Core Principle:** Creates curiosity and rewards the act of scrolling by revealing content progressively along natural western reading direction (left to right) rather than popping into view statically.

#### B. Scroll-Driven Text Reveal (Word / Line Illumination)
* **Timestamp:** `01:18 – 01:27`
* **Trigger:** Scroll position (continuous scrub tied to scroll progression).
* **On-Screen Motion Description:**
  * *What moves:* Paragraph typography on a dark background under header `TEXT REVEAL ANIMATION`. Text reads: *"Cadence is a collection of motion for the web, gathered slowly and rebuilt with care... Good motion is rarely loud... Every piece here begins as something seen and admired..."*
  * *Direction:* No spatial displacement (X/Y translation is 0); purely chromatic/luminescence progression from top line to bottom line.
  * *Distance:* Progresses line-by-line down the typographic stack.
  * *Timing & Duration:* 1:1 coupling with user scroll delta.
  * *Easing Feel:* Linear scrubbing directly tethered to scroll wheel / trackpad momentum.
* **How It Is Built (Shown / Stated):**
  * *Prompt Stated:* `"a text reveal as you scroll"`
  * *Implementation Mechanism:* Text parsed into lines/words (e.g., via `SplitText` or span wrappers). Opacity or color transitions from muted dark grey (`rgba(255,255,255,0.2)`) to brilliant white (`#ffffff`) tied to scroll position (e.g. GSAP ScrollTrigger `scrub: true` or CSS scroll-driven `animation-timeline: view()`).
* **Core Principle:** Pulls visitor focus directly to the line being read, preventing cognitive overwhelm caused by dense text blocks, while maintaining an understated, quiet editorial cadence.

#### C. Staggered Grid Fade-Up
* **Timestamp:** `01:27 – 01:35`
* **Trigger:** Scroll (section entering viewport).
* **On-Screen Motion Description:**
  * *What moves:* Multi-column gallery grid items on a cream background (*"Photographs from the north coast, made slowly between 2024 and 2026."*).
  * *Direction:* Vertical translation upward (+Y to 0).
  * *Distance:* Subtle translation (~24px to 36px).
  * *Timing & Duration:* Each item animates for ~0.6s, with a ~0.1s stagger delay between successive column/row items.
  * *Easing Feel:* Soft ease-out deceleration (`power2.out`).
* **How It Is Built (Shown / Stated):**
  * *Author Narration:* *"Here every thumbnail fades up one after the other, which easily turns an ordinary grid into something you actually want to scroll through."*
  * *Implementation Mechanism:* CSS transition-delay or GSAP `stagger: 0.1` animating `opacity: 0 -> 1` and `transform: translateY(30px) -> translateY(0px)`.
* **Core Principle:** Introduces choreography and visual rhythm to static layouts; guides the eye diagonally across the grid instead of hitting the viewer with visual clutter all at once.

#### D. Full Section Slide-Over (Sheet Stacking)
* **Timestamp:** `01:35 – 01:46`
* **Trigger:** Scroll.
* **On-Screen Motion Description:**
  * *What moves:* An entire full-viewport section on the "Studio Monet" tennis editorial site.
  * *Direction:* Vertical translation upward.
  * *Distance:* 100vh (full screen height).
  * *Timing & Duration:* Linked to 100vh of scroll distance.
  * *Easing Feel:* Direct scroll pinning / stacking context.
* **How It Is Built (Shown / Stated):**
  * *Author Narration:* *"And this one is less subtle as it slides an entire section up and over the previous one. But another interesting use case of the animation, where I don't just use it for a single element, but for an entire section."*
  * *Implementation Mechanism:* CSS `position: sticky; top: 0` or GSAP ScrollTrigger pinning with layered `z-index`.
* **Core Principle:** Architectural elevation; creates dramatic spatial depth between site chapters, reminiscent of turning physical editorial pages or stacking tactile cards.

---

### Tier 2: Parallax Animations (`02:12 – 03:26`)

#### A. Layered Multi-Speed Parallax
* **Timestamp:** `02:30 – 02:43`
* **Trigger:** Scroll.
* **On-Screen Motion Description:**
  * *What moves:* Three distinct visual planes on the "HARUKA" Mount Fuji dawn collection hero:
    1. Background plane: Mount Fuji landscape, morning sky, sunrise clouds, lake.
    2. Midground plane: Massive serif typography spanning the sky (`HARUKA`).
    3. Foreground plane: Detailed 3D hot air balloon floating across the mountain peak.
  * *Direction:* Vertical translation (+Y).
  * *Distance / Velocity Ratios:*
    - Foreground hot air balloon moves fastest (e.g. 1.2x – 1.4x relative velocity).
    - Typography moves at intermediate speed (0.6x – 0.8x).
    - Mountain background moves slowest (0.2x – 0.3x).
  * *Timing:* Continuous across the scroll travel of the hero section.
  * *Easing Feel:* Damped inertia, silky editorial glide.
* **How It Is Built (Shown / Stated):**
  * *Prompt Transcribed Verbatim (`03:19 – 03:26`):*
    > `"Add a parallax effect to the images in the hero section."`
  * *Implementation Mechanism:* Independent `translateY` transforms applied to each layer calculated from `window.scrollY * layerSpeed`, or GSAP ScrollTrigger with `scrub: 1`.
* **Core Principle:** Exploits human stereoscopic depth cues (motion parallax); instantly creates an expensive, three-dimensional physical stage out of flat 2D photography.

#### B. Side-by-Side Floating Gallery
* **Timestamp:** `02:43 – 02:55`
* **Trigger:** Scroll.
* **On-Screen Motion Description:**
  * *What moves:* Two staggered parallel columns of photography ("Linen Hour", "Chalk Coast", "Camel Coat", "Olive Grove") separated by expansive negative space.
  * *Direction:* Vertical translation (+Y).
  * *Distance:* The left and right columns scroll at differential speeds (e.g., Column A at 1.0x, Column B at 1.35x).
  * *Timing:* Continuous during document scroll.
  * *Easing Feel:* Weightless, floating, uncoupled momentum.
* **How It Is Built (Shown / Stated):**
  * *Author Narration:* *"Another version is where images float next to each other, also in different speeds. And this is actually one of my favorite effects. It gives a very calm and minimal feel to your site. Perfect for showcasing a few projects you worked on..."*
* **Core Principle:** Deconstructs rigid, predictable grid geometry into an organic, floating editorial stream that emphasizes whitespace and luxury minimalism.

#### C. Inner-Frame Image Shift (Window / Aperture Parallax)
* **Timestamp:** `02:56 – 03:03`
* **Trigger:** Scroll.
* **On-Screen Motion Description:**
  * *What moves:* Photographs inside rectangular cards ("Lighthouse", "Lavender House", "Linen Dress", "Camel Coat").
  * *Direction:* The outer card container moves at normal page speed, while the photograph inside translates vertically in reverse/differential speed within its clipped container.
  * *Distance:* ~40px to 60px of internal translation.
  * *Timing:* Tied to the card entering, traversing, and leaving the viewport.
  * *Easing Feel:* Looking through a physical window or camera lens.
* **How It Is Built (Shown / Stated):**
  * *Author Narration:* *"Or an image that moves inside its own frame. And this is probably the most subtle one. It kind of feels as if you are looking through a window or something."*
  * *Implementation Mechanism:* Outer container styled with `overflow: hidden`; inner `<img>` styled with `height: 120%; top: -10%` and translated along Y via ScrollTrigger.
* **Core Principle:** Adds internal kinetic energy to standard rectangular card grids without altering external page layouts or margins.

---

### Tier 3: Loading & Intro Animations (`03:26 – 04:39`)

#### A. Minimal Text Tracking Expansion
* **Timestamp:** `03:40 – 03:44`
* **Trigger:** Page load (initial session landing).
* **On-Screen Motion Description:**
  * *What moves:* Central logotype "CADENCE".
  * *Direction:* Horizontal expansion outward from center.
  * *Distance:* Letter-spacing expands from tight tracking (`-0.05em`) outward to wide tracking (`+0.25em`).
  * *Timing & Duration:* ~1.0s to 1.5s total duration before fading into the hero state.
  * *Easing Feel:* Controlled, elegant ease-out.
* **How It Is Built (Shown / Stated):**
  * *Author Narration:* *"You can for example, add a short and subtle text animation like this one, or go wild and add a more playful animation..."*
* **Core Principle:** Immediate typographic identity establishment with zero visual bloat and negligible file payload.

#### B. Photo Ring / Circular Wreath Intro & Handover
* **Timestamp:** `03:44 – 03:57` & `04:22 – 04:36`
* **Trigger:** Page load (strictly constrained to the visitor's first session visit).
* **On-Screen Motion Description:**
  * *Step 1 (Appears First):* A single solitary photo thumbnail fades into the viewport center (`0.0s – 0.5s`).
  * *Step 2 (How It Moves):* Multiple photo cards blossom/unfold outward radially from the center point into an orbiting circular ring of images surrounding the central "Cadence" logotype. The ring rotates slowly (`0.5s – 2.2s`).
  * *Step 3 (Handover):* The photo wreath expands outward beyond the screen bounds and dissolves into opacity: 0, seamlessly revealing the primary homepage layout ("Quiet motion, carefully made", "Project: Olive Grove") (`2.2s – 2.9s`).
  * *Duration:* Exactly under 3 seconds (UI slider specifies `2.9s`).
  * *Easing Feel:* Cinematic blooming ease-in-out followed by a soft dissolve.
* **How It Is Built (Shown / Stated):**
  * *Sequence Prompt Formula:* 01 Appears First, 02 How it moves, 03 Hands over.
  * *UI Input Feature:* Author attaches an image screenshot of the target state directly inside the prompt box!
  * *Prompt Transcribed Verbatim (`04:22 – 04:36`):*
    > `"Fade in one photo, unfold the photos into a ring, then hand over to the home page. Keep it under 3 seconds and only show it on the first visit."`
  * *Two Mandatory Implementation Rules:*
    1. `01 KEEP IT SHORT`: Hard limit under 3 seconds (shown at 2.9s).
    2. `02 FIRST VISIT ONLY`: Uses `localStorage` or session cookie check so returning visitors land straight on the page without delay.
* **Core Principle:** Creates an artistic prologue that captures visitor imagination while gracefully masking background asset loading (hero videos, web fonts, high-res textures).

---

### Tier 4: Travel Animations (`04:39 – 06:12`)

#### A. 3D Perspective Plane ("Field of Photographs")
* **Timestamp:** `04:48 – 04:58`
* **Trigger:** Continuous ambient flight / scroll navigation.
* **On-Screen Motion Description:**
  * *What moves:* Dozens of photography tiles on site "Fieldnotes - A field of photographs".
  * *Direction:* Tilted along the 3D X-axis; viewpoint glides forward over the ground plane toward the horizon.
  * *Timing:* Continuous gentle glide.
  * *Easing Feel:* Weightless drone / bird's-eye camera pass.
* **How It Is Built (Shown / Stated):**
  * CSS 3D transforms (`perspective: 1000px; transform: rotateX(60deg) translateY(...)`) or WebGL camera plane.

#### B. Camera Fly-Through / Z-Axis Travel
* **Timestamp:** `04:58 – 05:08`
* **Trigger:** Continuous ambient motion.
* **On-Screen Motion Description:**
  * *What moves:* Image cards emerge from the deep center vanishing point and accelerate forward along the Z-axis toward the user, scaling up until they fly past the viewport margins.
* **How It Is Built (Shown / Stated):**
  * *Prompt Concept:* `"images travel towards the website visitor"`

#### C. Concentric Orbital Rings & Infinite 3D Spiral
* **Timestamp:** `05:08 – 05:22`
* **Trigger:** Continuous ambient rotation or scroll.
* **On-Screen Motion Description:**
  * Multiple image thumbnails orbiting in circular or spiral tracks around a central branding focal point.
* **How It Is Built (Shown / Stated):**
  * *Prompt Structure:* Requires Path (`Orbiting circle` / `Infinite spiral`) and Speed & Direction (`Gentle, continuous` / `Tied to the scroll`).
  * *Prompt Transcribed Verbatim (`05:55 – 06:04`):*
    > `"Move the photos along an orbiting circle, in a gentle, continuous motion."`

#### D. 3D Spherical Meshes (Exterior Orbit vs. Interior 360° Panorama)
* **Timestamp:** `05:25 – 05:38`
* **Trigger:** Continuous ambient orbit, interactive mouse/drag.
* **On-Screen Motion Description:**
  * *Exterior View (`05:25`):* Site "CLARES". Photos mapped onto the spherical surface of an invisible 3D globe rotating in space.
  * *Interior View (`05:31`):* The camera is placed *inside* the center of the sphere; images orbit all around the visitor in 360 degrees.
* **How It Is Built (Shown / Stated):**
  * WebGL/Three.js spherical coordinates `(r, θ, φ)`.
  * *Optimization Prompt Transcribed Verbatim (`06:04 – 06:12`):*
    > `"Compress the images and resize them to the size they show on screen."`
    *(Shown on screen: `photo-06.jpg` compressed from 1.2 MB / 4000x5000px down to 180 KB – 210 KB).*
* **Core Principle:** Overcomes the flat 2D viewport constraint, turning large multi-project portfolios into tactile 3D art installations.

---

### Tier 5: Video Animations (`06:12 – 07:54`)

#### A. Cinematic Hero Video Unveil (Sable Concert Grand Piano)
* **Timestamp:** `06:15 – 06:33`, `07:25 – 07:44`
* **Trigger:** Three distinct modes demonstrated:
  1. `01 ON LOAD`: Video auto-plays immediately upon initial page render.
  2. `02 ON A TRIGGER`: User clicks interactive UI element (e.g. `[ Unveil ]` button).
  3. `03 ON SCROLL`: Scrubbed forward and backward via scroll delta.
* **On-Screen Motion Description:**
  * *Scene:* A cracked-earth desert expanse under sunrise light. A full concert grand piano is concealed under a billowing black silk shroud.
  * *Unveiling Action:* The silk fabric catches the wind and pulls back from left to right, rippling into the sky and unveiling the glossy piano.
  * *Handover / Settle:* The video smoothly docks into a dedicated visual container on the left half of the viewport, while the product typography ("Model 01 Concert Grand / Made for open air", specs "274 cm length, 88 keys, 480 kg weight", buttons "Book a hearing", "Listen") fades into the right half of the screen.
* **How It Is Built (Shown / Stated):**
  * Generated with **Seedance 2.5**.
  * *Prompts Transcribed Verbatim (`07:34 – 07:41`):*
    1. On Load: `"Add the piano video to the hero and play it as the page loads."`
    2. On Click / Trigger: `"Add the piano video to the hero and play it when Unveil is clicked. Optimize the files for the web."`
  * *Exact HTML Code Snippet Shown Verbatim on Screen (`07:45`):*
    ```html
    <video autoplay muted playsinline>
      <source src="piano.webm" type="video/webm">
      <source src="piano.mp4" type="video/mp4"> <!-- the fallback -->
    </video>
    ```
  * *Compression Architecture Shown on Screen (`07:42`):*
    - Master original: `piano.mp4` (1920 × 1080 · 10s · 41.8 MB)
    - Primary Web format: `piano.webm` (1280 × 720 · VP9 · 0.83 MB) — Chrome, Firefox, Edge (98% compression!)
    - Legacy fallback: `piano.mp4` (1280 × 720 · H.264 · 1.3 MB) — Safari, older browsers

#### B. Mechanical Keyboard 3D Exploded-View Assembly (Kova One)
* **Timestamp:** `06:33 – 06:44`
* **Trigger:** Scroll scrub / trigger.
* **On-Screen Motion Description:**
  * Site "Kova - Kova One - Built in layers."
  * CNC aluminum case, PCB plate, mechanical switches, and keycaps separate vertically into an exploded technical diagram in studio lighting, then reassemble as scroll progresses.

#### C. Camera Orbit Scrubbing (Apple iPhone 16 Pro Reference)
* **Timestamp:** `06:44 – 06:50`
* **Trigger:** Scroll scrubbing.
* **On-Screen Motion Description:**
  * Reference URL: `apple.com/iphone-16-pro`. Extreme macro orbit around the triple-lens camera housing ("Eye-opening control."). Forward scroll sweeps around lenses; scrolling up rewinds.

#### D. Multi-Section Video Chaining via Start/End Frame Matching (Aura One Headphones)
* **Timestamp:** `06:50 – 07:11`
* **Trigger:** Scroll through multi-section document flow.
* **On-Screen Motion Description:**
  * Site "Aura - Aura One - Sound, shaped in aluminium."
  * *Section 1 (The Hero):* Video 1 plays full headphones turntable rotation, landing on `End frame 1`.
  * *Section 2 (The Design):* Video 2 starts at `Start frame 2` (which is strictly identical to `End frame 1`), panning into extreme macro of the headband brush finish: *"Brushed by hand. One band of aluminium, from the crown to the cup, finished by hand."* Lands on `End frame 2`.
  * *Section 3 (Pre-Order):* Video 3 starts at `Start frame 3` (`= End frame 2`), transitioning to purchase CTA.
* **How It Is Built (Shown / Stated):**
  * Generated with **Seedance 2.5**.
  * Chaining formula: `End Frame (Video N) === Start Frame (Video N+1)`.
* **Core Principle:** Bridges continuous cinematic CGI with responsive web document layouts without visible seams or jump cuts.

#### E. Unboxing Cinematic Ritual (Lume Sneaker)
* **Timestamp:** `07:11 – 07:25`
* **Trigger:** Trigger / Load.
* **On-Screen Motion Description:**
  * Site "Lume - Made to be unwrapped." Satin ribbons untie, matte black box opens, golden interior light blooms, and a luxury white sneaker floats out on a glowing pedestal (€160).

#### F. Scroll-Scrubbing Implementation: Native Video vs. Image Sequence
* **Timestamp:** `07:44 – 07:54`
* **Trigger:** Continuous scroll scrubbing.
* **On-Screen Demonstration & Direct Technical Comparison:**
  * *Left Demo (Native Video Seeking) — RED 'X' BADGE:*
    - Label: `frame 097` / `frame 145`
    - Subtitle: `Video file · seeks to the frames it can`
    - Failure mechanism: HTML5 `<video currentTime = ...>` cannot decode non-keyframes instantly at 60fps, resulting in dropped frames, stutter, and perceptible seek latency.
  * *Right Demo (Image Sequence Canvas) — GREEN CHECKMARK BADGE:*
    - Label: `frame 100` / `frame 150`
    - Subtitle: `Image sequence · every frame drawn`
    - Technical implementation: Video rendered out into a sequence of 241 individual WebP frames (`frame-001.webp` to `frame-241.webp`, total weight 13.3 MB). Drawn directly to an HTML5 `<canvas>` via `ctx.drawImage()`, guaranteeing silky-smooth 60fps scrubbing with zero frame dropping.

---

## 4. Complete Inventory of Sites, Studios, Designers & Tools Named or Shown

| Entity / Project Name | Timestamp | Context & Description in Video |
| :--- | :--- | :--- |
| **Ruben Stom** | `00:00 – 08:45` | Creator, designer, presenter, and author of Cadence. |
| **Cadence (`cadence.rubenstom.com`)** | `00:08`, `00:33`, `01:19`, `03:42`, `05:10`, `07:54 – 08:20` | Ruben's comprehensive web animation resource containing 100+ copyable animations with prompts and code. |
| **ARIN** | `00:12`, `00:15`, `02:22` | Minimal fashion/editorial site mockup shown during intro and Parallax chapter preview. |
| **Atelier** | `01:05, 01:13, 08:00` | Fashion editorial site mockup used for the Static vs. Wipe Reveal demo. |
| **Studio Monet** | `01:36 – 01:46` | Tennis editorial brand site mockup used for the Full Section Slide-Over demo. |
| **HARUKA** | `02:30 – 02:43` | Japanese dawn collection site ("First light on Fuji", Mount Fuji, hot air balloon) demonstrating Layered Parallax. |
| **HOLM** | `02:23` | Minimal lifestyle/architecture site mockup shown in Parallax overview. |
| **ASENVER** | `02:25` | Minimal editorial site with hanging mobile sculpture mockup in Parallax overview. |
| **STILL** | `02:20` | Minimal editorial lake pier mockup in Parallax overview. |
| **Linen Hour / Chalk Coast / Lavender House / Linen Dress / Camel Coat / Lighthouse / Olive Grove** | `02:44 – 03:03` | Editorial cards used in Floating Gallery and Inner-Frame Parallax demos. |
| **Fieldnotes ("A field of photographs")** | `04:48 – 04:58` | Photography exhibition site mockup demonstrating 3D perspective plane travel. |
| **Paul Hamilton ("Selected Works")** | `05:15 – 05:22` | Architectural portfolio site mockup shown in Travel animation chapter. |
| **CLARES** | `05:25 – 05:38` | Luxury fashion site mockup used for the 3D Sphere Surface and Interior Sphere travel demos. |
| **Sable ("Model 01 Concert Grand")** | `06:15 – 06:33`, `07:25 – 07:50` | Concert grand piano brand mockup ("Made for open air") used for Video reveal and scrubbing demos. |
| **Kova ("Kova One")** | `06:33 – 06:44` | Mechanical keyboard mockup ("Built in layers") used for the 3D exploded view video animation. |
| **Apple (`apple.com/iphone-16-pro`)** | `06:44 – 06:50` | Real-world industry benchmark cited and shown for product camera orbit scroll scrubbing. |
| **Seedance 2.5** | `06:52`, description | AI video generation model explicitly named by Ruben used to generate all 3D CGI product video clips with matched start/end frames. |
| **Aura ("Aura One")** | `06:56 – 07:11` | Over-ear aluminum headphones mockup ("Sound, shaped in aluminium") demonstrating multi-section video chaining. |
| **Lume** | `07:11 – 07:25` | Designer sneaker mockup ("Made to be unwrapped") demonstrating cinematic unboxing. |
| **Claude Code** | Video description tags (`#claudecode`) | AI coding assistant referenced in tags. |
| **VP9 / WebM / H.264 / MP4 / WebP** | `07:41 – 07:52` | Web media codecs and formats specified for video compression and image sequence frames. |
| **Chrome, Firefox, Edge, Safari** | `07:42` | Browser compatibility targets specified for WebM vs. MP4 video fallback. |
| **Named Cadence Animation Cards** | `07:55 – 08:05` | Specific named components on Cadence: *Scroll Text Reveal, Telescope Zoom, Infinite Scroll Transition, Courtyard, Split Image Loader, Panning Slideshow, Opposing Carousel, Field Flight, Orbit Loader, Parallax Carousel, Thread Slider, Pushing Video Carousel, Typewriter*. |

---

## 5. Typography-Specific Techniques Breakdown

### A. What the Video Explicitly Shows and States
1. **Scroll-Driven Text Illumination (`01:18 – 01:27`):**
   - Text remains stationary in document flow while its luminescence/color shifts from dimmed grey to bright white as the user scrolls.
   - Ruben states: *"I like to animate text. So in this case, I prompted for a text reveal as you scroll and it pulls your attention straight to it. But it also stays subtle."*
2. **Minimal Tracking / Letter-Spacing Expansion (`03:40 – 03:44`):**
   - Brand name "CADENCE" expands outward from tightly condensed tracking to wide letter-spacing over ~1.2s before fading into the hero state.
   - Ruben states: *"add a short and subtle text animation like this one..."*
3. **Typewriter Effect on Cadence (`08:00` / Card on Cadence):**
   - Card titled `Typewriter` (tag: `TEXT`) displaying the phrase *"Motion for quiet portfolios"*, simulating sequential character typing.
4. **Typographic Parallax Sandwich (`02:30 – 02:43`):**
   - On the "HARUKA" site, giant serif typography sits between a background mountain plane and a foreground hot air balloon plane, translating at an independent velocity ratio to create spatial depth.

### B. Technical Engineering Separation *(Labeled as Technical Analysis / Opinion)*
* **Observation:** The video focuses on prompt formulations rather than raw JavaScript libraries.
* **Under-the-Hood Web Implementation:**
  - *Text Splitting:* To achieve the scroll illumination shown at `01:22`, production engines split paragraph blocks into individual word or line spans (e.g. GSAP `SplitText` or CSS `inline-block` wrappers). Each span's opacity or `color` is scrubbed via ScrollTrigger or CSS scroll-driven animations (`animation-timeline: view()`).
  - *Typographic Masks:* For sliding text reveals (e.g., words sliding up from invisible baselines), parent line containers require `overflow: hidden`, with internal text spans animating `transform: translateY(100%) -> translateY(0%)`.
  - *Variable Font Interpolation:* While Ruben adjusts letter-spacing, modern variable fonts can simultaneously interpolate `font-weight`, `font-stretch`, or optical sizing (`font-variation-settings: 'wght' 300 -> 700`) during intro expansions.

---

## 6. Performance, Accessibility, and Mobile Guidance

### A. Performance Guidelines (Stated & Shown)
1. **Density Restraint (`01:46 – 01:54`):**
   - Never add reveal animations to sites that are already visually dense. When every element moves, visual hierarchy collapses into chaotic noise.
2. **Bounce Rate Risk of Intro Loaders (`04:01 – 04:16`):**
   - Every additional second of waiting increases bounce rates. Avoid loading intros on utility or information-seeking sites (such as restaurant menus). Restrict intro loaders to artistic/portfolio projects where the intro is an intentional part of the brand experience.
3. **The 3-Second Hard Ceiling (`04:31`):**
   - Intro animations must be kept under 3 seconds (explicitly set to 2.9s in the UI).
4. **Travel Animation Image Optimization (`05:38 – 05:51`):**
   - **Never put videos inside travel animations**—the composite bandwidth and GPU strain will crash frame rates.
   - Always prompt AI to optimize images: compress files and downscale their physical pixel dimensions to match display bounding boxes (demonstrated dropping `photo-06.jpg` from 1.2 MB / 4000x5000px down to 180 KB).
5. **Modern Dual-Codec Video Delivery (`07:36 – 07:44`):**
   - Raw video files (e.g., 41.8 MB) must be compressed into 720p WebM (VP9, 0.83 MB — a 98% reduction) for modern browsers, paired with an H.264 MP4 fallback (1.3 MB) for Safari.
6. **Canvas Image Sequences for Scroll Scrubbing (`07:44 – 07:54`):**
   - Native `<video>` scrub seeking causes severe frame dropping and seek latency because browsers cannot decode inter-frame keyframes instantaneously. Convert videos into compressed WebP image sequences (e.g. 241 frames, 13.3 MB total) drawn directly onto an HTML5 `<canvas>` for guaranteed 60fps performance.

### B. Mobile Screen Constraints (Stated & Shown)
1. **Disable Parallax on Mobile (`03:03 – 03:17`):**
   - Parallax fundamentally requires surrounding whitespace ("room to travel"). Because mobile screens are compact and narrow, parallax must almost always be disabled on phones (`PARALLAX OFF`) to prevent cramped layouts and erratic overflow.

### C. Accessibility & Reduced Motion *(Labeled as Best-Practice Analysis / Opinion)*
* **Video Fact:** The narration does not explicitly mention the `@media (prefers-reduced-motion)` CSS media query.
* **Production Best Practice:** On commercial websites utilizing intense 3D orbital travel, camera fly-throughs, or fullscreen video autoplay, accessibility compliance (WCAG 2.2 Criterion 2.3.3) requires wrapping animations in `prefers-reduced-motion: no-preference`. When reduced motion is requested, video autoplay should be disabled, 3D orbits should freeze at neutral angles, and parallax transforms should flatten to static document coordinates to prevent triggering vestibular disorders.

---

## 7. The Video's Rules & Checklist for "The Best Animation Website"

Transcribed directly from Ruben Stom's narration and UI guidelines:

1. **Animate with Intent, Not Everywhere:**
   *"Choose your animations with intent instead of adding motion everywhere."* On visually dense pages, omit motion—*"when everything moves, nothing stands out and it quickly becomes distracting."*
2. **Order Motion from Subtle to Dramatic:**
   Structure website motion along a deliberate spectrum: begin with universal, quiet touches (Reveals, Parallax) and reserve cinematic spectacles (Travel, Video) for flagship moments.
3. **Structure Reveal Prompts with Three Essentials:**
   Always declare: (1) Reveal Type (`fade`, `wipe`, `slide`), (2) Direction (`fade up`, `wipe right`, `slide down`), and (3) Target Elements/Scope.
4. **Provide Room for Parallax to Travel — and Disable on Mobile:**
   Parallax requires intentional whitespace buffer zones. On mobile devices where screen real estate is constrained, turn parallax off entirely.
5. **Contextualize Intro Animations:**
   Skip intro loaders on utility or information-first sites (e.g. restaurant menus). Reserve them strictly for artistic and entertainment experiences.
6. **Cap Intro Animations at Under 3 Seconds:**
   Intro animations must resolve within 3 seconds to avoid frustrating visitors and elevating bounce rates.
7. **Only Play Intro Loaders on First Visit:**
   Persist state (via cookies or localStorage) so returning visitors bypass the loader and land straight on the homepage.
8. **Compress and Downscale Multi-Image Travel Assets:**
   Never place videos inside 3D travel animations. Prompt AI agents to compress images and resize them to their exact rendered display dimensions.
9. **Chain Video Sections via Matched Start and End Frames:**
   When scripting multi-section video workflows in tools like Seedance 2.5, ensure the end frame of video N is strictly identical to the start frame of video N+1 for seamless handoffs.
10. **Dual-Format Video Delivery for Web:**
    Deliver video via compressed WebM (VP9) for modern engines with an MP4 (H.264) fallback for Safari and legacy browsers.
11. **Scrub Image Sequences on Canvas, Never Raw Video:**
    For scroll-driven video playback, render frames into a compressed WebP image sequence drawn to canvas to avoid native video seek lag and guarantee 60fps responsiveness.

---

## 8. Detailed Breakdown of the Cadence Website (`cadence.rubenstom.com`)

Shown during the video conclusion (`07:54 – 08:20`):

* **Website Identity:**
  - URL: `cadence.rubenstom.com`
  - Headline: **"Cadence"**
  - Subhead: *"100+ web animations, each with its prompt and its code. Free."*
  - CTA Button: Black pill badge with link icon: `🔗 cadence.rubenstom.com`
* **Licensing & Usage:**
  - Free for both personal and commercial projects.
* **UI & Interaction Design:**
  - Clean, high-contrast monochrome aesthetic with subtle off-white backgrounds.
  - Interactive grid of motion cards showcasing live preview animations.
  - Hovering over any card reveals two interactive action pills at bottom right:
    - `[ COPY CODE ]`
    - `[ COPY PROMPT ]`
* **Featured Components Visible on Cadence:**
  - `Field Flight` (Categorized with tags: `PARALLAX · GRID-SET · BACKGROUND · CURSOR`)
  - `Orbit Loader` (Categorized with tags: `LOADING · GALLERY · TEXT`)
  - `Thread Slider` (Categorized with tags: `GALLERY · IMAGE · 3D`)
  - `Pushing Video Carousel` (Categorized with tags: `VIDEO · GALLERY`)
  - `Typewriter` (Categorized with tag: `TEXT` — previewing *"Motion for quiet portfolios"*)
  - `Scroll Text Reveal`
  - `Telescope Zoom`
  - `Infinite Scroll Transition`
  - `Courtyard`
  - `Split Image Loader`
  - `Panning Slideshow`
  - `Opposing Carousel`
  - `Parallax Carousel`
  - Horizontal bottom ribbon showcasing animated thumbnail previews (*Foggy car, Light staircase, Atelier portrait, "Motion, collected.", Olive Grove, portraits*).

---

## 9. Observations on Visibility and Audio Clarity

* **Audio Clarity:** 100% pristine studio recording. Ruben speaks clearly in English with zero distortion or background interference. A DJI wireless lapel transmitter is clipped to his black crewneck sweatshirt.
* **On-Screen Legibility:** UI cards, prompt input fields, and diagrams are rendered in crisp, large vector typography and remain 100% legible throughout.
* **Underlying Code Architecture:** Ruben deliberately presents motion design through natural-language AI prompts rather than showing a code editor or IDE terminal. However, the exact HTML5 video markup is displayed verbatim on screen, and the technical mechanics shown (canvas image sequences, WebM/MP4 dual delivery, clip-path unmasking, and scroll scrubbers) represent industry-standard GSAP, ScrollTrigger, and HTML5 Canvas patterns.
