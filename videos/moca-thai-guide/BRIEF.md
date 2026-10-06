---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "ผู้ทดสอบดำเนินแบบทดสอบ MoCA ฉบับภาษาไทยได้ถูกต้องครบ 8 ส่วน ด้วยคำพูดมาตรฐานที่เป็นกันเอง"
destination: youtube
aspect: 1920x1080
language: th
audience: บุคลากรสุขภาพ/ผู้ทดสอบที่กำลังฝึกใช้ MoCA ฉบับภาษาไทย
length: 150-180s
angle: how-to
vo_mode: restructured
style_preset: blue-professional
---

## Intent

วิดีโอสอน/ฝึกผู้ทดสอบ (examiner training) วิธีดำเนินแบบทดสอบ Montreal Cognitive Assessment (MoCA)
ฉบับภาษาไทย ทีละขั้นตอนตามบทพูดที่ผู้ใช้ให้มา ทั้ง 8 ส่วน: Visuospatial/Executive, Naming, Memory,
Attention, Language, Abstraction, Delayed Recall, Orientation พร้อมคำทักทายและคำสรุป
โทน: ชัดเจน เป็นกันเอง เป็นทางการแบบการแพทย์

## Assets

- public/music/future-technology-maxkomusic.mp3 — เพลงพื้นหลัง (ผู้ใช้อัปโหลด) ระดับเสียงเบาใต้เสียงบรรยาย
- (แบบฟอร์ม MoCA ที่ผู้ใช้แนบมาใช้เป็นข้อมูลอ้างอิงเท่านั้น — ไม่ใส่ภาพสแกนในวิดีโอ)

## Customizations

- วาดภาพประกอบใหม่ให้คมชัด: ลากเส้นต่อจุด 1-ก-2-ข…, ลูกบาศก์, นาฬิกา 11:10, ไอคอนสิงโต/แรด/อูฐ
- เสียงบรรยายแบบปรับเป็นรายฉาก; คำพูดเต็มของผู้ทดสอบขึ้นเป็นตัวอักษรบนจอ
- เสียงบรรยายภาษาไทยสร้างด้วย Microsoft Edge TTS (th-TH-PremwadeeNeural) บนเครื่องผู้ใช้ แล้วอัปโหลดกลับมา
  (ใน cloud container นี้ Edge TTS/gTTS ถูกบล็อก และ Kokoro ไม่มีภาษาไทย)

## Notes

- เพลงประกอบ: "Future Technology" by MaxKoMusic (ผู้ใช้อัปโหลด, 125s, 115 BPM) — สั้นกว่าวิดีโอ (~165s) ต้องวนซ้ำ/เฟดท้าย; ใส่เครดิตผู้แต่งตามเงื่อนไขใบอนุญาต
- ใช้ฟอนต์ไทยจาก Google Fonts (IBM Plex Sans Thai) แทนฟอนต์ละตินของพรีเซ็ต
