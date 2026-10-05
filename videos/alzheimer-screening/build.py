"""Generate index.html for the Alzheimer's screening interview highlight.

Edit the CUTS / CARDS / SFX tables below and re-run `python3 build.py`.
Times in CARDS and SFX are output-timeline seconds.
"""
import html
import json

SRC = "assets/interview.mp4"
FADE = 0.12  # per-cut audio fade (s) to avoid clicks at joins

# (section, source_in, source_out) — cut at detected speech pauses
CUTS = [
    ("doctor", 21.75, 49.2),    # how screening is done: TMSE / MoCA / MMSE
    ("doctor", 92.6, 125.2),   # concern: 10+ min per patient, heavy caseload
    ("doctor", 144.4, 160.5),  # self-screening tech would help
    ("nurse", 190.4, 218.0),   # caregiver, meds, wandering, wristband
    ("nurse", 219.9, 234.8),   # relatives' caregiver stress
    ("staff", 320.4, 342.4),   # an app widens reach
    ("staff", 361.5, 372.9),   # paper: can be lost, unclear handwriting
    ("patient", 449.5, 456.6), # "ก็ดีนะ … เราจะได้รู้ตัวไง"
]
OUTRO = 5.0

clips = []
t = 0.0
for i, (sec, a, b) in enumerate(CUTS):
    d = round(b - a, 2)
    clips.append({"i": i, "sec": sec, "start": round(t, 2), "dur": d, "in": a})
    t += d
VIDEO_END = round(t, 2)
TOTAL = round(VIDEO_END + OUTRO, 2)
SECTION_START = {}
for c in clips:
    SECTION_START.setdefault(c["sec"], c["start"])

SECTIONS = [
    ("doctor", "01", "แพทย์", "มุมมองการตรวจคัดกรอง"),
    ("nurse", "02", "พยาบาล", "มุมมองการดูแลผู้ป่วยและญาติ"),
    ("staff", "03", "เจ้าหน้าที่", "กระดาษ vs แอปพลิเคชัน"),
    ("patient", "04", "ผู้รับบริการ", "เสียงจากผู้ที่เคยทำแบบทดสอบ"),
]


def sec_end(key):
    keys = [s[0] for s in SECTIONS]
    i = keys.index(key)
    return SECTION_START[keys[i + 1]] if i + 1 < len(keys) else VIDEO_END


e = html.escape


def clip_div(cid, start, dur, inner, track):
    return (
        f'<div id="{cid}" class="clip layer" data-start="{start}" '
        f'data-duration="{round(dur, 2)}" data-track-index="{track}">{inner}</div>'
    )


cards_html = []
anims = []  # JS lines
sfx = []  # (name, time, volume, media_start, duration)

D = SECTION_START["doctor"]
N = SECTION_START["nurse"]
S = SECTION_START["staff"]
P = SECTION_START["patient"]
c2 = clips[1]["start"]
c3 = clips[2]["start"]
c5 = clips[4]["start"]
c7 = clips[6]["start"]

# ---------- persistent chrome: series tag + progress bar ----------
cards_html.append(
    clip_div(
        "chrome", 0, VIDEO_END,
        '<div id="chrome-tag" class="tag"><span class="dot"></span>'
        "เสียงจากโรงพยาบาล · การคัดกรองโรคอัลไซเมอร์</div>"
        '<div id="progress"><div id="progress-fill"></div></div>',
        20,
    )
)
anims.append('tl.fromTo("#chrome-tag",{opacity:0,y:-16},{opacity:1,y:0,duration:0.5,ease:"power3.out"},0.2);')
anims.append(f'tl.fromTo("#progress-fill",{{scaleX:0}},{{scaleX:1,duration:{VIDEO_END},ease:"none"}},0);')

# ---------- opening title ----------
cards_html.append(
    clip_div(
        "title", 0, 4.8,
        '<div class="card title-card bl"><div class="kicker red">สัมภาษณ์บุคลากรการแพทย์ &amp; ผู้รับบริการ</div>'
        '<div class="title-xl"><span class="w">อัลไซเมอร์</span> '
        '<span class="w">คัดกรองเร็ว</span> <span class="w accent">รู้ตัวเร็ว</span></div></div>',
        21,
    )
)
anims.append('tl.fromTo("#title .card",{opacity:0,x:-60},{opacity:1,x:0,duration:0.6,ease:"expo.out"},0.15);')
anims.append('tl.fromTo("#title .w",{opacity:0,y:40},{opacity:1,y:0,duration:0.5,stagger:0.18,ease:"back.out(1.6)"},0.35);')
anims.append('tl.to("#title .card",{opacity:0,x:-40,duration:0.35,ease:"power2.in"},4.4);')
sfx += [("sfx_002", 0.1, 0.45), ("sfx_004", 0.7, 0.4), ("sfx_004", 0.88, 0.4), ("sfx_001", 1.05, 0.5)]

