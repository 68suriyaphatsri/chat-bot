// Writes CONTENT.md, a readable script of the presentation video, from the same EDL the video is built from.
// Run: node build/content.mjs
import fs from 'node:fs';
import { SECTIONS, EMPATHY, DEFINE, IDEATE, IDEAS, SURVEY, WHY, STATS } from './edl.mjs';

const FPS = 30, TARGET = 300;
const snap = (n) => Math.round(n * FPS) / FPS;
const clipDur = (clips) => clips.reduce((a, [x, y]) => a + Math.round((snap(y) - snap(x)) * FPS) / FPS, 0);
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
let T = 0;
const at = SECTIONS.map((s) => {
  const start = T;
  const d = s.type === 'talk' || s.type === 'footage' ? clipDur(s.clips) : s.dur === 'fill' ? TARGET - T : s.dur;
  T = Math.round((T + d) * FPS) / FPS;
  return { s, start, end: T };
});
const find = (pred) => at.find((x) => pred(x.s));
const range = (x) => `${mmss(x.start)}–${mmss(x.end)}`;
const speech = (s) => s.captions.map((c) => c[2]).join(' ');
const quotes = (s) => s.captions.filter((c) => c[3] !== 'q').map((c) => c[2]).join(' ');
const roleOf = (s) => ({ doctor: 'แพทย์', nurses: 'พยาบาลวิชาชีพ', elder: 'ญาติ / ผู้สูงอายุ' })[s.src] || 'ผู้ให้สัมภาษณ์';

const title = find((s) => s.slide?.type === 'title');
const cycle = find((s) => s.slide?.type === 'cycle');
const emp = find((s) => s.slide?.type === 'empathize');
const ivs = at.filter((x) => x.s.type === 'footage');
const mapHead = find((s) => s.slide?.type === 'maphead');
const map = find((s) => s.type === 'map');
const def = find((s) => s.slide?.type === 'define');
const ide = find((s) => s.type === 'ideate');
const why = find((s) => s.type === 'why');
const phones = at.filter((x) => x.s.slide?.type === 'phone');
const test = find((s) => s.slide?.type === 'test');
const res = find((s) => s.type === 'results');
const fin = find((s) => s.type === 'finale');
const pct = (k) => ({ improve: 50, newway: 40, reimagine: 10 })[k];

