---
format: 1920x1080
duration: 168s
message: "ผู้ทดสอบดำเนินแบบทดสอบ MoCA ฉบับภาษาไทยได้ถูกต้องครบ 8 ส่วน ด้วยคำพูดมาตรฐานที่เป็นกันเอง"
arc: Hook → ทักทาย → แผนที่ 8 ส่วน → ส่วนที่ 1–8 ทีละขั้น → ปิดการทดสอบ
audience: บุคลากรสุขภาพ/ผู้ทดสอบที่กำลังฝึกใช้ MoCA ฉบับภาษาไทย
mode: autonomous
music: user-supplied public/music/future-technology-maxkomusic.mp3 (bed)
narration: none
structure: how-to
---

## Video direction

- **No narration.** Every frame is silent apart from the music bed, so ON-SCREEN THAI TEXT carries the teaching. Each frame's `onscreen:` lists the exact Thai copy to show — use it verbatim. Reveals are paced to READING time (Thai: allow ≈ 1s per 6–8 Thai words after a piece lands before the next piece arrives), never front-loaded.
- **Palette** — from `frame.md` (blue-professional): warm cream canvas, cobalt primary as the single accent, ink text, muted text for secondary. No other hues.
- **Type** — IBM Plex Sans Thai for everything (display + body, via `frame.md` roles). Thai body text never below ~34px on 1920×1080; examiner quotes ~44–52px; section titles h1/h2. Thai line-height ≥ 1.45 (tone marks/vowels above and below need room). Never letter-space Thai, never uppercase-transform it.
- **Recurring elements (continuity):**
  - **Section badge** top-left on frames 4–13: a cobalt pill with the section number (1–8) + Thai name + small English name (e.g. "1 · มิติสัมพันธ์และการบริหารจัดการ  VISUOSPATIAL / EXECUTIVE").
  - **Speech card** — the examiner's quote: a cream/white rounded card with a cobalt left rule and a small label "ผู้ทดสอบพูดว่า" above the quote text. This is the canonical way examiner words appear.
  - **Stage note** — instructions that are NOT spoken (e.g. "เว้นคำละ 1 วินาที") appear as small muted text with a small ⓘ-style circle, never inside the speech card.
  - **Progress rail** — 8 small segments along the bottom-right (inside the top 92%) on frames 4–13 showing which section is active (active = cobalt, done = cobalt 40%, todo = hairline).
- **Motion grammar** — long-tail eases (power3 default), soft rise+fade for text, draw-on for line art, layer-reveal for diagrams. Holds are still. Transition between section frames is a consistent push-slide LEFT (steps), crossfade for the open/close.
- **Rhythm** — Frame 3 (the map) and Frame 14 (close) are held breathers; everything else reveals in 2–5 beats.
- **Negative list** — no scanned form image, no photos, no AI-gradient bokeh, no emoji, no floating independent motion (screensaver), no front-load-then-freeze (slideshow). Nothing important in the bottom ~8%.

## Frame 1 — Title hook

- scene: ชื่อเรื่องใหญ่กลางจอ + แถบ 8 ช่อง (8 ส่วน) เรียงตัวขึ้นใต้ชื่อ
- voiceover: ""
- onscreen: eyebrow "คู่มือผู้ทดสอบ" · h1 "แบบทดสอบ MoCA ฉบับภาษาไทย" · sub "พูดอย่างไร ทีละขั้นตอน ครบ 8 ส่วน" · 8 segments labelled 1–8
- duration: 7s
- transition_in: cut
- status: outline
- src: compositions/frames/01-title.html
- type: hook
- persuasion: Frame-then-fill
- beat: focused curiosity
- blueprint: kinetic-type-beats (Adapt)
- focal: the h1 title
- roles: h1 = foreground subject · 8-segment rail = supporting · faint hairline grid on cream = background

narrativeRole: เปิดเรื่องและบอกขอบเขตของวิดีโอ
keyMessage: วิดีโอนี้สอนคำพูดมาตรฐานสำหรับทุกขั้นของ MoCA ฉบับภาษาไทย

Adapt: keep the statement-builds-on-beats signature; payoff is the segmented rail.
Scene 1 (0.0–1.8s): eyebrow "คู่มือผู้ทดสอบ" rises in, centered upper-third; h1 rises word-group by word-group beneath it. Centered, hero ~55% width.
Scene 2 (1.8–3.6s): sub-line fades up under the h1.
Scene 3 (3.6–5.2s): the 8 segments draw in left→right as a strip under the sub-line, each with its number.
Scene 4 (5.2–7.0s): hold still; the strip's first segment glows cobalt softly once.