# ---------- section chips (top-left, under series tag) ----------
for key, num, name, sub in SECTIONS:
    s0, s1 = SECTION_START[key], sec_end(key)
    cid = f"sec-{key}"
    cards_html.append(
        clip_div(
            cid, s0, s1 - s0,
            f'<div class="section"><div class="num">{num}</div><div><div class="sname">{e(name)}</div>'
            f'<div class="ssub">{e(sub)}</div></div></div>',
            22,
        )
    )
    anims.append(f'tl.fromTo("#{cid} .section",{{opacity:0,x:-80}},{{opacity:1,x:0,duration:0.55,ease:"expo.out"}},{s0 + 0.15});')
    anims.append(f'tl.fromTo("#{cid} .num",{{scale:0.4}},{{scale:1,duration:0.5,ease:"back.out(2.2)"}},{s0 + 0.25});')
    if key != "doctor":
        sfx.append(("sfx_002", s0, 0.45))

# ---------- lower thirds ----------
LOWER = [
    ("lt-doc", D + 5.0, 5.0, "คุณหมอ", "แพทย์ผู้ตรวจคัดกรองภาวะสมองเสื่อม"),
    ("lt-n1", N + 0.8, 5.0, "พยาบาล", "มุมมองการดูแลผู้ป่วย"),
    ("lt-n2", c5 + 0.4, 4.6, "พยาบาล", "มุมมองญาติผู้ดูแล"),
    ("lt-staff", S + 0.6, 4.6, "เจ้าหน้าที่ / พยาบาล", "ผู้ใช้แบบประเมินในงานประจำวัน"),
    ("lt-pt", P + 0.3, 2.2, "ผู้รับบริการ", "ผู้ที่เคยลองทำแบบทดสอบ"),
]
for cid, s0, d, name, role in LOWER:
    cards_html.append(
        clip_div(cid, round(s0, 2), d,
                 f'<div class="lower"><div class="lbar"></div><div><div class="lname">{e(name)}</div>'
                 f'<div class="lrole">{e(role)}</div></div></div>', 23)
    )
    anims.append(f'tl.fromTo("#{cid} .lower",{{opacity:0,x:-50}},{{opacity:1,x:0,duration:0.5,ease:"expo.out"}},{s0});')
    anims.append(f'tl.fromTo("#{cid} .lbar",{{scaleY:0}},{{scaleY:1,duration:0.45,ease:"power3.out"}},{s0 + 0.05});')
    anims.append(f'tl.to("#{cid} .lower",{{opacity:0,x:-30,duration:0.3,ease:"power2.in"}},{s0 + d - 0.35});')
    sfx.append(("sfx_004", s0 + 0.02, 0.4))

# ---------- question kickers (top-right) ----------
QUESTIONS = [
    ("q1", D + 0.4, 9.0, "การคัดกรองโรคอัลไซเมอร์ ปัจจุบันมีวิธีไหนบ้าง?"),
    ("q2", c2 + 0.3, 8.0, "ในฐานะบุคลากร มีความกังวลเรื่องอัลไซเมอร์อย่างไร?"),
    ("q3", c3 + 0.2, 6.5, "ถ้ามีเทคโนโลยีให้คัดกรองได้ด้วยตัวเอง จะช่วยไหม?"),
    ("q4", N + 0.3, 6.0, "มีความกังวลเกี่ยวกับโรคอัลไซเมอร์อย่างไร?"),
    ("q5", S + 0.3, 7.0, "ถ้ามีแอปพลิเคชันมาช่วย จะช่วยบุคลากรได้มากขึ้นไหม?"),
    ("q6", c7 + 0.2, 5.0, "แบบทดสอบกระดาษ มีข้อดี–ข้อเสียอย่างไร?"),
    ("q7", P + 0.2, 6.6, "ถ้ามีแอปช่วยให้รู้ก่อนจะเป็นหนัก ดีไหม?"),
]
for cid, s0, d, q in QUESTIONS:
    cards_html.append(
        clip_div(cid, round(s0, 2), d,
                 f'<div class="question"><div class="qmark">Q</div><div class="qtext">{e(q)}</div></div>', 24)
    )
    anims.append(f'tl.fromTo("#{cid} .question",{{opacity:0,y:-30}},{{opacity:1,y:0,duration:0.5,ease:"expo.out"}},{s0});')
    anims.append(f'tl.fromTo("#{cid} .qmark",{{rotation:-90,scale:0}},{{rotation:0,scale:1,duration:0.5,ease:"back.out(2)"}},{s0 + 0.1});')
    anims.append(f'tl.to("#{cid} .question",{{opacity:0,y:-20,duration:0.3,ease:"power2.in"}},{s0 + d - 0.35});')
    sfx.append(("sfx_003", s0 - 0.05, 0.35))

