# Frame packet: 05-cube-clock

## Project inputs

- Project: /home/user/chat-bot/videos/moca-thai-guide
- Design tokens: /home/user/chat-bot/videos/moca-thai-guide/frame.md
- RULES_DIR: /home/user/chat-bot/.agents/skills/hyperframes-animation/rules

## Assigned storyboard block

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

## Selected blueprint: comparison-split

# comparison-split — Comparison Split-Cards

**intent**: Two paired items of equal weight shown side-by-side with mirrored 3D "book-open" tilts — the eye reads them as a balanced comparison, then a pill badge lands at each card's inner edge to punctuate. The motion IS the symmetry: two cards arriving from opposite wings into a held spread.

**roles served**

- Key_Feature (from `comparison-split-cards`): when two complementary features / capabilities of equal weight should be presented **simultaneously, not sequentially** — an A/B, a "X + Y together," paired concepts the viewer must weigh side-by-side. Not for >2 items (use `grid-card-assemble`) or sequential steps.

**duration**: 4–6s

**shot structure** (a `[bg]` canvas carrying two faint ambient glow blooms — `[accent A]` near 30%, `[accent B]` near 70% — so each side owns a color identity across a 50% symmetry axis; equal-width cards under one shared perspective parent)

- **Scene 1 (0.0–~0.8s) — title sets the concept.** A centered `[title line]` with an `[accent keyword]` slides DOWN into place from just above (a short smooth settle). The downward arrival is deliberate: it forms a non-conflicting T-shape against the cards, which arrive from the sides next.
- **Scene 2 (~0.4–1.9s) — the split-tilt entry (signature move).** Two equal-width feature cards arrive from opposite wings — `[left card]` from the left, `[right card]` from the right ~0.2s behind — each carrying a **mirrored 3D `rotateY` tilt** (left faces right, right faces left, opening like a book) and scaling ~0.85→1 as it lands. The entry overlaps the title's tail so the whole thing reads as ONE arrival, not two beats. Each card holds `[image / label / subtitle]`; box-shadows fall **outward** from the tilt (left shadow right, right shadow left).
- **Scene 3 (~1.9–end) — badges punctuate, then hold.** A pill `[badge]` lands at each card's **inner edge** (left then right, ~0.3s apart), overlapping its card ~15% so it reads as attached, not orbiting. This is the lone overshoot in the shot — it earns the punctuation. Settles and holds.

**motion vocabulary**: title slide-down from above; mirrored opposite-wing card entry; static book-open `rotateY` tilt (`+tilt` left, `−tilt` right); tilt-matched outward box-shadow; inner-edge badge spring-pop; gentle phase-opposed idle float (left vs right, never synchronized) registered as subtle jitter; dual side-glow ambient.

**rule mapping**

- two cards entering from opposite wings with mirrored `rotateY` tilts + tilt-matched shadow → `split-tilt-cards` (the signature; keep the two-layer split so the entry `x`/`scale` and the idle never collide on one alias)
- title slide-down settle → `gsap-effects` (translate + opacity on a long-tail `power3`)
- inner-edge pill badge pop (the one overshoot) → `spring-pop-entrance` (overshoot register — earns the punctuation)
- phase-opposed idle float on the pair → `sine-wave-loop` (low-amplitude register — subtle jitter, NOT lazy breathing; left `sin(t)`, right `sin(t+π)` so they never conveyor-belt)
- the two faint side glows behind the cards → `ambient-glow-bloom` (un-triggered soft bloom, one per accent)

**camera modifier**: camera-static by default — the symmetry is the subject and a move would break the balance.