## Frame 2 — Greeting

- scene: ป้าย "ก่อนเริ่ม: ทักทายและเตรียมความพร้อม" + การ์ดคำพูดคำทักทายเต็ม + ชิป 2 อัน "⏱ 10–15 นาที" และ "ทำตามสบาย ไม่ต้องเครียด"
- voiceover: ""
- onscreen: title "ก่อนเริ่ม · ทักทายและเตรียมความพร้อม" · speech card "สวัสดีครับ/ค่ะ วันนี้เราจะทำแบบทดสอบประเมินการทำงานของสมองและความจำกันสั้นๆ นะครับ/ค่ะ ใช้เวลาประมาณ 10-15 นาที ขอให้ทำตามสบาย ไม่ต้องเครียดนะครับ/ค่ะ พร้อมแล้วเรามาเริ่มกันเลยครับ/ค่ะ" · chips "10–15 นาที", "ทำตามสบาย ไม่ต้องเครียด"
- duration: 12s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-greeting.html
- type: product_intro
- persuasion: Frame-then-fill
- beat: reassurance
- blueprint: titlecard-reveal (Adapt)
- focal: the speech card
- roles: speech card = foreground subject · title = supporting · chips = supporting · cream field + soft cobalt radial at top-right = background

narrativeRole: ตั้งบรรยากาศที่เป็นกันเองก่อนเริ่มทดสอบ
keyMessage: ทักทาย บอกเวลา และลดความกังวลของผู้เข้าทดสอบ

Adapt: one restrained slide-up reveal per piece instead of a single card; ends on a still hold.
Scene 1 (0.0–1.5s): title slides up, upper-left (asymmetric 65/35).
Scene 2 (1.5–3.5s): speech card slides up into the left 65%; quote text reveals line by line.
Scene 3 (3.5–7.0s): as the quote finishes, the two chips pop in stacked in the right 35% (10–15 นาที first, then ทำตามสบาย).
Scene 4 (7.0–12.0s): hold still for reading.

## Frame 3 — Eight-section map

- scene: กริดการ์ด 4×2 แสดง 8 ส่วน (เลข + ชื่อไทย + ชื่ออังกฤษเล็ก) ประกอบตัวทีละใบ
- voiceover: ""
- onscreen: title "แบบทดสอบมี 8 ส่วน" · cards: 1 มิติสัมพันธ์และการบริหารจัดการ (Visuospatial / Executive) · 2 การเรียกชื่อ (Naming) · 3 ความจำ (Memory) · 4 สมาธิและความตั้งใจ (Attention) · 5 ภาษา (Language) · 6 ความคิดเชิงนามธรรม (Abstraction) · 7 การระลึกความจำ (Delayed Recall) · 8 การรับรู้เวลาและสถานที่ (Orientation)
- duration: 10s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/03-map.html
- type: product_intro
- persuasion: Numbered enumeration
- beat: orientation
- blueprint: grid-card-assemble (Reproduce)
- focal: the 8-card grid
- roles: grid = foreground subject (~70% of frame) · title = supporting · hairline grid = background

narrativeRole: ให้ผู้ชมเห็นโครงสร้างทั้งหมดก่อนลงรายละเอียด
keyMessage: MoCA มี 8 ส่วน ทำตามลำดับ

Scene 1 (0.0–1.2s): title rises in, top center.
Scene 2 (1.2–5.2s): 8 cards cascade in, row 1 left→right then row 2, each card ~0.45s apart; big cobalt number + Thai name + small English.
Scene 3 (5.2–10.0s): held breather — still read of the whole map.

## Frame 4 — 1 Visuospatial: trail making