# ---------- badge-pop: 3 standard screening tests ----------
B0, B1 = 15.0 - 4.65, clips[0]["start"] + clips[0]["dur"] - 0.2
cards_html.append(
    clip_div(
        "tests", B0, B1 - B0,
        '<div class="card panel br" id="tests-panel">'
        '<div class="kicker">แบบทดสอบคัดกรองที่ได้รับการรับรองคุณภาพ</div>'
        '<div class="tests-row"><div class="badge-slot"></div><div class="chips">'
        '<div class="chip"><b>TMSE</b><span>แบบทดสอบของไทย</span></div>'
        '<div class="chip"><b>MoCA</b><span>มาตรฐานสากล</span></div>'
        '<div class="chip"><b>MMSE</b><span>มาตรฐานสากล</span></div>'
        "</div></div></div>",
        25,
    )
)
anims.append(f'tl.fromTo("#tests-panel",{{opacity:0,y:60}},{{opacity:1,y:0,duration:0.6,ease:"expo.out"}},{B0});')
for k, at in enumerate([B0 + 3.2, B0 + 8.5, B0 + 9.6]):
    anims.append(f'tl.fromTo("#tests .chip:nth-child({k + 1})",{{opacity:0,x:40,scale:0.9}},{{opacity:1,x:0,scale:1,duration:0.45,ease:"back.out(1.8)"}},{at});')
    sfx.append(("sfx_004", at, 0.45))
anims.append(f'tl.to("#tests-panel",{{opacity:0,y:40,duration:0.35,ease:"power2.in"}},{B1 - 0.4});')
# the badge sub-composition host (user snippet), mounted inside the panel area
BADGE_START = round(B0 + 0.3, 2)
sfx += [("sfx_002", B0 - 0.05, 0.35), ("sfx_001", BADGE_START + 0.7, 0.6), ("sfx_007", BADGE_START + 1.15, 0.35)]

# ---------- stat: 10+ minutes per patient ----------
T0 = c2 + 14.5
T1 = c3 - 0.2
cards_html.append(
    clip_div(
        "stat", T0, T1 - T0,
        '<div class="card panel br stat"><div class="kicker red">ข้อกังวลด้านการทำงาน</div>'
        '<div class="stat-row"><div class="big"><span id="stat-num" data-layout-allow-overlap>0</span><span class="plus" data-layout-allow-overlap>+</span></div>'
        '<div class="unit">นาที<br/>ต่อผู้ป่วย 1 คน</div></div>'
        '<div class="note">หากตรวจคัดกรองอย่างครบถ้วน</div>'
        '<div class="note2" id="stat-note2"><span class="arrow">→</span> คนไข้ต่อวันเยอะ อาจกระทบการตรวจในแต่ละวัน</div></div>',
        26,
    )
)
anims.append(f'tl.fromTo("#stat .card",{{opacity:0,y:60}},{{opacity:1,y:0,duration:0.6,ease:"expo.out"}},{T0});')
anims.append(
    f'(function(){{var o={{v:0}};tl.to(o,{{v:10,duration:1.4,ease:"power2.out",onUpdate:function(){{'
    f'document.getElementById("stat-num").textContent=Math.round(o.v);}}}},{T0 + 0.3});}})();'
)
anims.append(f'tl.fromTo("#stat .plus",{{scale:0,opacity:0}},{{scale:1,opacity:1,duration:0.4,ease:"back.out(3)"}},{T0 + 1.7});')
anims.append(f'tl.fromTo("#stat-note2",{{opacity:0,x:30}},{{opacity:1,x:0,duration:0.5,ease:"expo.out"}},{T0 + 7.0});')
anims.append(f'tl.to("#stat .card",{{opacity:0,y:40,duration:0.35,ease:"power2.in"}},{T1 - 0.4});')
sfx += [("sfx_006", T0 + 0.3 - 1.4, 0.3, 8.5, 1.5), ("sfx_007", T0 + 1.7, 0.45), ("sfx_004", T0 + 7.0, 0.4)]

