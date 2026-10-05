---
format: 1920x1080
duration: 87s
message: "ทำแบบทดสอบสุขภาพสมอง Memory Garden ได้ง่าย ๆ ด้วยตัวเอง ทีละด่าน ใน 10–15 นาที"
arc: Demo Loop — question → product intro → start → 8-stage walkthrough → result → CTA
audience: ผู้สูงอายุ 60+ ครอบครัว/ผู้ดูแล อสม. และบุคลากรสาธารณสุขชุมชน
mode: autonomous
music: warm acoustic lo-fi nature, gentle and calm, soft guitar
language: th
---

## Video direction

- **palette system** — from `frame.md`: ground = `cream` #f7f9f4 with a soft `lavender` #f0f7e6 radial atmosphere + faint `yellow` #fdf3d0 warm-sun glow top-right; ink = `ink` #23350e; primary action/accent = `coral` #4a6b22 (primary green) and `lime` #82954b (olive) — the button gradient lime→coral; cards = `white` with 2px `outline` #355115 at ~20% opacity, radius 24, soft shadow; stage chips/tag pills = `lavender`/`sky` fills with `outline` stroke; gold for the 🎓 +1 badge only = `yellow` fill + #b7791f text. Risk colors (#2e7d32 / #d97706 / #c53030 and their tints) appear ONLY in Frame 11.
- **type** — `display` / `headline` / `section-headline` = Prompt 700–800 (ink, sentence case, never letter-spaced); UI text, buttons, chips, labels = Anuphan 500–600; minimum on-screen text 34px; numerals tabular. Thai line-height ≥ 1.3 so vowels/tone marks never clip.
- **app surface** — every app screen is a **phone-like app card** (≈ 540×960 on canvas, white glass, radius 36, soft shadow) rebuilt from `design.md`: stage header "ด่าน N/8" pill + 🔊 round green button, content area, a 56px pill primary button at the bottom. A short **headline + one-line caption** sits beside the card (asymmetric 60/40: text left, app card right, or mirrored) so the viewer reads the instruction while seeing the action. Interactions are shown by a **soft fingertip dot** (48px, white with green ring) + **touch ripple** (#82954b ring) — never a mouse cursor.
- **stage rail** — from Frame 5 to Frame 10 a thin 8-dot progress rail sits top-center (completed dots `coral`, current dot enlarged `lime`) — the continuity element across stages; it stays at the same position/scale in every stage frame (handoff constant).
- **motion grammar** — long-tail `power3.out` settles; spring overshoot ONLY on the two reward pops (🎓 +1 badge in F4, the "คะแนนเต็ม" badge in F8). Every piece reveals on its spoken cue; nothing front-loads. Leaves: 3–5 flat leaf shapes drift in on finite tweens only on F1, F2, F12 (garden bookends).
- **rhythm / held frames** — F2 and F12 are the calm, held brand beats; F9 is a deliberately sparse type beat (breather before the dense F10/F11); F11 is the climax (count-up). Other frames reveal to the VO and hold the last read.
- **negative list** — no mouse cursors / browser chrome; no hospital/clinical imagery, no red outside F11; no neon, no purple-blue AI gradients, no bokeh; no uppercase/tracked Thai; no infinite loops/breathing; no slideshow (front-load-then-freeze) and no screensaver (everything floating independently); content stays in the top ~83% (caption band clear).

## Frame 1 — ห่วงความจำ

- blueprint: kinetic-type-beats (Adapt)
- focal: ui:card — payoff line card
- roles: ui:card = supporting · 🌿🧠 = accent
- sfx: whoosh-soft, pop-soft
- scene: Big warm Thai type asks the question, then answers it — "เช็กสุขภาพสมองได้เองที่บ้าน"
- voiceover: "ช่วงนี้ขี้ลืมบ่อยไหมครับ… ลองเช็กสุขภาพสมองได้เองที่บ้าน ง่าย ๆ ทีละขั้นตอน"
- duration: 6s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Pain validation → friction reduction
- beat: anxiety → relief
- asset_candidates:
- ui_parts: ui:card — glass card holding the payoff line; emoji 🌿 🧠 as accents

narrativeRole: Speak to the viewer's quiet worry (forgetfulness) and immediately lower the bar — it's easy and done at home.
keyMessage: You can check your brain health yourself, gently.

Adapt: keep the statement-builds-across-beats spine landing a payoff; question beat → answer beat in a glass card, no hard-cut gag.
Scene 1 (0.0–2.4s): cream ground with lavender radial; 3 leaves drift in from the left edge on a slow finite tween. Center: "ช่วงนี้ขี้ลืมบ่อยไหมครับ?" in `headline` ink enters by **per-word staggered reveal** (`dynamic-content-sequencing`), centered upper-third, ~60% width.
Scene 2 (2.4–4.6s): the question lifts up and shrinks to a muted subtitle as a white glass card rises beneath it (`spring-pop-entrance`, smooth register) carrying "เช็กสุขภาพสมองได้เองที่บ้าน" in `section-headline` with 🧠 at left. Centered, card ~55% width.
Scene 3 (4.6–6.0s): "ง่าย ๆ ทีละขั้นตอน" chip pops under the card in `coral` fill/white text on the VO cue; a soft green glow fades in behind the card; hold still.

## Frame 2 — Memory Garden

- blueprint: logo-assemble-lockup (Adapt — parts-arrive, static frame)
- focal: ui:card — brand lockup
- roles: ui:primary-button = supporting
- sfx: chime-warm, pop-soft
- scene: The Memory Garden lockup blooms in with leaves; three pills: MoCA 30 คะแนน · 10–15 นาที · ทำตามจังหวะตัวเอง
- voiceover: "นี่คือ Memory Garden สวนความทรงจำ แบบคัดกรองตามเกณฑ์ MoCA 30 คะแนน ใช้เวลาแค่ 10 ถึง 15 นาที"
- duration: 6s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/02-intro.html
- type: product_intro
- persuasion: Authority by association (MoCA) + friction reduction
- beat: trust + ease
- asset_candidates:
- ui_parts: ui:card — brand lockup card; ui:primary-button — "เริ่มทำแบบทดสอบ"

narrativeRole: Name the product and land the promise (message) by beat 2 with its medical anchor.
keyMessage: Memory Garden is a medically grounded, short, self-paced screen.

Adapt: keep the mark-comes-to-exist lockup; the mark is a round green badge with 🌿 assembling from three leaves; no camera push.
Scene 1 (0.0–1.8s): three leaf shapes converge from off-frame (`center-outward-expansion` in reverse — outer→center) and settle into a round `coral` badge with 🌿; wordmark "Memory Garden" + "สวนความทรงจำ" reveals right of the badge by **per-word staggered reveal**. Centered lockup ~50% width, upper-middle.
Scene 2 (1.8–4.2s): as VO says "MoCA 30 คะแนน", pill 1 "🩺 เกณฑ์ MoCA 30 คะแนน" lands under the lockup; on "10 ถึง 15 นาที", pill 2 "⏱️ 10–15 นาที" lands beside it (`spring-pop-entrance`, smooth). Row centered below lockup.
Scene 3 (4.2–6.0s): pill 3 "🌱 ทำตามจังหวะตัวเอง" completes the row; held read — subtle jitter only (`sine-wave-loop` low amplitude) on the badge.

## Frame 3 — เริ่มด้วย LINE

- blueprint: cursor-ui-demo (Adapt — fingertip instead of cursor)
- focal: ui:card — app screen card (right 40%)
- roles: ui:primary-button = supporting (LINE login) · ui:tts-button = supporting
- sfx: pop-soft, chime-warm
- scene: Phone-sized app card: finger taps "เข้าสู่ระบบด้วย LINE" (touch ripple) → intro page; glow on the 🔊 button
- voiceover: "เริ่มจากกดเข้าสู่ระบบด้วย LINE แล้วอ่านคำชี้แจง ถ้าไม่สะดวกอ่าน กดปุ่มลำโพงฟังเสียงได้ทุกหน้า"
- duration: 7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-login.html
- type: feature_showcase
- persuasion: Show-don't-tell proof + friction reduction
- beat: ease + control
- asset_candidates:
- ui_parts: ui:card — app screen card; ui:primary-button — LINE login; ui:tts-button — 🔊

narrativeRole: First step of the demo loop — how to get in, and the reassurance that everything can be listened to.
keyMessage: One tap to start; every instruction can be read aloud.

Adapt: keep the driven-pointer-changes-UI-state spine with the camera holding a locked stage; pointer is a fingertip dot + touch ripple.
Scene 1 (0.0–2.6s): layout asymmetric 60/40 — left: headline "เริ่มต้นง่าย ๆ" + caption "เข้าสู่ระบบด้วย LINE"; right: app card shows Memory Garden welcome with a green "เข้าสู่ระบบด้วย LINE" pill button (#06C755 LINE green allowed on this button only). Fingertip glides in and taps the button → **cursor click + ripple** (`cursor-click-ripple`) + **button press** (`press-release-spring`).
Scene 2 (2.6–4.6s): card content swaps (crossfade inside the card) to the intro page: "คำชี้แจง" title, three short bullet rows reveal one by one; left caption swaps to "อ่านคำชี้แจงก่อนเริ่ม".
Scene 3 (4.6–7.0s): on "กดปุ่มลำโพง" the 🔊 button gets a **zoom-to-target** punch-in (`coordinate-target-zoom`, ~120%) with a soft glow ring and 3 soundwave arcs; left caption becomes "🔊 กดฟังเสียงได้ทุกหน้า"; hold.

## Frame 4 — กรอกข้อมูล

- blueprint: cursor-ui-demo (Adapt)
- focal: ui:card — form card (right 40%)
- roles: ui:primary-button = supporting (ถัดไป)
- sfx: pop-soft, ding-success
- scene: Form fields type themselves (ชื่อ · อายุ · เพศ · วุฒิการศึกษา); picking "ไม่เกิน ม.6" pops a gold 🎓 +1 คะแนน badge
- voiceover: "กรอกข้อมูลพื้นฐาน ถ้าเรียนไม่เกิน ม.6 ระบบจะบวกให้ 1 คะแนนตามเกณฑ์สากล"
- duration: 6s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-profile.html
- type: feature_showcase
- persuasion: Risk reversal (fairness adjustment)
- beat: clarity + fairness
- asset_candidates:
- ui_parts: ui:card — form card; ui:primary-button — ถัดไป

narrativeRole: Second step — the profile, and the one detail people must not skip (education bonus).
keyMessage: Fill basics; education ≤ 12 years gets +1.

Adapt: same locked stage + fingertip; the state change is fields filling and the reward badge.
Scene 1 (0.0–2.4s): left: headline "กรอกข้อมูลพื้นฐาน"; right: form card with 4 rows (ชื่อ · อายุ · เพศ · วุฒิการศึกษา). Rows fill one by one by **type-on** (`discrete-text-sequence`): "คุณสมศรี" · "68" · "หญิง".
Scene 2 (2.4–4.4s): fingertip taps the วุฒิการศึกษา row; option "ประถม – ม.6" highlights; a gold **🎓 +1 คะแนน** badge springs out of the row (`spring-pop-entrance`, the playful overshoot exception) and parks at the card's top-right corner; left caption: "เรียนไม่เกิน ม.6 ได้ +1 คะแนน".
Scene 3 (4.4–6.0s): "ถัดไป" button gets a press (`press-release-spring`); hold.

## Frame 5 — ด่าน 1 จดจำ 5 คำ

- blueprint: grid-card-assemble (Reproduce)
- focal: ui:card — five word cards
- roles: ui:tts-button = supporting
- sfx: pop-soft ×5, chime-warm
- scene: Stage rail "ด่าน 1/8"; five garden word cards spring in one by one (ดอกกุหลาบ · แมลงปอ · ม้านั่ง · สายรุ้ง · ตะกร้า) with pollen glow; 🔊 pulses
- voiceover: "ด่านแรก จำสิ่งของ 5 อย่างในสวน อ่านหรือกดฟังจนจำได้ เดี๋ยวจะถามอีกครั้งตอนท้าย"
- duration: 6s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/05-stage1-memorize.html
- handoff_out: stage-rail — top-center x=960 y=64, 8 dots 18px gap 22px, scale 1, opacity 1, static (no motion at cut)
- type: feature_showcase
- persuasion: Rule of five (concrete items) + foreshadowing
- beat: curiosity + calm
- asset_candidates:
- ui_parts: ui:card — 5 word cards; ui:tts-button — 🔊

narrativeRole: Enter the test itself; plant the five words the recall stage pays off.
keyMessage: Memorize five things — they come back later.

Scene 1 (0.0–1.6s): stage rail appears top-center (dot 1 current). Left: tag pill "ด่าน 1 · ความจำ" + headline "จำสิ่งของ 5 อย่าง". Right: an empty glass panel with 🔊.
Scene 2 (1.6–4.2s): on "5 อย่างในสวน", five word cards (🌹 ดอกกุหลาบ · 🐞→simple dragonfly line icon "แมลงปอ" · 🪑 ม้านั่ง · 🌈 สายรุ้ง · 🧺 ตะกร้า) cascade in a staggered column/grid (`waterfall-entry` cadence ≤0.5s total), each with a soft pollen glow.
Scene 3 (4.2–6.0s): 🔊 pulses once with soundwave arcs; caption "⏳ จะถามอีกครั้งตอนท้าย" fades in under the headline; hold.

## Frame 6 — ด่าน 2 วาดนาฬิกา

- blueprint: device-surface-showcase (Adapt — cursorless stepwise flow)
- focal: ui:canvas-clock — 320px canvas scaled up inside the app card
- roles: ui:primary-button = supporting
- sfx: pencil-draw, snap-click ×3, ding-success
- scene: "ด่าน 2/8" — a finger traces a glowing circle on the 320px canvas; numbers 1–12 snap onto the dial; hands swing to 11:10; three step pills tick ✓
- voiceover: "ด่านที่สอง วาดนาฬิกา สามขั้น วาดวงกลม วางเลข 1 ถึง 12 แล้วตั้งเข็มเป็น 11 นาฬิกา 10 นาที"
- duration: 8s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/06-stage2-clock.html
- handoff_in: stage-rail — top-center x=960 y=64, 8 dots 18px gap 22px, scale 1, opacity 1, static
- handoff_out: stage-rail — same position/scale/opacity, static
- type: feature_showcase
- persuasion: Show-don't-tell proof (step-by-step)
- beat: focus + satisfaction
- asset_candidates:
- ui_parts: ui:canvas-clock — drawing canvas; ui:primary-button — ส่งคำตอบนาฬิกา

narrativeRole: The most hands-on stage — show the three steps clearly so seniors aren't surprised.
keyMessage: Circle → numbers → hands.

Adapt: keep the held device surface whose screen steps through a real flow; three steps on one canvas, each ticking a step pill on the left.
Scene 1 (0.0–2.6s): rail dot 2 current. Left: "ด่าน 2 · วาดนาฬิกา" + three step pills stacked (① วาดวงกลม ② วางเลข 1–12 ③ ตั้งเข็ม 11:10), muted. Right card: blank canvas; on "วาดวงกลม" a fingertip traces a circle — **SVG self-draw** (`svg-path-draw`) in ink #2e4414 4px round cap; step ① turns ✓ green.
Scene 2 (2.6–5.2s): numbers 1–12 drop from a tray onto the dial one after another (fast stagger, each a tiny snap) — **snap & lock**; step ② ✓.
Scene 3 (5.2–8.0s): hour hand and minute hand rotate to 11:10 (`svg-icon-enrichment` rotate about dial center, power3); step ③ ✓; "ส่งคำตอบนาฬิกา" button glows; hold.

## Frame 7 — ด่าน 3–4 บอกชื่อ & พูดซ้ำ

- blueprint: comparison-split (Adapt)
- focal: ui:card — naming card (left) + ui:mic-panel (right)
- roles: both = supporting halves of the split
- sfx: ding-success, mic-on
- scene: Split stage: left "ด่าน 3/8" five object pictures get ✅ as names are tapped; right "ด่าน 4/8" a sentence fades away and the 🎙️ mic pulses with soundwaves as speech-to-text types in
- voiceover: "ด่านสาม ดูภาพแล้วบอกชื่อสิ่งของ ด่านสี่ ฟังประโยค แล้วกดไมค์พูดทวน หรือพิมพ์ตอบก็ได้"
- duration: 8s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/07-stage3-4-naming-repeat.html
- handoff_in: stage-rail — top-center x=960 y=64, 8 dots 18px gap 22px, scale 1, opacity 1, static
- handoff_out: stage-rail — same position/scale/opacity, static
- type: feature_showcase
- persuasion: Feature-to-benefit translation (choose voice or typing)
- beat: ease + control
- asset_candidates:
- ui_parts: ui:card — naming card; ui:mic-panel — listening state

narrativeRole: Two quick stages paired to keep pace; the benefit is choice — speak or type.
keyMessage: Name the pictures; repeat the sentence by voice or text.

Adapt: keep the two-cards-from-opposite-wings mirrored tilt entry + inner-edge badges; the cards are two stages, badges are "ด่าน 3" / "ด่าน 4".
Scene 1 (0.0–3.8s): rail dot 3 current. Left card enters from the left wing with mirrored tilt (`split-tilt-cards`): "ดูภาพ บอกชื่อ" — a row of 5 object icons (✂️ simple watering-can line icon "บัวรดน้ำ" 🏮 🍴 👓); as VO speaks, each gets a ✅ in sequence with its Thai name under it.
Scene 2 (3.8–8.0s): rail advances to dot 4; right card enters from the right wing: a sentence "ฉันชอบเดินเล่นในสวนตอนเช้า" fades out; a large 🎙️ mic button pulses with 3 expanding soundwave rings (finite) and the transcript types in (`discrete-text-sequence`); inner-edge badges pop: "ด่าน 3" left, "ด่าน 4" right; small chip "🎙️ พูด หรือ ⌨️ พิมพ์ ก็ได้" under the right card; hold.

## Frame 8 — ด่าน 5 บอกชื่อสัตว์

- blueprint: dataviz-countup (Adapt — single-instrument count-up)
- focal: ui:timer + word counter
- roles: ui:mic-panel = supporting
- sfx: mic-on, word-added ×6, ding-success
- scene: "ด่าน 5/8" — 60-second bar drains; animal chips (ช้าง · ม้า · วัว · เสือ · นก …) fly into the box; the word counter climbs to 11 and turns green "คะแนนเต็ม"
- voiceover: "ด่านห้า บอกชื่อสัตว์ให้มากที่สุดใน 60 วินาที ได้ 11 ชนิดขึ้นไป รับคะแนนเต็ม"
- duration: 7s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/08-stage5-animals.html
- handoff_in: stage-rail — top-center x=960 y=64, 8 dots 18px gap 22px, scale 1, opacity 1, static
- handoff_out: stage-rail — same position/scale/opacity, static
- type: feature_showcase
- persuasion: Statistical goal (11 = full marks)
- beat: excitement
- asset_candidates:
- ui_parts: ui:timer — 60s countdown; ui:mic-panel — mic on

narrativeRole: The only timed stage — make the goal concrete and the timer feel friendly.
keyMessage: As many animals as you can in a minute; 11 is full marks.

Adapt: keep the count-up hero instrument; the instrument is the word counter climbing to 11 beside a draining 60s bar; no camera push.
Scene 1 (0.0–2.0s): rail dot 5. Left: "ด่าน 5 · บอกชื่อสัตว์" + "⏱️ 60 วินาที". Right card: a full-width progress bar starts draining (`stat-bars-and-fills`, linear) with a "00:60" monospace readout ticking down; mic shows listening.
Scene 2 (2.0–5.2s): animal chips fly into the answer box one after another (🐘 ช้าง · 🐎 ม้า · 🐄 วัว · 🐅 เสือ · 🐦 นก · 🐟 ปลา …) while a big counter "คำที่ได้" counts 1 → 11 (`counting-dynamic-scale`).
Scene 3 (5.2–7.0s): at 11, a green "🏆 11 ชนิดขึ้นไป = คะแนนเต็ม" badge springs in (`spring-pop-entrance`, playful exception); hold.

## Frame 9 — ด่าน 6 ลบเลข 7

- blueprint: kinetic-type-beats (Adapt — in-place token cycle)
- focal: big numerals center
- roles: ui:card = supporting (math card)
- sfx: pop-soft ×5, ding-success
- scene: "ด่าน 6/8" — big numerals step 100 → 93 → 86 → 79 → 72 → 65, each result sliding into the next minuend; counter "ข้อ 1/5 → 5/5"
- voiceover: "ด่านหก เริ่มจาก 100 ลบ 7 ไปเรื่อย ๆ ห้าครั้ง ค่อย ๆ คิด ไม่ต้องรีบ"
- duration: 6s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/09-stage6-serial7.html
- handoff_in: stage-rail — top-center x=960 y=64, 8 dots 18px gap 22px, scale 1, opacity 1, static
- handoff_out: stage-rail — same position/scale/opacity, static
- type: feature_showcase
- persuasion: Show-don't-tell + reassurance
- beat: focus + calm
- asset_candidates:
- ui_parts: ui:card — math card

narrativeRole: Demonstrate the arithmetic rhythm and defuse pressure.
keyMessage: 100 minus 7, five times, at your own pace.

Adapt: keep the fixed-line-swaps-tokens spine: a centered equation "100 − 7 = 93" where the result slides into the minuend slot and the next result appears.
Scene 1 (0.0–1.6s): rail dot 6. Centered math card ~60% width; "ด่าน 6 · ลบเลขทีละ 7" tag above; equation "100 − 7 = ?" appears.
Scene 2 (1.6–4.8s): "93" types in; then **cut-the-curve** slide — 93 slides left into the minuend, next answer types: 86 → 79 → 72 → 65; a "ข้อ 1/5 … 5/5" counter steps beside it; previous results trail as a muted row below (100 · 93 · 86 · 79 · 72 · 65).
Scene 3 (4.8–6.0s): caption "ค่อย ๆ คิด ไม่ต้องรีบ" fades in; hold still — this is the breather.

## Frame 10 — ด่าน 7–8 ระลึก & วันเวลา

- blueprint: cursor-ui-demo (Adapt — demo|demo pair on one card)
- focal: ui:card — recall card then orientation card
- roles: ui:primary-button = supporting
- sfx: snap-click ×5, pop-soft, ding-success
- scene: "ด่าน 7/8" the five garden words drop back into answer slots; a 💡 ขอคำใบ้ button glows; then "ด่าน 8/8" date / month / ปี พ.ศ. / จังหวัด dropdowns fill and "ส่งคำตอบ" glows
- voiceover: "ด่านเจ็ด ตอบสิ่งของ 5 อย่างที่จำไว้ นึกไม่ออกกดขอคำใบ้ได้ ด่านสุดท้าย บอกวันเวลาและจังหวัดที่อยู่ แล้วกดส่งคำตอบ"
- duration: 8s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/10-stage7-8-recall-orientation.html
- handoff_in: stage-rail — top-center x=960 y=64, 8 dots 18px gap 22px, scale 1, opacity 1, static
- handoff_out: stage-rail — same position/scale/opacity, static
- type: feature_showcase
- persuasion: Payoff of foreshadowing (the five words return)
- beat: recognition → completion
- asset_candidates:
- ui_parts: ui:card — recall card; ui:primary-button — ส่งคำตอบ

narrativeRole: Close the loop on stage 1 and finish the test.
keyMessage: Recall the five words (hints allowed), answer date & place, submit.

Adapt: locked stage with fingertip; the card content swaps once between the two stages.
Scene 1 (0.0–3.6s): rail dot 7. Left: "ด่าน 7 · ระลึกคำ"; right card: 5 empty answer slots; the same five garden word chips from F5 drop into slots one by one (`waterfall-entry`); a gold "💡 ขอคำใบ้" button glows once on "คำใบ้".
Scene 2 (3.6–6.6s): rail dot 8; card content swaps to "ด่าน 8 · วันเวลาและสถานที่": rows วันที่ · เดือน · ปี พ.ศ. · วัน · ช่วงเวลา · จังหวัด fill in sequence (each value types in, `discrete-text-sequence`).
Scene 3 (6.6–8.0s): "ส่งคำตอบ" button glows softly and is tapped (`cursor-click-ripple`); all 8 rail dots turn green; hold.

## Frame 11 — อ่านผล

- blueprint: dataviz-countup (Adapt — scroll-free hero metric)
- focal: ui:result — score
- roles: ui:risk-cards = supporting · AI card = supporting
- sfx: score-roll, fanfare-cozy, pop-soft
- scene: Score rolls 0 → 28/30; three risk pills (เขียว ≥25 · เหลือง 18–24 · แดง <18) appear; five domain bars fill; a mint AI-insight card glows
- voiceover: "จากนั้นดูผลได้ทันที คะแนนเต็ม 30 แบ่งเป็นสามระดับ พร้อมผลแยกห้าด้าน และคำแนะนำจาก AI นำไปปรึกษาแพทย์ได้"
- duration: 9s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/11-result.html
- type: benefit_highlight
- persuasion: Value stacking (score + levels + domains + AI advice)
- beat: clarity + peace of mind
- asset_candidates:
- ui_parts: ui:result — score, 5 domain bars, AI card; ui:risk-cards — three levels

narrativeRole: The reward for finishing — a clear, actionable result.
keyMessage: A 30-point score, three clear levels, and personal advice to take to a doctor.

Adapt: keep the count-up hero metric as the signature; no camera push-through, elements reveal around it.
Scene 1 (0.0–2.6s): rail gone. Center-left: large score ring (`svg-path-draw` ring, `coral`) with "28 / 30" counting up from 0 (`counting-dynamic-scale`); "🎓 +1" mini badge on the ring.
Scene 2 (2.6–5.4s): on "สามระดับ", three risk pills stack to the right: 🟢 ปกติ ≥25 (#2e7d32 on #e8f5e9) · 🟡 เสี่ยงเล็กน้อย 18–24 (#d97706 on #fffbeb) · 🔴 ควรพบแพทย์ <18 (#c53030 on #fdf2f2); the green pill gets a highlight ring since 28 is normal.
Scene 3 (5.4–9.0s): on "ห้าด้าน", 5 domain bars fill (`stat-bars-and-fills`) under the ring; on "AI", a mint AI card (#f0f7e6) with "🤖 คำแนะนำเฉพาะคุณ" + 2 short lines slides up at right; hold.

## Frame 12 — เริ่มเลยวันนี้

- blueprint: titlecard-reveal (Reproduce — slide-up crossfade + still hold)
- focal: brand lockup
- roles: ui:primary-button = supporting
- sfx: chime-warm
- scene: Leaves drift; "ดูแลความทรงจำของคุณและคนที่คุณรัก" then the Memory Garden lockup with a "เริ่มทำแบบทดสอบได้ฟรี" pill; small note: แบบคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรค
- voiceover: "มาดูแลความทรงจำของคุณและคนที่คุณรัก ไปด้วยกันที่ Memory Garden ครับ"
- duration: 10s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-cta.html
- type: cta
- persuasion: Emotional close (care for loved ones) + low-friction invite
- beat: warmth + motivation
- asset_candidates:
- ui_parts: ui:primary-button — เริ่มทำแบบทดสอบ

narrativeRole: Warm invitation; leave the brand and the action on screen.
keyMessage: Start today, for yourself and the people you love.

Scene 1 (0.0–2.6s): leaves drift in gently at the edges; centered `section-headline` "ดูแลความทรงจำของคุณ และคนที่คุณรัก" slides up with a crossfade (one restrained move).
Scene 2 (2.6–6.0s): the line moves up a step; the Memory Garden lockup (same badge as F2) + a `coral` pill button "🌿 เริ่มทำแบบทดสอบได้ฟรี" reveal beneath; a small muted note "แบบคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรค" at the bottom of the safe area; hold to the end, final fade to cream in the last 0.4s.