- scene: ป้ายส่วนที่ 1; ซ้าย 60%: วงกลม 1 ก 2 ข 3 ค 4 ง 5 จ กระจายตำแหน่งแบบแบบทดสอบ เส้นลากต่อทีละจุด (1→ก→2→ข→3→ค→4→ง→5→จ); ขวา 40%: การ์ดคำพูด
- voiceover: ""
- onscreen: badge "1 · มิติสัมพันธ์และการบริหารจัดการ" · sub-title "ลากเส้นต่อจุด" · speech card "กรุณาลากเส้นต่อจุด โดยเริ่มจากตัวเลข 1 ไปยังตัวอักษร ก. แล้วไปที่เลข 2 แล้วไปที่ตัวอักษร ข. สลับกันไปเรื่อยๆ จนถึงจุดสิ้นสุดนะครับ/ค่ะ" · labels on the diagram "เริ่ม" at 1 and "จบ" at จ
- duration: 12s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/04-trail.html
- type: feature_showcase
- persuasion: Show-don't-tell demonstration
- beat: comprehension
- blueprint: compose
- focal: the trail diagram
- roles: trail diagram = foreground subject (~55%) · speech card = supporting · badge + progress rail (1 active) = supporting · cream + hairline grid = background

narrativeRole: สาธิตคำสั่งลากเส้นสลับตัวเลข–ตัวอักษร
keyMessage: เริ่มที่ 1 → ก → 2 → ข สลับกันจนจบ

Scene 1 (0.0–1.5s): badge + sub-title in; the 10 circles pop in scattered (positions roughly like the form: 5 top-left, 1 left-middle, ก top-center, 2 right, etc. — mixed, not in order).
Scene 2 (1.5–4.5s): speech card slides up in the right 40%, quote reveals by line.
Scene 3 (4.5–10.0s): the path draws on segment by segment 1→ก→2→ข→3→ค→4→ง→5→จ, each target circle fills cobalt as the line reaches it; "เริ่ม" tag at 1 appears with the first segment, "จบ" tag at จ with the last.
Scene 4 (10.0–12.0s): hold still.

## Frame 5 — 1 Visuospatial: cube and clock

- scene: แบ่งซ้าย/ขวา; ซ้าย: ลูกบาศก์เส้น (wireframe cube) วาดตัวเอง + การ์ดคำพูดสั้น; ขวา: หน้าปัดนาฬิกา ตัวเลข 1–12 ปรากฏรอบวง เข็มหมุนไปหยุดที่ 11:10 + การ์ดคำพูด
- voiceover: ""
- onscreen: badge "1 · มิติสัมพันธ์และการบริหารจัดการ" · left label "วาดภาพลูกบาศก์" + speech "ช่วยคัดลอกวาดภาพลูกบาศก์นี้ลงในพื้นที่ว่างด้านล่าง ให้เหมือนกับตัวอย่างมากที่สุดครับ/ค่ะ" · right label "วาดนาฬิกา" + speech "กรุณาวาดรูปหน้าปัดนาฬิกา ใส่ตัวเลขทั้งหมดให้ครบถ้วน และวาดเข็มนาฬิกาชี้บอกเวลา 11 โมง 10 นาที (11:10 น.) ครับ/ค่ะ" · time chip "11:10 น."
- duration: 14s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/05-cube-clock.html
- type: feature_showcase
- persuasion: Side-by-side pairing
- beat: comprehension
- blueprint: comparison-split (Adapt)
- focal: the clock at 11:10
- roles: cube line art = foreground (left) · clock = foreground (right) · speech cards = supporting · badge + progress rail (1 active) = supporting

Adapt: keep two equal-weight panels entering from opposite wings + a pill badge pop (the "11:10 น." chip); flat entry instead of 3D book-open tilt (calmer register).
Scene 1 (0.0–1.0s): badge holds from previous frame position; left panel slides in from left.
Scene 2 (1.0–5.0s): the cube draws on edge by edge (front square, back square, connecting edges); its speech card reveals below it.
Scene 3 (5.0–6.0s): right panel slides in from right; clock circle draws on.
Scene 4 (6.0–10.0s): numbers 1–12 pop around the dial in order; then hour hand rotates to just before 11 and minute hand to 2 (11:10); the "11:10 น." chip springs on; the clock speech card reveals.
Scene 5 (10.0–14.0s): hold still.

## Frame 6 — 2 Naming

- scene: ไอคอนเส้นสัตว์ 3 ตัวเรียงซ้ายไปขวา (สิงโต แรด อูฐ) วาดด้วยเส้นเรียบง่ายสไตล์ line-art; ลูกศรชี้ทีละตัว แล้วป้ายชื่อเด้งใต้แต่ละตัว
- voiceover: ""
- onscreen: badge "2 · การเรียกชื่อ  NAMING" · speech card "ช่วยบอกผม/ดิฉันหน่อยครับ/ค่ะว่า สัตว์ในรูปแต่ละตัวคือตัวอะไร" · stage note "ชี้ทีละตัว จากซ้ายไปขวา" · name tags "สิงโต", "แรด", "อูฐ"
- duration: 10s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/06-naming.html
- type: feature_showcase
- persuasion: Rule of three
- beat: recognition
- blueprint: compose
- focal: the three animal line drawings (triptych)
- roles: animals = foreground subject (triptych, ~60%) · speech card = supporting (top) · name tags = supporting · progress rail (2 active)