# ---------- benefits of self-screening tech ----------
def checklist(cid, s0, s1, kicker, title, items, at, track, red=False):
    lis = "".join(f'<li><span class="tick">✓</span><span>{e(x)}</span></li>' for x in items)
    cards_html.append(
        clip_div(cid, round(s0, 2), round(s1 - s0, 2),
                 f'<div class="card panel br list"><div class="kicker{" red" if red else ""}">{e(kicker)}</div>'
                 f'<div class="ltitle">{e(title)}</div><ul>{lis}</ul></div>', track)
    )
    anims.append(f'tl.fromTo("#{cid} .card",{{opacity:0,y:60}},{{opacity:1,y:0,duration:0.6,ease:"expo.out"}},{s0});')
    for k, a in enumerate(at):
        anims.append(f'tl.fromTo("#{cid} li:nth-child({k + 1})",{{opacity:0,x:40}},{{opacity:1,x:0,duration:0.45,ease:"expo.out"}},{a});')
        anims.append(f'tl.fromTo("#{cid} li:nth-child({k + 1}) .tick",{{scale:0}},{{scale:1,duration:0.4,ease:"back.out(3)"}},{a + 0.1});')
        sfx.append(("sfx_004", a, 0.4))
    anims.append(f'tl.to("#{cid} .card",{{opacity:0,y:40,duration:0.35,ease:"power2.in"}},{s1 - 0.4});')
    sfx.append(("sfx_002", s0 - 0.05, 0.3))


checklist("benefit", c3 + 6.0, N - 0.2, "ถ้าคัดกรองได้ด้วยตัวเอง", "ประโยชน์ที่คุณหมอมองเห็น",
          ["บอกความเสี่ยงคร่าว ๆ ได้ตั้งแต่แรก", "ช่วยการตัดสินใจในการตรวจ", "ลดเวลาในการตรวจได้"],
          [c3 + 6.8, c3 + 9.5, c3 + 12.5], 27)

checklist("care", N + 6.5, c5 - 0.2, "ความกังวลของพยาบาล", "ผู้ป่วยต้องมีผู้ดูแลอย่างใกล้ชิด",
          ["การจัดยา — กินยาครบหรือไม่", "พลัดหลง สูญหายไปนอกบ้าน", "ล็อกประตู · ป้ายข้อมือพร้อมเบอร์โทร"],
          [N + 8.0, N + 13.0, N + 19.5], 28, red=True)

# ---------- caregiver stress quote ----------
Q0, Q1 = c5 + 5.2, S - 0.2
cards_html.append(
    clip_div("stress", Q0, Q1 - Q0,
             '<div class="card quote br"><div class="qq">“</div><div class="qbody">ญาติอาจไม่เข้าใจตัวโรคและการดำเนินของโรค '
             'ทำให้ผู้ดูแล<span class="hl">เครียดง่าย</span></div><div class="qsrc">— พยาบาล, มุมมองญาติผู้ดูแล</div></div>', 29)
)
anims.append(f'tl.fromTo("#stress .card",{{opacity:0,y:60}},{{opacity:1,y:0,duration:0.6,ease:"expo.out"}},{Q0});')
anims.append(f'tl.fromTo("#stress .qq",{{scale:0,rotation:-30}},{{scale:1,rotation:0,duration:0.5,ease:"back.out(2.4)"}},{Q0 + 0.15});')
anims.append(f'tl.fromTo("#stress .hl",{{backgroundSize:"0% 100%"}},{{backgroundSize:"100% 100%",duration:0.6,ease:"power2.out"}},{Q0 + 1.2});')
anims.append(f'tl.to("#stress .card",{{opacity:0,y:40,duration:0.35,ease:"power2.in"}},{Q1 - 0.4});')
sfx += [("sfx_002", Q0 - 0.05, 0.3), ("sfx_008", Q0 + 1.2, 0.3)]