let md = `# Memory Garden: เว็บแอปพลิเคชันคัดกรองภาวะอัลไซเมอร์เบื้องต้น
### เนื้อหาวิดีโอนำเสนอโครงงาน (Design Thinking) · ความยาว ${mmss(T)} นาที

**โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เพชรบุรี** (Princess Chulabhorn Science High School Phetchaburi)

| | |
|---|---|
| ชื่อโครงงาน | การพัฒนา Web Application เพื่อคัดกรองภาวะอัลไซเมอร์เบื้องต้น |
| ชื่อภาษาอังกฤษ | Design of a Web-Based Game for Preliminary Alzheimer's Screening |
| ผู้จัดทำ | นายบุญยากร คงสนธิ ม.5 · นายสุริยภัทร ศรีสดใส ม.5 |
| อาจารย์ที่ปรึกษา | นายณัฐวุฒิ ไม้แก่น |
| ทดลองใช้งาน | https://test-5-two-ruby.vercel.app/ |

> ⚠️ ส่วนที่มีเครื่องหมาย ✏️ เป็นเนื้อหาที่**ร่างจากบทสัมภาษณ์** รอทีมตรวจแก้ก่อนนำไปใช้

---

## สารบัญ (ตามเวลาในวิดีโอ)

| เวลา | ช่วง |
|---|---|
| ${range(title)} | แนะนำโครงงาน |
| ${range(cycle)} | กระบวนการ Design Thinking 5 ขั้น |
| ${mmss(emp.start)}–${mmss(map.end)} | 01 · Empathize — สัมภาษณ์ + Empathy Map |
| ${range(def)} | 02 · Define — Issues / Needs / North-Star Goal |
| ${mmss(ide.start)}–${mmss(why.end)} | 03 · Ideate — 84 แนวคิด → Memory Garden, ทำไมต้องเป็นแอป |
| ${mmss(phones[0].start)}–${mmss(phones[phones.length - 1].end)} | 04 · Prototype — ฟีเจอร์ของ Memory Garden |
| ${mmss(test.start)}–${mmss(res.end)} | 05 · Test — ทดสอบกับผู้ใช้จริง + ผลการประเมิน |
| ${range(fin)} | ปิดท้าย + QR ทดลองใช้งาน |

---

## 1. แนะนำโครงงาน · ${range(title)}
${speech(title.s)}

## 2. กระบวนการ Design Thinking · ${range(cycle)}
${speech(cycle.s)}

1. **Empathize**: เข้าใจผู้ใช้ (Understand User Needs)
2. **Define**: ระบุปัญหา (Synthesize & State Problem)
3. **Ideate**: ระดมไอเดีย (Brainstorm Solutions)
4. **Prototype**: สร้างต้นแบบ (Build & Represent Ideas)
5. **Test**: ทดสอบ (Gather Feedback & Refine)

---

## 3. Empathize: เข้าใจผู้ใช้ · ${mmss(emp.start)}–${mmss(map.end)}
${speech(emp.s)}

- **สัมภาษณ์ทั้งหมด ${STATS.interviewed} คน**: บุคลากรในโรงพยาบาล (แพทย์ พยาบาลวิชาชีพ) และญาติผู้ป่วย/ผู้สูงอายุที่มาตรวจที่โรงพยาบาล
- ในวิดีโอปิดหน้าผู้ถูกสัมภาษณ์ทุกคนด้วยสติกเกอร์เพื่อความเป็นส่วนตัว

### ตัวอย่างการสัมภาษณ์ (${mmss(ivs[0].start)}–${mmss(ivs[ivs.length - 1].end)})
${ivs.map((x) => `- **${roleOf(x.s) || 'ผู้ให้สัมภาษณ์'}**: “${quotes(x.s)}”`).join('\n')}

### Empathy Map ✏️ · ${mmss(mapHead.start)}–${mmss(map.end)}
${speech(mapHead.s)}

| What they See (เห็นสิ่งไหน) | What they Say (คำที่พูดออกมา) |
|---|---|
| ${EMPATHY.see.join('<br>')} | ${EMPATHY.say.join('<br>')} |
| **What they Feel (ความรู้สึก)** | **What they Do (สิ่งที่ปฏิบัติ/ทำ)** |
| ${EMPATHY.feel.join('<br>')} | ${EMPATHY.do.join('<br>')} |

---

## 4. Define: ระบุปัญหาที่แท้จริง · ${range(def)}
${speech(def.s)}

**Issues: ประเด็นสังคม ✏️**
${DEFINE.issues.map((x) => `- ${x}`).join('\n')}

**Needs: สิ่งที่ต้องการ ✏️**
${DEFINE.needs.map((x) => `- ${x}`).join('\n')}

> ⭐ **North-Star Goal:** ${DEFINE.goal}

---

## 5. Ideate: ระดมไอเดีย · ${range(ide)}
ระดมความคิดได้ทั้งหมด **${IDEAS.improve.length + IDEAS.newway.length + IDEAS.reimagine.length} แนวคิด** ✏️ แล้วนำมารวมกลุ่มเป็น 3 แนวทาง:

| แนวทาง | จำนวนแนวคิด | สัดส่วน | แนวคิดที่รวมได้ |
|---|---|---|---|
${[['improve', 'Improve (ปรับปรุงของเดิม)'], ['newway', 'Find a new way (หาวิธีใหม่)'], ['reimagine', 'ReImagine (คิดใหม่ทั้งหมด)']].map(([k, n]) => `| ${n} | ${IDEAS[k].length} | ${pct(k)}% | ${IDEATE[k].join(' · ')} |`).join('\n')}

**ไฮไลต์ทั้ง 3 แนวทางแล้วรวมกัน ได้ไอเดีย Memory Garden**
${IDEATE.merge.map(([en, th]) => `- **${en}**: ${th}`).join('\n')}
- ⇒ **${IDEATE.chosen}**

${[['improve', 'Improve'], ['newway', 'Find a new way'], ['reimagine', 'ReImagine']].map(([k, n]) => `<details><summary>${n}: ${IDEAS[k].length} แนวคิด</summary>\n\n${IDEAS[k].map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n</details>`).join('\n')}

### ทำไมต้องเป็นแอป? · ${range(why)}
${WHY.cards.map(([a, b]) => `- **${a}**: ${b}`).join('\n')}
- ⭐ **${WHY.goalK}**: ${WHY.goal}

> ${WHY.quote}

---

## 6. Prototype: Memory Garden · ${mmss(phones[0].start)}–${mmss(phones[phones.length - 1].end)}
| เวลา | หน้าจอ | รายละเอียด | ประเมิน |
|---|---|---|---|
${phones.map((x) => `| ${mmss(x.start)} | **${x.s.slide.title}** | ${x.s.slide.desc} | ${x.s.slide.tags.join(', ')} |`).join('\n')}

> ผลนี้ใช้สำหรับการคัดกรองเบื้องต้น **ไม่ใช่การวินิจฉัยโรค**

---

## 7. Test: ทดสอบกับผู้ใช้จริง · ${range(test)}
${speech(test.s)}

- **สถานที่:** โรงพยาบาลพระจอมเกล้า จ.เพชรบุรี
- **กลุ่มผู้ใช้:** อายุ 45 ปีขึ้นไป
- **เก็บข้อมูล:** ${STATS.collected} คน
- **ขั้นตอน:** ทดลองใช้งานระบบ → เก็บความพึงพอใจ → ความคิดเห็นและข้อเสนอแนะ → ปรับปรุงและพัฒนาระบบ

### ผลการประเมินความพึงพอใจ · ${range(res)}
คะแนนเฉลี่ยรวม **${SURVEY.overall.toFixed(2)} / 5** จากผู้ร่วมทดลองใช้ ${SURVEY.people} คน

| ด้าน | คะแนนเฉลี่ย (เต็ม 5) |
|---|---|
${SURVEY.aspects.map(([k, v]) => `| ${k} | ${v.toFixed(2)} |`).join('\n')}

**ข้อเสนอแนะจากผู้ใช้ (นำไปปรับปรุง)**
${SURVEY.quotes.map((q) => `- ${q}`).join('\n')}

---

## 8. ปิดท้าย · ${range(fin)}
**Memory Garden**: เว็บแอปพลิเคชันคัดกรองภาวะอัลไซเมอร์เบื้องต้น
ใช้สำหรับคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรค
📱 สแกน QR เพื่อทดลองใช้งาน: https://test-5-two-ruby.vercel.app/
**ขอบคุณครับ**

---

## ภาคผนวก: บทพูดของผู้นำเสนอ (ตามลำดับในวิดีโอ)
${at.filter((x) => x.s.type === 'talk').map((x) => `- **${mmss(x.start)}**: ${speech(x.s)}`).join('\n')}

---
<sub>สร้างจาก build/edl.mjs ด้วย \`node build/content.mjs\` · ข้อมูลผลประเมินใช้เฉพาะคะแนนและข้อเสนอแนะ ไม่มีข้อมูลส่วนตัวของผู้ตอบ</sub>
`;
fs.writeFileSync(new URL('../CONTENT.md', import.meta.url), md);
console.log('CONTENT.md written', mmss(T));