narrativeRole: สาธิตการชี้และเรียกชื่อสัตว์ 3 ตัว
keyMessage: ชี้ทีละตัวจากซ้ายไปขวา: สิงโต แรด อูฐ

Scene 1 (0.0–2.5s): badge in; speech card slides down into the top band; stage note appears under it.
Scene 2 (2.5–4.0s): the three animal line drawings draw on together as a triptych (simple recognisable SVG silhouettes/outlines: lion with mane, rhinoceros with horn, camel with hump).
Scene 3 (4.0–8.0s): a cobalt pointer arrow moves to each animal in turn (left→right); on each, its name tag pops underneath.
Scene 4 (8.0–10.0s): hold.

## Frame 7 — 3 Memory

- scene: การ์ดคำพูดคำสั่งแรก; จากนั้น 5 คำปรากฏทีละคำเป็นชิปใหญ่ห่าง ~1 วินาที (มีจุดจับจังหวะ); ป้าย "รอบที่ 1" → "รอบที่ 2"; ป้ายเตือนท้าย
- voiceover: ""
- onscreen: badge "3 · ความจำ  MEMORY" · speech card "ผม/ดิฉันจะอ่านคำ 5 คำ ขอให้ตั้งใจฟังและจำไว้ให้ดี เมื่ออ่านจบแล้ว ให้พูดคำทั้งหมดเท่าที่จำได้กลับมา โดยไม่จำเป็นต้องเรียงลำดับครับ/ค่ะ" · words "หน้า", "ผ้าไหม", "วัด", "กล้วยไม้", "สีแดง" · stage note "อ่านคำละ 1 วินาที · อ่าน 2 รอบ" · round tags "รอบที่ 1", "รอบที่ 2" · reminder card "ขอให้จำคำเหล่านี้ไว้นะครับ/ค่ะ เพราะเดี๋ยวตอนท้ายของการทดสอบ ผม/ดิฉันจะถามคำเหล่านี้อีกครั้ง"
- duration: 16s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/07-memory.html
- type: feature_showcase
- persuasion: Progressive disclosure
- beat: concentration
- blueprint: kinetic-type-beats (Adapt)
- focal: the five word chips
- roles: word chips = foreground subject (full-width strip) · speech card / reminder = supporting · round tag + stage note = supporting · progress rail (3 active)

Adapt: the "statement builds across beats" signature becomes the 5 words landing one per second on a strip.
Scene 1 (0.0–4.0s): badge; speech card slides up upper area, quote reveals by line.
Scene 2 (4.0–9.5s): "รอบที่ 1" tag + stage note appear; the five words land one by one on a full-width strip, exactly ~1s apart, each with a small tick dot pulsing.
Scene 3 (9.5–11.0s): tag flips to "รอบที่ 2"; the five chips re-highlight in sequence quickly (cobalt underline sweeping across).
Scene 4 (11.0–13.5s): reminder card slides up beneath the strip with a small bookmark icon.
Scene 5 (13.5–16.0s): hold.

## Frame 8 — 4 Attention: digit span

- scene: บนสุด: แถว "ตามลำดับ" ตัวเลข 2 1 8 5 4 เด้งทีละตัว; ล่าง: แถว "ย้อนกลับ" 7 4 2 ปรากฏ แล้วสลับตำแหน่งกลายเป็น 2 4 7 ด้วยการเคลื่อนโค้ง
- voiceover: ""
- onscreen: badge "4 · สมาธิและความตั้งใจ  ATTENTION" · row 1 label "พูดตามลำดับ" + speech "ผม/ดิฉันจะอ่านชุดตัวเลข เมื่ออ่านจบแล้ว ให้พูดตัวเลขตามลำดับที่ได้ยินครับ" + digits "2 1 8 5 4" · row 2 label "พูดย้อนกลับ" + speech "รอบนี้ เมื่ออ่านตัวเลขจบแล้ว ให้พูดตัวเลขย้อนกลับจากหลังมาหน้านะครับ/ค่ะ" + digits "7 4 2" → answer "2 4 7"
- duration: 12s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/08-digits.html
- type: feature_showcase
- persuasion: Before/after contrast
- beat: concentration
- blueprint: kinetic-type-beats (Adapt)
- focal: the digit tiles
- roles: digit tiles = foreground subject (large, tabular) · speech text = supporting · progress rail (4 active)