# ---------- app flow ----------
F0, F1 = S + 7.6, c7 - 0.2
steps = ["ทำเป็นแอป เข้าถึงง่าย", "คนมาประเมินได้มากขึ้น", "ตระหนัก → พบแพทย์วินิจฉัย"]
flow = '<span class="farrow">→</span>'.join(f'<div class="fstep"><div class="fnum">{i + 1}</div><div>{e(s)}</div></div>' for i, s in enumerate(steps))
cards_html.append(
    clip_div("flow", F0, F1 - F0,
             f'<div class="card bc flowcard"><div class="kicker">ถ้ามีแอปพลิเคชันช่วยคัดกรอง</div><div class="frow">{flow}</div></div>', 30)
)
anims.append(f'tl.fromTo("#flow .card",{{opacity:0,y:60}},{{opacity:1,y:0,duration:0.6,ease:"expo.out"}},{F0});')
for k, a in enumerate([F0 + 0.5, F0 + 3.5, F0 + 7.5]):
    anims.append(f'tl.fromTo("#flow .fstep:nth-of-type({k + 1})",{{opacity:0,y:30,scale:0.9}},{{opacity:1,y:0,scale:1,duration:0.5,ease:"back.out(1.8)"}},{a});')
    if k:
        anims.append(f'tl.fromTo("#flow .farrow:nth-of-type({k})",{{opacity:0,x:-20}},{{opacity:1,x:0,duration:0.35,ease:"power2.out"}},{a - 0.25});')
    sfx.append(("sfx_001" if k == 2 else "sfx_004", a, 0.4))
anims.append(f'tl.to("#flow .card",{{opacity:0,y:40,duration:0.35,ease:"power2.in"}},{F1 - 0.4});')
sfx.append(("sfx_002", F0 - 0.05, 0.3))

# ---------- paper vs app ----------
V0, V1 = c7 + 4.0, P - 0.2
cards_html.append(
    clip_div("versus", V0, V1 - V0,
             '<div class="card panel br versus"><div class="col bad"><div class="ch">แบบประเมินกระดาษ</div>'
             '<div class="it"><span class="x">✕</span>อาจสูญหายได้</div><div class="it"><span class="x">✕</span>เขียนไม่ชัดเจน</div></div>'
             '<div class="vs">VS</div><div class="col good"><div class="ch">แอปพลิเคชัน</div>'
             '<div class="it"><span class="ok">✓</span>เข้าถึงได้ง่าย</div><div class="it"><span class="ok">✓</span>คัดกรองได้มากขึ้น</div></div></div>', 31)
)
anims.append(f'tl.fromTo("#versus .card",{{opacity:0,y:60}},{{opacity:1,y:0,duration:0.6,ease:"expo.out"}},{V0});')
anims.append(f'tl.fromTo("#versus .bad .it",{{opacity:0,x:-30}},{{opacity:1,x:0,duration:0.4,stagger:1.2,ease:"expo.out"}},{V0 + 0.6});')
anims.append(f'tl.fromTo("#versus .vs",{{scale:0}},{{scale:1,duration:0.45,ease:"back.out(3)"}},{V0 + 3.2});')
anims.append(f'tl.fromTo("#versus .good .it",{{opacity:0,x:30}},{{opacity:1,x:0,duration:0.4,stagger:0.5,ease:"expo.out"}},{V0 + 3.6});')
anims.append(f'tl.to("#versus .card",{{opacity:0,y:40,duration:0.35,ease:"power2.in"}},{V1 - 0.4});')
sfx += [("sfx_002", V0 - 0.05, 0.3), ("sfx_004", V0 + 0.6, 0.4), ("sfx_004", V0 + 1.8, 0.4),
        ("sfx_001", V0 + 3.2, 0.5), ("sfx_004", V0 + 3.6, 0.4), ("sfx_004", V0 + 4.1, 0.4)]

# ---------- patient pull-quote ----------
PQ0 = P + 2.6
cards_html.append(
    clip_div("pquote", PQ0, VIDEO_END - PQ0,
             '<div class="card quote bc big"><div class="qbody">“ก็ดีนะ <span class="hl">เราจะได้รู้ตัว</span>ไง”</div>'
             '<div class="qsrc">— ผู้รับบริการ</div></div>', 32)
)
anims.append(f'tl.fromTo("#pquote .card",{{opacity:0,scale:0.85}},{{opacity:1,scale:1,duration:0.6,ease:"back.out(1.6)"}},{PQ0});')
anims.append(f'tl.fromTo("#pquote .hl",{{backgroundSize:"0% 100%"}},{{backgroundSize:"100% 100%",duration:0.6,ease:"power2.out"}},{PQ0 + 1.6});')
sfx += [("sfx_008", PQ0, 0.35)]

