## Dispatch context (orchestrator → frame worker) — applies to every frame of this project

- PROJECT_DIR: /home/user/chat-bot/videos/moca-thai-guide
- Canvas: 1920×1080
- Captions: disabled. Keep every element above y ≤ 900px anyway (keep-out holds).
- Confirmed sketch: none (autonomous run, sketches skipped) — design the layout yourself.
- Before authoring, read ALSO: `.hyperframes/video-direction.md` (shared video-wide direction — recurring section badge, speech card, stage note, progress rail, palette/type rules). It binds all 14 frames into one film; follow it exactly so frames match.

### Project-specific overrides of the worker role (these WIN over the role text)

1. **This video has NO narration and NO caption track.** The `voiceover` field is empty. The frame's `onscreen:` field lists the exact Thai copy that MUST be rendered as visible text, verbatim (examiner quotes, labels, words, numbers). Rendering those sentences is correct here — the "no narration sentence as visible text / short copy only" rule does NOT apply to `onscreen:` copy.
2. Pace reveals to the time-coded `Scene` lines (reading time), not to a voice.
3. **Thai typography:** font-family "IBM Plex Sans Thai" (load from Google Fonts: `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap` via a `<link>` inside the template, or @import in the template's `<style>`), fallback `"Noto Sans Thai", sans-serif`. Body/quote text ≥ 34px, line-height ≥ 1.45, no letter-spacing on Thai, no text-transform. Give text boxes enough width so Thai lines wrap at word groups, and make sure no text overflows its container (check: the CLI `check` flags `text_box_overflow`). Use `word-break: normal; line-break: auto;` and let the browser wrap Thai.
4. Line art (trail circles, cube, clock, animals, icons) is inline SVG you draw; use stroke-dashoffset draw-on for "draws on" moves (seek-safe via the GSAP timeline).
5. Prefix all ids/classes with the frame_id as the role requires. Write ONLY `compositions/frames/<frame_id>.html`.
