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

- (แบบฟอร์ม MoCA ที่ผู้ใช้แนบมาใช้เป็นข้อมูลอ้างอิงเท่านั้น — ไม่ใส่ภาพสแกนในวิดีโอ)

## Customizations

- วาดภาพประกอบใหม่ให้คมชัด: ลากเส้นต่อจุด 1-ก-2-ข…, ลูกบาศก์, นาฬิกา 11:10, ไอคอนสิงโต/แรด/อูฐ
- เสียงบรรยายแบบปรับเป็นรายฉาก; คำพูดเต็มของผู้ทดสอบขึ้นเป็นตัวอักษรบนจอ
- เสียงบรรยายภาษาไทยสร้างด้วย Microsoft Edge TTS (th-TH-PremwadeeNeural) บนเครื่องผู้ใช้ แล้วอัปโหลดกลับมา
  (ใน cloud container นี้ Edge TTS/gTTS ถูกบล็อก และ Kokoro ไม่มีภาษาไทย)

## Notes

- ไม่มีเพลงประกอบ (MusicGen ไม่ได้ติดตั้ง และไม่ได้ล็อกอิน HeyGen)
- ใช้ฟอนต์ไทยจาก Google Fonts (IBM Plex Sans Thai) แทนฟอนต์ละตินของพรีเซ็ต
