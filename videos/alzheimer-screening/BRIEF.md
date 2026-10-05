---
workflow: general-video
flow: automation
storyboard: no
message: "การคัดกรองอัลไซเมอร์ที่เร็วและเข้าถึงง่าย ช่วยทั้งบุคลากรและผู้รับบริการ"
destination: youtube
aspect: "16:9"
language: th
length: "2:45"
layout: overlay
style: clinical
---

# Alzheimer's screening interviews: 2:45 highlight

## Intent
- **Source:** a 7:43 Thai interview recording (doctor, nurses, staff, patient) about Alzheimer's screening.
- **Asks:**
  - Cut it to **2:45** (read as 2 min 45 s).
  - Add motion graphics and sound effects on the beats.
  - Use the `badge-pop` component with `count: "3"`, `accent: "red"` and `surface: "light"`.

## Customizations
- Picked by the user:
  - 16:9 canvas at 1920×1080
  - full-bleed **overlay** layout
  - **clinical** style group
  - card count: auto (~16 for a 165s cut)
- The badge-pop with "3" marks the three standard screening tests the doctor names: TMSE, MoCA and MMSE.
- All SFX come from the bundled media-use library (pop, whoosh, click, chime, ping, sparkle, riser tail). They are placed on card entrances, at about 25–60% volume under the dialogue.

## Notes
- Thai ASR was unavailable: the network policy blocks the Whisper model downloads from huggingface.co.
- **How the cuts were chosen:**
  - From the user's timestamped transcript.
  - From speaker turns, worked out by who holds the phone mic.
  - From pauses detected in the audio energy.
- To change a range, edit `CUTS` in `build.py` and run `python3 build.py`.
