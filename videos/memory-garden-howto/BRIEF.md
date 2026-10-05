---
workflow: product-launch-video
flow: automation
storyboard: no
message: "ทำแบบทดสอบสุขภาพสมอง Memory Garden ได้ง่าย ๆ ด้วยตัวเอง ทีละด่าน ใน 10–15 นาที"
destination: youtube
aspect: 1920x1080
language: th
audience: "ผู้สูงอายุ 60+ ครอบครัว/ผู้ดูแล อสม. และบุคลากรสาธารณสุขชุมชน"
length: 60-90s
angle: show-it-as-is how-to walkthrough
narration: yes
vo_mode: restructured
capture: none
---

## Intent

วิดีโอสอนการทำแบบทดสอบ Memory Garden (สวนความทรงจำ) — แบบคัดกรองสุขภาพสมองตามเกณฑ์ MoCA 30 คะแนน
พาดูทีละขั้น: เข้าสู่ระบบด้วย LINE → กรอกข้อมูล → 8 ด่าน → อ่านผลคะแนน → ชวนเริ่มทำ
โทน: อบอุ่น นุ่มนวล ใจดี ไม่เร่งรีบ ไม่ทำให้ผู้สูงอายุกังวล ("สวนบำบัด" ไม่ใช่ "ห้องสอบ")
เป็นการแสดงแอปตามจริง (show), ไม่ใช่โฆษณาขายของ

## Assets

- design.md — design system ของแอป (สี ฟอนต์ Prompt/Anuphan/Sarabun, การ์ด glassmorphism, ปุ่ม pill 56px, risk colors) ใช้เป็นแหล่ง brand tokens
- source-video-guide.md — สตอรี่บอร์ด 13 ฉาก/บทพากย์ฉบับเต็ม 8 นาทีของผู้ใช้ ใช้เป็นแหล่งเนื้อหา, motion และ SFX cue

## Customizations

- ย่อบทพากย์จาก 8 นาทีเหลือ 60–90 วินาที (restructured) ครบทั้ง 8 ด่าน
- Motion จากเอกสาร: Touch Ripple, Elastic Pop badge, Finger Trace (วาดนาฬิกา), Snap & Lock, Mic Soundwave Pulse, Number Counter Roll 0→28/30, Leaf transition
- เสียงพากย์ไทยด้วย HeyGen (ผู้ใช้เลือก) — ต้องมี HEYGEN_API_KEY

## Notes

- ไม่มี URL/ภาพหน้าจอจริงของแอป → no-capture: สร้างหน้าจอ UI ขึ้นใหม่ตาม design.md
- ตัวหนังสือบนจอต้องใหญ่ อ่านง่ายสำหรับผู้สูงอายุ
- ต้องระบุว่าเป็นการคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรค
- ไม่มี QR code จริง — ฉากปิดใช้ placeholder/ข้อความชวนทำแทน