Adapt: in-place token swap signature = 7 4 2 physically reordering to 2 4 7.
Scene 1 (0.0–2.5s): badge; row 1 label + speech line reveal (top half).
Scene 2 (2.5–5.0s): digits 2 1 8 5 4 pop in as large square tiles one per ~0.5s.
Scene 3 (5.0–7.5s): row 2 label + speech line reveal (bottom half); tiles 7 4 2 pop in.
Scene 4 (7.5–9.5s): the 7 and 2 tiles swap positions on arcs → 2 4 7; a small "คำตอบ" label + cobalt outline appears.
Scene 5 (9.5–12.0s): hold.

## Frame 9 — 4 Attention: tap and serial sevens

- scene: ซ้าย: แถบตัวอักษรเลื่อนผ่านช่องอ่าน ทุกครั้งที่ตัว "ก" ผ่าน มีไอคอนมือแตะ + วงกระเพื่อม; ขวา: ตัวเลข 100 แล้วนับลด 93 86 79 72 65 ทีละขั้นพร้อมป้าย "−7"
- voiceover: ""
- onscreen: badge "4 · สมาธิและความตั้งใจ  ATTENTION" · left title "แตะมือเมื่อได้ยิน ก" + speech "ทุกครั้งที่ได้ยินตัวอักษร 'ก' ให้เคาะหรือแตะมือบนโต๊ะ 1 ครั้ง แต่ถ้าเป็นตัวอักษรอื่นไม่ต้องแตะนะครับ/ค่ะ" + stage note "อ่าน 1 ตัวต่อวินาที" + sample letter strip "ข ก ง จ ก ก ค ก" · right title "ลบทีละ 7" + speech "เริ่มต้นจากเลข 100 ให้ลบออกทีละ 7 ไปเรื่อยๆ แล้วบอกผลลัพธ์ที่ได้ออกมาครับ/ค่ะ" + sequence "100 → 93 → 86 → 79 → 72 → 65"
- duration: 14s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/09-tap-sevens.html
- type: feature_showcase
- persuasion: Side-by-side pairing
- beat: concentration
- blueprint: dataviz-countup (Adapt)
- focal: the counting-down number
- roles: letter strip with tap ripples = foreground (left) · big count-down number = foreground (right) · speech text = supporting · progress rail (4 active)

Adapt: keep count-up signature as a count-DOWN of one hero number; pair with the tap demo (split-screen).
Scene 1 (0.0–3.5s): badge; left title + speech reveal; stage note.
Scene 2 (3.5–6.5s): letter strip steps through its letters one per ~0.35s; on each "ก" a hand-tap icon presses and a cobalt ripple expands.
Scene 3 (6.5–8.0s): right title + speech reveal.
Scene 4 (8.0–12.0s): the hero number 100 ticks down to 93, 86, 79, 72, 65 (each step with a "−7" chip flicking off), and each previous value drops into a small trail row beneath.
Scene 5 (12.0–14.0s): hold.

## Frame 10 — 5 Language

- scene: ครึ่งบน: "พูดตามประโยค" สองการ์ดประโยค; ครึ่งล่าง: "ความคล่องแคล่ว" ตัว ก ใหญ่ + วงจับเวลา 1 นาที + ป้ายข้อยกเว้น 3 ป้าย
- voiceover: ""
- onscreen: badge "5 · ภาษา  LANGUAGE" · title A "พูดตามประโยค" + speech "ผม/ดิฉันจะอ่านประโยคให้ฟัง เมื่ออ่านจบแล้ว ให้พูดตามให้เหมือนที่ได้ยินทุกคำนะครับ/ค่ะ" + sentence 1 "ฉันรู้ว่าจอมเป็นคนเดียวที่มาช่วยงานวันนี้" + sentence 2 "แมวมักจะซ่อนตัวอยู่หลังเก้าอี้เมื่อมีสุนัขอยู่ในห้อง" · title B "ความคล่องแคล่ว · คำขึ้นต้นด้วย ก" + speech "ช่วยบอกคำศัพท์ภาษาไทยที่ขึ้นต้นด้วยตัวอักษร 'ก' ให้ได้มากที่สุดภายในเวลา 1 นาที" + timer "1 นาที" + exclusion chips "ไม่รวมชื่อคน", "ไม่รวมชื่อจังหวัด", "ไม่นับคำเดิมที่เปลี่ยนแค่หางเสียง/ลงท้าย"
- duration: 16s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/10-language.html
- type: feature_showcase
- persuasion: Frame-then-fill
- beat: comprehension
- blueprint: compose
- focal: the big "ก" with the 1-minute ring
- roles: sentence cards = foreground (part A) · big ก + timer ring = foreground (part B) · exclusion chips = supporting · progress rail (5 active)

