# Frame packet: 11-abstraction

## Project inputs

- Project: /home/user/chat-bot/videos/moca-thai-guide
- Design tokens: /home/user/chat-bot/videos/moca-thai-guide/frame.md
- RULES_DIR: /home/user/chat-bot/.agents/skills/hyperframes-animation/rules

## Assigned storyboard block

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