# ---------- outro ----------
cards_html.append(
    clip_div("outro", VIDEO_END, OUTRO,
             '<div id="outro-bg"><div class="o-left"><div class="o-title">คัดกรองเร็ว<br/><span class="accent">รู้ตัวเร็ว</span></div>'
             '<div class="o-sub">ขอขอบคุณบุคลากรทางการแพทย์และผู้รับบริการทุกท่าน</div></div>'
             '<div class="o-qr"><div class="qr-frame"><img id="qr-img" src="assets/qr-screening.jpg" alt="QR"/></div>'
             '<div class="qr-cap"><span class="qr-dot"></span>สแกนเพื่อทำแบบคัดกรอง</div></div></div>', 33)
)
anims.append(f'tl.fromTo("#outro-bg",{{opacity:0}},{{opacity:1,duration:0.3,ease:"power2.out"}},{VIDEO_END});')
anims.append(f'tl.fromTo("#outro .o-title",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.5,ease:"expo.out"}},{VIDEO_END + 0.1});')
anims.append(f'tl.fromTo("#outro .o-sub",{{opacity:0}},{{opacity:1,duration:0.4}},{VIDEO_END + 0.45});')
anims.append(f'tl.fromTo("#outro .o-qr",{{opacity:0,scale:0.92}},{{opacity:1,scale:1,duration:0.55,ease:"back.out(1.7)"}},{VIDEO_END + 0.35});')
anims.append(f'tl.fromTo("#outro .qr-frame",{{boxShadow:"0 0 0 0px rgba(239,68,68,0)"}},{{boxShadow:"0 0 0 10px rgba(239,68,68,1)",duration:0.4,ease:"power2.out"}},{VIDEO_END + 0.8});')
anims.append(f'tl.fromTo("#outro .qr-cap",{{opacity:0,y:16}},{{opacity:1,y:0,duration:0.4,ease:"expo.out"}},{VIDEO_END + 0.9});')
sfx.append(("sfx_007", VIDEO_END + 0.85, 0.45))
sfx.append(("sfx_005", VIDEO_END + 0.05, 0.4))

# ---------- video clips + subtle punch-in on alternating cuts ----------
videos = []
for c in clips:
    d = c["dur"]
    lane = {"version": 1, "lanes": [{"target": "volume", "points": [
        {"t": 0, "v": 0}, {"t": FADE, "v": 1}, {"t": round(d - FADE, 2), "v": 1}, {"t": d, "v": 0}]}]}
    videos.append(
        f'<video id="v{c["i"] + 1}" class="vclip" src="{SRC}" playsinline data-has-audio="true" '
        f'data-start="{c["start"]}" data-duration="{d}" data-media-start="{c["in"]}" data-track-index="{c["i"] % 2}" '
        f"data-automation='{json.dumps(lane)}'></video>"
    )
    scale = 1.0 if c["i"] % 2 == 0 else 1.07
    anims.append(f'tl.set("#video-zoom",{{scale:{scale}}},{c["start"]});')
    if c["i"] > 0 and c["sec"] == clips[c["i"] - 1]["sec"]:
        sfx.append(("sfx_003", c["start"] - 0.08, 0.25))
    # slow push-in within each clip for life
    anims.append(f'tl.fromTo("#video-drift",{{scale:1}},{{scale:1.035,duration:{d},ease:"none"}},{c["start"]});')

# ---------- SFX audio elements ----------
SFX_DUR = {"sfx_001": 0.7, "sfx_002": 0.6, "sfx_003": 0.6, "sfx_004": 0.4, "sfx_005": 2.5,
           "sfx_006": 10.0, "sfx_007": 1.3, "sfx_008": 1.8}
audios = []
for k, s in enumerate(sorted(sfx, key=lambda x: x[1])):
    name, at, vol = s[0], max(0.0, round(s[1], 2)), s[2]
    ms = s[3] if len(s) > 3 else 0
    dur = s[4] if len(s) > 4 else SFX_DUR[name]
    dur = round(min(dur, TOTAL - at), 2)
    extra = f' data-media-start="{ms}"' if ms else ""
    audios.append(
        f'<audio id="sfx-{k + 1:02d}" src=".media/audio/sfx/{name}.mp3" data-start="{at}" '
        f'data-duration="{dur}"{extra} data-track-index="{40 + k % 4}" data-volume="{vol}"></audio>'
    )

badge_host = (
    '<div id="badge-host" data-composition-id="badge-pop" '
    'data-composition-src="compositions/components/badge-pop.html" '
    "data-variable-values='{\"count\": \"3\", \"accent\": \"red\", \"surface\": \"light\"}' "
    f'data-start="{BADGE_START}" data-duration="{round(B1 - 0.4 - BADGE_START, 2)}" data-track-index="35" '
    'data-width="220" data-height="220"></div>'
)