narrativeRole: สอนการพูดตามประโยคและความคล่องแคล่วในการใช้คำ
keyMessage: พูดตาม 2 ประโยค; คำขึ้นต้นด้วย ก ใน 1 นาที พร้อมข้อยกเว้น

Scene 1 (0.0–2.5s): badge; title A + speech line reveal (upper half, left-aligned).
Scene 2 (2.5–6.5s): sentence 1 card slides in, then sentence 2 card (each a numbered quote card).
Scene 3 (6.5–8.5s): a hairline divider draws across; title B + speech reveal (lower half, left 60%).
Scene 4 (8.5–12.0s): big "ก" pops in the lower-right 40% with a circular 1-minute ring that sweeps once around it (draws 0→100% over ~2.5s); the "1 นาที" label sits under it.
Scene 5 (12.0–14.0s): three exclusion chips pop in a row under title B, each with a small ✕ mark.
Scene 6 (14.0–16.0s): hold.

## Frame 11 — 6 Abstraction

- scene: การ์ดคำพูดบน; 3 แถวจับคู่: ส้ม + กล้วย = ผลไม้ (ตัวอย่าง, ป้าย "ตัวอย่าง"); รถไฟ + รถยนต์ = ? → "พาหนะ"; นาฬิกา + ไม้บรรทัด = ? → "เครื่องมือวัด"
- voiceover: ""
- onscreen: badge "6 · ความคิดเชิงนามธรรม  ABSTRACTION" · speech "ช่วยบอกหน่อยครับ/ค่ะว่า สิ่งสองสิ่งนี้มีความเหมือนกันหรือเป็นพวกเดียวกันอย่างไร" · row 0 tag "ตัวอย่าง": "ส้ม" + "กล้วย" → "ผลไม้" · row 1 tag "ข้อ 1": "รถไฟ" + "รถยนต์ / รถบรรทุก" → "พาหนะ / การเดินทาง" · row 2 tag "ข้อ 2": "นาฬิกา" + "ไม้บรรทัด" → "เครื่องมือวัด"
- duration: 14s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/11-abstraction.html
- type: feature_showcase
- persuasion: Worked example
- beat: insight
- blueprint: comparison-split (Adapt)
- focal: the pair rows with their answer pills
- roles: pair rows = foreground subject (~60%) · answer pills = supporting payoff · speech card = supporting · progress rail (6 active)

Adapt: keep paired items entering from opposite wings + a pill badge springing between them; three rows instead of one pair.
Scene 1 (0.0–2.5s): badge; speech card reveals top.
Scene 2 (2.5–5.0s): example row: "ส้ม" enters from left, "กล้วย" from right, a "=" then the "ผลไม้" pill springs in (muted, "ตัวอย่าง" tag).
Scene 3 (5.0–8.0s): row 1 pair enters the same way; a "?" holds for a beat, then flips to "พาหนะ / การเดินทาง".
Scene 4 (8.0–11.0s): row 2 pair; "?" flips to "เครื่องมือวัด".
Scene 5 (11.0–14.0s): hold.

## Frame 12 — 7 Delayed recall

