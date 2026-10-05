---
workflow: general-video
flow: automation
storyboard: no
message: "การคัดกรองอัลไซเมอร์ใช้เวลานาน — แอปที่คัดกรองได้ด้วยตัวเองช่วยทั้งคนไข้และบุคลากร"
aspect: 1920x1080
language: th
length: 175s
---

## Intent

Vox-pop / street-interview recut (สดใส เป็นกันเอง) of three interviews about Alzheimer's screening:
a doctor, an older respondent who tried the test, and two nurses. Jump cuts trim the
interviews to ~2:55 on a 16:9 canvas. The footage plays full-screen with graphics layered on top.

## Assets

- public/footage/doctor.mp4 — Video 1: doctor interview (2:41, 960×540)
- public/footage/elder.mp4 — Video 2: older respondent (1:20, 960×540)
- public/footage/nurses.mp4 — Video 3: two nurses (3:46, 960×540)
- User-supplied transcripts (in chat) are the caption text source.

## Customizations

- Kinetic word-by-word captions: white with a thick black stroke; key words in yellow or green.
- Role-only name cards (no real names) that pop in with sparkle icons.
- B-roll replaced by pure motion-graphic cutaway cards. No camcorder REC frame.
- Floating repeated-text burst effect (e.g. "ก็ดีนะ").
- Outro: speaker grid + closing line, no QR.
- Upbeat BGM ducked under speech; pop/whoosh/sparkle SFX on graphic entrances.

## Notes

- Network policy blocks ASR model hosts and HeyGen is signed out. Phrase timing comes from a
  local whisper-small ONNX model (npm `sts-whisper-small`) aligned to the user's transcripts.
  The BGM is synthesized offline. The SFX are the bundled Pixabay-licensed library.
- CDNs are blocked, so GSAP is vendored at assets/vendor/gsap.min.js and the Kanit font (OFL) at assets/fonts.