FONT_FACES = "\n".join(
    f'@font-face{{font-family:"Plex Thai";font-weight:{w};font-display:block;'
    f'src:url("assets/fonts/ibm-plex-sans-thai-{sub}-{w}-normal.woff2") format("woff2");'
    f'unicode-range:{rng};}}'
    for w in (400, 600, 700)
    for sub, rng in (("thai", "U+0E01-0E5B,U+200C-200D,U+25CC"), ("latin", "U+0000-00FF,U+2013-2014,U+2018-201D,U+2026,U+2192,U+2713,U+2715"))
)

CSS = FONT_FACES + """
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:#0b1220}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"Plex Thai",sans-serif;color:#0f172a;
  --ink:#0f172a;--muted:#475569;--red:#ef4444;--red-ink:#b91c1c;--teal:#0e7490;--paper:rgba(255,255,255,.95)}
#video-zoom,#video-drift{position:absolute;inset:0;transform-origin:50% 40%}
.vclip{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
#vignette{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(15,23,42,.35) 0%,rgba(15,23,42,0) 22%,rgba(15,23,42,0) 58%,rgba(15,23,42,.55) 100%)}
.layer{position:absolute;inset:0}
.tag{position:absolute;left:56px;top:44px;display:flex;align-items:center;gap:12px;padding:10px 20px;border-radius:999px;
  background:rgba(15,23,42,.72);color:#f8fafc;font-size:22px;font-weight:600;letter-spacing:.01em}
.tag .dot{width:12px;height:12px;border-radius:50%;background:var(--red);box-shadow:0 0 0 5px rgba(239,68,68,.3)}
#progress{position:absolute;left:0;right:0;bottom:0;height:8px;background:rgba(255,255,255,.25)}
#progress-fill{position:absolute;inset:0;background:var(--red);transform-origin:0 50%}
.section{position:absolute;left:56px;top:112px;display:flex;align-items:center;gap:16px;padding:12px 26px 12px 12px;
  border-radius:16px;background:var(--paper);box-shadow:0 18px 48px rgba(2,6,23,.25)}
.section .num{width:64px;height:64px;border-radius:12px;background:var(--red);color:#fff;display:grid;place-items:center;
  font-size:30px;font-weight:700}
.sname{font-size:32px;font-weight:700;line-height:1.15}
.ssub{font-size:20px;color:var(--muted);font-weight:600}
.card{position:absolute;background:var(--paper);border-radius:22px;box-shadow:0 28px 70px rgba(2,6,23,.35);padding:30px 38px}
.bl{left:56px;bottom:72px}
.br{right:56px;bottom:72px}
.bc{left:50%;bottom:72px;margin-left:-760px;width:1520px}
.kicker{font-size:22px;font-weight:700;color:var(--teal);letter-spacing:.02em;margin-bottom:10px}
.kicker.red{color:var(--red-ink)}
.title-card{width:1100px;border-left:12px solid var(--red)}
.title-xl{margin-top:18px;font-size:84px;font-weight:700;line-height:1.35;display:flex;flex-wrap:wrap;gap:0 24px}
.title-xl .w{display:inline-block}
.accent{color:var(--red-ink)}
.lower{position:absolute;left:56px;bottom:72px;display:flex;align-items:stretch;gap:18px;padding:18px 34px 18px 18px;
  background:var(--paper);border-radius:16px;box-shadow:0 18px 48px rgba(2,6,23,.3)}
.lbar{width:10px;border-radius:6px;background:var(--red);transform-origin:50% 100%}
.lname{font-size:40px;font-weight:700;line-height:1.15}
.lrole{font-size:24px;color:var(--muted);font-weight:600}
.question{position:absolute;right:56px;top:44px;display:flex;align-items:center;gap:18px;max-width:900px;padding:16px 28px 16px 16px;
  background:rgba(15,23,42,.82);color:#f8fafc;border-radius:18px}
.qmark{flex:none;width:56px;height:56px;border-radius:50%;background:var(--red);display:grid;place-items:center;font-size:30px;font-weight:700}
.qtext{font-size:30px;font-weight:600;line-height:1.35}
.panel{width:820px}
.tests-row{display:flex;align-items:center;gap:26px}
.badge-slot{flex:none;width:220px;height:220px}
#badge-host{position:absolute;right:654px;bottom:122px;width:220px;height:220px}
.chips{display:flex;flex-direction:column;gap:14px;flex:1}
.chip{display:flex;align-items:baseline;gap:16px;padding:12px 20px;border-radius:14px;background:#f1f5f9;border-left:8px solid var(--red)}
.chip b{font-size:40px;font-weight:700;letter-spacing:.02em}
.chip span{font-size:22px;color:var(--muted);font-weight:600}
.stat-row{display:flex;align-items:flex-end;gap:22px}
.big{margin-top:24px;font-size:170px;font-weight:700;line-height:1.15;color:var(--red-ink);display:flex}
.plus{display:inline-block}
.unit{font-size:40px;font-weight:700;line-height:1.25;padding-bottom:18px}
.note{font-size:24px;color:var(--muted);font-weight:600;margin-top:22px}
.note2{margin-top:16px;padding:14px 18px;border-radius:12px;background:#fef2f2;color:var(--red-ink);font-size:28px;font-weight:700}
.list ul{list-style:none;display:flex;flex-direction:column;gap:14px;margin-top:8px}
.ltitle{font-size:40px;font-weight:700;line-height:1.25;margin-bottom:8px}
.list li{display:flex;align-items:center;gap:16px;font-size:32px;font-weight:600}
.tick{flex:none;width:44px;height:44px;border-radius:50%;background:var(--teal);color:#fff;display:grid;place-items:center;font-size:26px;font-weight:700}
.quote{width:1000px;border-left:12px solid var(--red)}
.quote .qq{position:absolute;right:30px;top:-20px;font-size:140px;line-height:1;color:var(--red);font-weight:700}
.qbody{font-size:46px;font-weight:700;line-height:1.4}
.hl{background-image:linear-gradient(transparent 58%,rgba(239,68,68,.35) 58%);background-repeat:no-repeat;background-size:0% 100%}
.qsrc{display:block;margin-top:12px;font-size:24px;color:var(--muted);font-weight:600}
.quote.big{display:block;width:1300px;margin-left:-650px;text-align:center;border-left:none;border-bottom:12px solid var(--red)}
.quote.big .qbody{font-size:76px}
.flowcard .frow{display:flex;align-items:center;gap:22px}
.fstep{flex:1;display:flex;align-items:center;gap:16px;padding:20px 22px;border-radius:16px;background:#f1f5f9;font-size:30px;font-weight:700;line-height:1.3}
.fnum{flex:none;width:52px;height:52px;border-radius:50%;background:var(--red);color:#fff;display:grid;place-items:center;font-size:28px}
.farrow{font-size:48px;color:var(--red);font-weight:700}
.versus{width:1100px;display:flex;align-items:stretch;gap:28px}
.versus .col{flex:1;padding:20px 24px;border-radius:16px}
.versus .bad{background:#fef2f2}
.versus .good{background:#ecfeff}
.ch{font-size:32px;font-weight:700;margin-bottom:10px}
.it{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:600;margin-top:8px}
.x{color:var(--red-ink);font-weight:700}
.ok{color:var(--teal);font-weight:700}
.vs{align-self:center;width:84px;height:84px;flex:none;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:30px;font-weight:700}
#outro-bg{position:absolute;inset:0;background:#f8fafc;display:flex;align-items:center;justify-content:center;gap:140px}
.o-left{display:flex;flex-direction:column;gap:28px;max-width:860px}
.o-title{font-size:120px;font-weight:700;line-height:1.3}
.o-qr{display:flex;flex-direction:column;align-items:center;gap:30px}
.qr-frame{width:480px;height:480px;padding:30px;background:#fff;border-radius:28px}
#qr-img{display:block;width:420px;height:420px}
.qr-cap{display:flex;align-items:center;gap:14px;font-size:40px;font-weight:700}
.qr-dot{width:16px;height:16px;border-radius:50%;background:var(--red)}
.o-sub{font-size:34px;color:var(--muted);font-weight:600}
"""

page = f"""<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Alzheimer's Screening Interviews</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
{CSS}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1920" data-height="1080">
      <div id="video-zoom"><div id="video-drift">
        {chr(10).join("        " + v for v in videos).strip()}
      </div></div>
      <div id="vignette"></div>
      {chr(10).join("      " + c for c in cards_html).strip()}
      {badge_host}
      {chr(10).join("      " + a for a in audios).strip()}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      {chr(10).join("      " + a for a in anims).strip()}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""
open("index.html", "w").write(page)
print("clips", [(c["start"], c["dur"]) for c in clips])
print("video_end", VIDEO_END, "total", TOTAL, "sfx", len(audios), "cards", len(cards_html))