- scene: การ์ดคำพูด; 5 ช่องว่างเรียงแถว แล้วคำเติมเข้าทีละช่อง (หน้า ผ้าไหม วัด กล้วยไม้ สีแดง) — callback ไปที่ Frame 7; ป้ายข้อแนะนำการใบ้
- voiceover: ""
- onscreen: badge "7 · การระลึกความจำ  DELAYED RECALL" · speech "จำคำ 5 คำที่ผม/ดิฉันให้อ่านและจำไปเมื่อสักครู่นี้ได้ไหมครับ/ค่ะ? ช่วยบอกคำเหล่านั้นทั้งหมดเท่าที่จำได้เลยครับ/ค่ะ" · slots filling "หน้า", "ผ้าไหม", "วัด", "กล้วยไม้", "สีแดง" · stage note "หากจำไม่ได้: ใบ้ตามหมวด (Category cue) หรือให้เลือกตอบ (Multiple choice cue) ตามคู่มือการให้คะแนน"
- duration: 11s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/12-recall.html
- type: feature_showcase
- persuasion: Callback
- beat: payoff
- blueprint: grid-card-assemble (Adapt)
- focal: the five recall slots
- roles: slots strip = foreground subject (same full-width strip styling as Frame 7's chips for continuity) · speech card = supporting · stage note = supporting · progress rail (7 active)

Adapt: the assemble cascade fills empty slots rather than placing new cards.
Scene 1 (0.0–3.0s): badge; speech card reveals.
Scene 2 (3.0–4.0s): five empty dashed slots draw in on the strip.
Scene 3 (4.0–7.0s): words drop into the slots one by one, each slot turning solid cobalt-outlined.
Scene 4 (7.0–9.0s): stage note with ⓘ fades up below the strip.
Scene 5 (9.0–11.0s): hold.

## Frame 13 — 8 Orientation

- scene: การ์ดคำพูดนำ; กริด 3×2 ของการ์ดคำถาม 6 ใบ แต่ละใบมีไอคอนเส้นเล็ก (ปฏิทิน, เดือน, ปี, วัน, หมุดสถานที่, แผนที่)
- voiceover: ""
- onscreen: badge "8 · การรับรู้เวลาและสถานที่  ORIENTATION" · speech "สุดท้ายนี้ ขอสอบถามข้อมูลปัจจุบันหน่อยครับ/ค่ะ" · cards "1 วันนี้วันที่เท่าไร?", "2 เดือนอะไร?", "3 ปีอะไร?", "4 วันนี้วันอะไรในสัปดาห์?", "5 สถานที่ตรงนี้คือที่ไหน?", "6 ตอนนี้เราอยู่ในจังหวัดอะไร?"
- duration: 11s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/13-orientation.html
- type: feature_showcase
- persuasion: Numbered enumeration
- beat: completion
- blueprint: grid-card-assemble (Reproduce)
- focal: the 3×2 question grid
- roles: question grid = foreground subject (~65%) · speech card = supporting · progress rail (8 active)

Scene 1 (0.0–2.0s): badge; speech card reveals top.
Scene 2 (2.0–7.0s): six question cards cascade into a 3×2 grid, ~0.7s apart, icon draws on then text rises.
Scene 3 (7.0–11.0s): hold.

## Frame 14 — Close

- scene: การ์ดคำพูดปิดกลางจอ แล้วแถบ 8 ช่องจาก Frame 1 เติมครบทุกช่องเป็น cobalt พร้อมเครื่องหมายถูก; เครดิตเพลงเล็กๆ ล่าง
- voiceover: ""
- onscreen: title "สรุปการทดสอบ" · speech card "ทำแบบทดสอบเรียบร้อยแล้วครับ/ค่ะ ขอบคุณมากครับ/ค่ะสำหรับความร่วมมือ" · 8-segment rail all complete + "ครบ 8 ส่วน" · tiny credit "Music: “Future Technology” by MaxKoMusic"
- duration: 9s
- transition_in: crossfade
- status: outline
- src: compositions/frames/14-close.html
- type: branding
- persuasion: Callback
- beat: closure
- blueprint: titlecard-reveal (Adapt)
- focal: the closing speech card
- roles: speech card = foreground subject · completed rail = supporting payoff · credit = supporting (small, muted, bottom-right inside safe area)

narrativeRole: ปิดการทดสอบและสรุปหลักการ
keyMessage: ขอบคุณผู้เข้าทดสอบ — ครบ 8 ส่วนด้วยคำพูดมาตรฐาน

Adapt: one restrained slide-up for the card, then the rail fill as the payoff; real exit = gentle fade to cream in the last 0.8s.
Scene 1 (0.0–1.5s): title rises in.
Scene 2 (1.5–3.5s): speech card slides up center.
Scene 3 (3.5–6.0s): the 8-segment rail (same styling as Frame 1) fills left→right to cobalt, a check mark pops at the end with "ครบ 8 ส่วน".
Scene 4 (6.0–8.2s): hold; credit line is visible from Scene 3 onward.
Scene 5 (8.2–9.0s): fade out.
