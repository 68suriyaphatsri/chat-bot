// Generates index.html from the edit decision list in edl.mjs.
// Run: node build/build.mjs   (then: npx hyperframes check)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOURCES, SECTIONS } from './edl.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = 1920, H = 1080, FPS = 30;
const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
// Keep these words whole so a caption never pops one in syllable by syllable.
const KEEP = ['อัลไซเมอร์', 'สมองเสื่อม', 'แอปพลิเคชัน', 'เทคโนโลยี', 'แบบทดสอบ', 'ความจำ', 'ความเสี่ยง', 'ปรึกษา', 'ครอบครัว',
  'ผู้ดูแล', 'พลัดหลง', 'น่าเชื่อถือ', 'ประเมิน', 'วินิจฉัย', 'คัดกรอง', 'ใกล้ชิด', 'โรงพยาบาล', 'มหาวิทยาลัย', 'ด้วยตัวเอง',
  'มากขึ้น', 'เร็วขึ้น', 'ไม่เครียด', 'ไม่มีเลย', 'ก็ดีนะ', 'ก็กังวลอยู่', 'ตั้งแต่ตัวเอง', 'สูญหาย', 'แพร่หลาย', 'ตระหนัก'];
const seg = {
  segment(text) {
    const toks = [...segmenter.segment(text)].map((x) => x.segment);
    const out = [];
    for (let i = 0; i < toks.length;) {
      let merged = false;
      for (const k of KEEP) {
        let acc = '', j = i;
        while (j < toks.length && acc.length < k.length) acc += toks[j++];
        if (acc === k && j - i > 1) { out.push(k); i = j; merged = true; break; }
      }
      if (!merged) out.push(toks[i++]);
    }
    return out.map((segment) => ({ segment }));
  },
};
const r3 = (n) => Math.round(n * 1000) / 1000;
const snap = (n) => Math.round(n * FPS) / FPS; // frame-align cut points
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Deterministic PRNG for burst placement.
function prng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

const html = [];   // timed DOM
const tw = [];     // timeline statements
const sfx = [];    // {t, file, vol}
const speech = []; // [t0, t1] windows where footage audio plays (for BGM ducking)
let uid = 0;
const id = (p) => `${p}-${++uid}`;
let T = 0;

const SFX = {
  pop: 'assets/audio/sfx/pop.mp3',
  sparkle: 'assets/audio/sfx/sparkle.mp3',
  whoosh: 'assets/audio/sfx/whoosh.mp3',
  whooshShort: 'assets/audio/sfx/whoosh-short.mp3',
  click: 'assets/audio/sfx/click-soft.mp3',
  chime: 'assets/audio/sfx/chime.mp3',
  ping: 'assets/audio/sfx/ping.mp3',
};
const addSfx = (t, k, vol = 0.5) => sfx.push({ t: r3(t), file: SFX[k], vol });

// ---------- sparkle svg ----------
const sparkleSvg = (cls, color = 'var(--sun)') =>
  `<svg class="${cls}" viewBox="0 0 100 100"><path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0Z" fill="${color}"/></svg>`;

// ---------- icons (simple line icons, inline SVG) ----------
const ICON = {
  pill: '<svg viewBox="0 0 48 48"><rect x="6" y="17" width="36" height="14" rx="7" transform="rotate(-35 24 24)" fill="none" stroke="currentColor" stroke-width="4"/><line x1="18" y1="32" x2="30" y2="16" stroke="currentColor" stroke-width="4"/></svg>',
  pin: '<svg viewBox="0 0 48 48"><path d="M24 44s14-14 14-24a14 14 0 0 0-28 0c0 10 14 24 14 24z" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="24" cy="20" r="5" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 48 48"><rect x="9" y="21" width="30" height="21" rx="4" fill="none" stroke="currentColor" stroke-width="4"/><path d="M16 21v-6a8 8 0 0 1 16 0v6" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
  tag: '<svg viewBox="0 0 48 48"><path d="M6 24 22 8h18v18L24 42z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><circle cx="32" cy="16" r="3.5" fill="currentColor"/></svg>',
  heart: '<svg viewBox="0 0 48 48"><path d="M24 41S6 30 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 13-18 24-18 24z" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
  play: '<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="28" rx="8" fill="none" stroke="currentColor" stroke-width="4"/><path d="M20 17v14l12-7z" fill="currentColor"/></svg>',
  search: '<svg viewBox="0 0 48 48"><circle cx="21" cy="21" r="13" fill="none" stroke="currentColor" stroke-width="4"/><line x1="31" y1="31" x2="42" y2="42" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
  spark: '<svg viewBox="0 0 48 48"><path d="M24 4l4 14 14 6-14 6-4 14-4-14-14-6 14-6z" fill="currentColor"/></svg>',
  hosp: '<svg viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="4"/><path d="M24 15v14M17 22h14" stroke="currentColor" stroke-width="5"/></svg>',
  paper: '<svg viewBox="0 0 48 48"><path d="M12 4h17l9 9v31H12z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M18 22h14M18 30h14M18 38h8" stroke="currentColor" stroke-width="3.5"/></svg>',
  phone: '<svg viewBox="0 0 48 48"><rect x="13" y="3" width="22" height="42" rx="5" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="24" cy="38" r="2.5" fill="currentColor"/></svg>',
  clock: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="4"/><path d="M24 13v12l8 5" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
  x: '<svg viewBox="0 0 48 48"><path d="M12 12l24 24M36 12 12 36" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 48 48"><path d="M9 25l10 10 20-22" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  brain: '<svg viewBox="0 0 48 48"><path d="M18 8a7 7 0 0 0-7 7 7 7 0 0 0-4 12 7 7 0 0 0 6 11 6 6 0 0 0 11 2V10a6 6 0 0 0-6-2zM30 8a7 7 0 0 1 7 7 7 7 0 0 1 4 12 7 7 0 0 1-6 11 6 6 0 0 1-11 2V10a6 6 0 0 1 6-2z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/></svg>',
};

// ---------- captions ----------
function captionHtml(text, role, hl, t0, t1, end) {
  const cid = id('cap');
  const words = [...seg.segment(text)].map((s) => s.segment);
  const weights = words.map((w) => (w.trim() ? Math.max(1, w.length) : 0.4));
  const total = weights.reduce((a, b) => a + b, 0);
  const span = Math.max(0.25, (t1 - t0) * 0.85);
  let acc = 0;
  const hlAt = new Map();
  for (const h of hl || []) {
    const [word, color] = Array.isArray(h) ? h : [h, 'y'];
    const toks = [...seg.segment(word)].map((x) => x.segment).filter((x) => x.trim());
    for (let i = 0; i + toks.length <= words.length; i++) {
      if (toks.every((tk, k) => words[i + k] === tk)) toks.forEach((_, k) => hlAt.set(i + k, color));
    }
  }
  const spans = words.map((w, i) => {
    const at = t0 + (acc / total) * span; acc += weights[i];
    if (!w.trim()) return '<span class="sp"> </span>';
    let cls = 'w';
    if (hlAt.has(i)) cls += ` hl-${hlAt.get(i)}`;
    const wid = id('w');
    tw.push(`tl.fromTo('#${wid}',{opacity:0,y:18,scale:0.7},{opacity:1,y:0,scale:1,duration:0.16,ease:'back.out(2.4)'},${r3(at)});`);
    return `<span id="${wid}" class="${cls}">${esc(w)}</span>`;
  }).join('');
  html.push(`<div id="${cid}" class="clip cap cap-${role}" data-start="${r3(t0 - 0.04)}" data-duration="${r3(end - t0 + 0.04)}" data-track-index="20"><div class="cap-inner">${spans}</div></div>`);
}

// ---------- overlays ----------
function nameCard(t, o) {
  const nid = id('name'), dur = o.dur || 4.2;
  html.push(`<div id="${nid}" class="clip namecard-layer" data-start="${r3(t)}" data-duration="${dur}" data-track-index="12">
  <div class="namecard pos-${o.pos || 'left'}">
    <div class="nc-tag">${esc(o.tag || 'ผู้ให้สัมภาษณ์')}</div>
    <div class="nc-role">${esc(o.role)}</div>
    <div class="nc-sub">${esc(o.sub || '')}</div>
    ${sparkleSvg('nc-sp nc-sp1')}${sparkleSvg('nc-sp nc-sp2', 'var(--mint)')}${sparkleSvg('nc-sp nc-sp3')}
  </div></div>`);
  const s = `#${nid}`;
  tw.push(`tl.fromTo('${s} .namecard',{x:-80,opacity:0,scale:0.85,rotation:-3},{x:0,opacity:1,scale:1,rotation:0,duration:0.45,ease:'back.out(1.8)'},${r3(t)});`);
  tw.push(`tl.fromTo('${s} .nc-tag',{opacity:0,y:-14},{opacity:1,y:0,duration:0.25,ease:'power2.out'},${r3(t + 0.2)});`);
  tw.push(`tl.fromTo('${s} .nc-role',{opacity:0,x:-30},{opacity:1,x:0,duration:0.3,ease:'power3.out'},${r3(t + 0.15)});`);
  tw.push(`tl.fromTo('${s} .nc-sub',{opacity:0,x:-20},{opacity:1,x:0,duration:0.3,ease:'power3.out'},${r3(t + 0.3)});`);
  tw.push(`tl.fromTo('${s} .nc-sp',{scale:0,rotation:-90},{scale:1,rotation:0,duration:0.4,ease:'back.out(3)',stagger:0.12},${r3(t + 0.35)});`);
  tw.push(`tl.to('${s} .nc-sp',{rotation:'+=50',scale:0.82,duration:0.9,ease:'sine.inOut',yoyo:true,repeat:${Math.max(0, Math.floor((dur - 1.6) / 0.9) - 1)}},${r3(t + 0.8)});`);
  tw.push(`tl.to('${s} .namecard',{x:-60,opacity:0,duration:0.3,ease:'power2.in'},${r3(t + dur - 0.32)});`);
  addSfx(t, 'pop', 0.55); addSfx(t + 0.35, 'sparkle', 0.35);
}

function qChip(t, o) {
  const qid = id('q'), dur = o.dur || 3.2;
  html.push(`<div id="${qid}" class="clip qchip-layer" data-start="${r3(t)}" data-duration="${dur}" data-track-index="13">
  <div class="qchip pos-${o.pos || 'left'}"><div class="q-badge">Q</div><div class="q-text">${esc(o.text)}</div></div></div>`);
  tw.push(`tl.fromTo('#${qid} .qchip',{y:-50,opacity:0,scale:0.9},{y:0,opacity:1,scale:1,duration:0.4,ease:'back.out(2)'},${r3(t)});`);
  tw.push(`tl.fromTo('#${qid} .q-badge',{rotation:-120,scale:0},{rotation:0,scale:1,duration:0.45,ease:'back.out(2.5)'},${r3(t + 0.1)});`);
  tw.push(`tl.to('#${qid} .qchip',{y:-40,opacity:0,duration:0.28,ease:'power2.in'},${r3(t + dur - 0.3)});`);
  addSfx(t, 'whooshShort', 0.4); addSfx(t + 0.1, 'click', 0.45);
}

function panel(t, o) {
  const pid = id('panel'), dur = o.dur || 5;
  const items = (o.items || []).map((it, i) =>
    `<div class="p-item p-${it.tone || 'mint'}"><div class="p-ico">${ICON[it.icon] || ''}</div><div class="p-txt"><div class="p-main">${esc(it.main)}</div>${it.sub ? `<div class="p-sub">${esc(it.sub)}</div>` : ''}</div></div>`).join('');
  const stat = o.stat ? `<div class="p-stat"><div class="p-stat-num"><span class="p-pre">${esc(o.stat.pre || '')}</span><span class="p-count" data-to="${o.stat.value}">${o.stat.value}</span></div><div class="p-stat-unit">${esc(o.stat.unit)}</div></div>` : '';
  html.push(`<div id="${pid}" class="clip panel-layer" data-start="${r3(t)}" data-duration="${dur}" data-track-index="11">
  <div class="panel side-${o.side || 'right'}">
    <div class="p-kicker">${ICON[o.icon] ? `<span class="p-kico">${ICON[o.icon]}</span>` : ''}${esc(o.kicker || '')}</div>
    <div class="p-title">${esc(o.title || '')}</div>
    ${stat}<div class="p-items">${items}</div>
    ${o.foot ? `<div class="p-foot">${esc(o.foot)}</div>` : ''}
    ${sparkleSvg('p-sp p-sp1')}${sparkleSvg('p-sp p-sp2', 'var(--mint)')}
  </div></div>`);
  const s = `#${pid}`;
  const dx = o.side === 'left' ? -140 : 140;
  tw.push(`tl.fromTo('${s} .panel',{x:${dx},opacity:0,rotation:${o.side === 'left' ? -4 : 4},scale:0.92},{x:0,opacity:1,rotation:0,scale:1,duration:0.5,ease:'back.out(1.6)'},${r3(t)});`);
  tw.push(`tl.fromTo('${s} .p-kicker, ${s} .p-title',{opacity:0,y:20},{opacity:1,y:0,duration:0.3,stagger:0.08,ease:'power3.out'},${r3(t + 0.2)});`);
  if (o.stat) {
    tw.push(`tl.fromTo('${s} .p-stat',{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.45,ease:'back.out(2.2)'},${r3(t + 0.4)});`);
    tw.push(`(function(){var el=document.querySelector('${s} .p-count');var o={v:0};tl.to(o,{v:${o.stat.value},duration:0.9,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(o.v);}},${r3(t + 0.45)});})();`);
    addSfx(t + 0.45, 'ping', 0.35);
  }
  const step = o.step || 0.45;
  (o.items || []).forEach((it, i) => {
    const at = t + (o.itemsAt ? o.itemsAt[i] : 0.55 + (o.stat ? 0.9 : 0) + i * step);
    tw.push(`tl.fromTo('${s} .p-item:nth-child(${i + 1})',{opacity:0,x:${o.side === 'left' ? -40 : 40},scale:0.85},{opacity:1,x:0,scale:1,duration:0.35,ease:'back.out(2)'},${r3(at)});`);
    addSfx(at, 'pop', 0.38);
  });
  if (o.foot) tw.push(`tl.fromTo('${s} .p-foot',{opacity:0,y:16},{opacity:1,y:0,duration:0.3},${r3(t + (o.footAt || dur * 0.6))});`);
  tw.push(`tl.fromTo('${s} .p-sp',{scale:0},{scale:1,duration:0.4,ease:'back.out(3)',stagger:0.15},${r3(t + 0.35)});`);
  tw.push(`tl.to('${s} .p-sp',{rotation:'+=60',duration:1.1,ease:'sine.inOut',yoyo:true,repeat:${Math.max(0, Math.floor((dur - 1.4) / 1.1) - 1)}},${r3(t + 0.8)});`);
  tw.push(`tl.to('${s} .panel',{x:${dx},opacity:0,duration:0.32,ease:'power2.in'},${r3(t + dur - 0.34)});`);
  addSfx(t, 'whoosh', 0.45);
}

function burst(t, o) {
  const bid = id('burst'), dur = o.dur || 2.6, n = o.count || 9;
  const rnd = prng(o.seed || 11);
  const copies = [];
  for (let i = 0; i < n; i++) {
    const a0 = o.angFrom ?? -170, a1 = o.angTo ?? -10;
    const ang = (a0 + ((a1 - a0) * i) / (n - 1) + (rnd() - 0.5) * 14) * Math.PI / 180;
    const dist = (o.dist ?? 260) + rnd() * (o.spread ?? 160);
    const size = 54 + Math.round(rnd() * 46);
    const rot = Math.round((rnd() - 0.5) * 30);
    const color = ['#FFFFFF', 'var(--sun)', 'var(--mint)'][i % 3];
    copies.push({ dx: Math.round(Math.cos(ang) * dist), dy: Math.max(90 - o.y, Math.round(Math.sin(ang) * dist * 0.62)), size, rot, color });
  }
  html.push(`<div id="${bid}" class="clip burst-layer" data-layout-allow-overlap data-start="${r3(t)}" data-duration="${dur}" data-track-index="14">
  ${copies.map((c, i) => `<div class="burst-w" data-layout-allow-overlap style="left:${o.x}px;top:${o.y}px;font-size:${c.size}px;color:${c.color}">${esc(o.text)}</div>`).join('')}</div>`);
  copies.forEach((c, i) => {
    const at = t + i * 0.07;
    tw.push(`tl.fromTo('#${bid} .burst-w:nth-child(${i + 1})',{x:0,y:0,scale:0.2,opacity:0,rotation:0},{x:${c.dx},y:${c.dy},scale:1,opacity:1,rotation:${c.rot},duration:0.6,ease:'back.out(1.4)'},${r3(at)});`);
    tw.push(`tl.to('#${bid} .burst-w:nth-child(${i + 1})',{y:'-=40',opacity:0,duration:0.45,ease:'power1.in'},${r3(t + dur - 0.55 + i * 0.03)});`);
  });
  addSfx(t, 'pop', 0.5); addSfx(t + 0.2, 'pop', 0.35); addSfx(t + 0.35, 'sparkle', 0.35);
}

function sticker(t, o) {
  const sid = id('stk'), dur = o.dur || 2.2;
  html.push(`<div id="${sid}" class="clip sticker-layer" data-start="${r3(t)}" data-duration="${dur}" data-track-index="15">
  <div class="sticker tone-${o.tone || 'sun'}" style="left:${o.x}px;top:${o.y}px">${o.icon ? `<span class="stk-ico">${ICON[o.icon]}</span>` : ''}${esc(o.text)}</div></div>`);
  tw.push(`tl.fromTo('#${sid} .sticker',{scale:0,rotation:${o.rot ?? -8}-30},{scale:1,rotation:${o.rot ?? -8},duration:0.45,ease:'back.out(2.6)'},${r3(t)});`);
  const pulses = Math.floor((dur - 0.8) / 0.5);
  if (pulses >= 1) tw.push(`tl.to('#${sid} .sticker',{scale:1.06,duration:0.5,ease:'sine.inOut',yoyo:true,repeat:${pulses - 1}},${r3(t + 0.45)});`);
  tw.push(`tl.to('#${sid} .sticker',{scale:0,opacity:0,duration:0.25,ease:'back.in(2)'},${r3(t + dur - 0.27)});`);
  addSfx(t, 'pop', 0.5);
}

const OVERLAY = { name: nameCard, q: qChip, panel, burst, sticker };

// ---------- full-screen graphic scenes ----------
function titleScene(t, s) {
  const sid = id('title');
  html.push(`<div id="${sid}" class="clip scene title-scene" data-start="${r3(t)}" data-duration="${s.dur}" data-track-index="5">
  <div class="dots"></div><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  <div class="ghost">ALZHEIMER</div>
  <div class="t-wrap">
    <div class="t-kicker"><span class="t-kico">${ICON.brain}</span>สัมภาษณ์สั้น · Vox Pop</div>
    <div class="t-main">อัลไซเมอร์</div>
    <div class="t-sub">คัดกรอง<span class="t-hl">เร็วขึ้น</span>ได้ไหม?</div>
    <div class="t-chips"><span class="chip c1">คุณหมอ</span><span class="chip c2">พยาบาล</span><span class="chip c3">ผู้สูงอายุ</span></div>
  </div>
  ${sparkleSvg('t-sp t-sp1')}${sparkleSvg('t-sp t-sp2', 'var(--mint)')}${sparkleSvg('t-sp t-sp3', 'var(--coral)')}${sparkleSvg('t-sp t-sp4')}
  </div>`);
  const S = `#${sid}`;
  tw.push(`tl.fromTo('${S} .blob',{scale:0},{scale:1,duration:0.8,ease:'back.out(1.5)',stagger:0.12},${r3(t)});`);
  tw.push(`tl.to('${S} .blob',{y:'-=26',x:'+=18',duration:2.2,ease:'sine.inOut',yoyo:true,repeat:1,stagger:0.3},${r3(t + 0.8)});`);
  tw.push(`tl.fromTo('${S} .ghost',{x:120,opacity:0},{x:-60,opacity:1,duration:${s.dur},ease:'none'},${r3(t)});`);
  tw.push(`tl.fromTo('${S} .t-kicker',{y:-30,opacity:0},{y:0,opacity:1,duration:0.4,ease:'power3.out'},${r3(t + 0.25)});`);
  tw.push(`tl.fromTo('${S} .t-main',{scale:0.4,opacity:0,rotation:-6},{scale:1,opacity:1,rotation:0,duration:0.6,ease:'back.out(2)'},${r3(t + 0.45)});`);
  tw.push(`tl.fromTo('${S} .t-sub',{y:40,opacity:0},{y:0,opacity:1,duration:0.45,ease:'power3.out'},${r3(t + 0.9)});`);
  tw.push(`tl.fromTo('${S} .t-hl',{backgroundSize:'0% 100%'},{backgroundSize:'100% 100%',duration:0.5,ease:'power2.out'},${r3(t + 1.3)});`);
  tw.push(`tl.fromTo('${S} .chip',{y:30,opacity:0,scale:0.7},{y:0,opacity:1,scale:1,duration:0.35,ease:'back.out(2.4)',stagger:0.14},${r3(t + 1.7)});`);
  tw.push(`tl.fromTo('${S} .t-sp',{scale:0,rotation:-120},{scale:1,rotation:0,duration:0.5,ease:'back.out(3)',stagger:0.1},${r3(t + 0.6)});`);
  tw.push(`tl.to('${S} .t-sp',{rotation:'+=45',scale:0.8,duration:0.8,ease:'sine.inOut',yoyo:true,repeat:${Math.max(0, Math.floor((s.dur - 1.5) / 0.8) - 1)}},${r3(t + 1.1)});`);
  tw.push(`tl.to('${S} .t-wrap',{scale:1.08,opacity:0,duration:0.35,ease:'power2.in'},${r3(t + s.dur - 0.38)});`);
  addSfx(t + 0.05, 'whoosh', 0.5); addSfx(t + 0.45, 'pop', 0.6); addSfx(t + 0.65, 'sparkle', 0.4);
  addSfx(t + 1.7, 'pop', 0.35); addSfx(t + 1.84, 'pop', 0.35); addSfx(t + 1.98, 'pop', 0.35);
}

function bumper(t, s) {
  const bid = id('bump');
  html.push(`<div id="${bid}" class="clip scene bumper tone-${s.tone || 'sun'}" data-start="${r3(t)}" data-duration="${s.dur}" data-track-index="5">
  <div class="dots"></div>
  <div class="bp-wrap"><div class="bp-num">${esc(s.num || '')}</div><div class="bp-text">${esc(s.text)}</div><div class="bp-sub">${esc(s.sub || '')}</div></div>
  ${sparkleSvg('bp-sp bp-sp1')}${sparkleSvg('bp-sp bp-sp2', '#FFFFFF')}
  </div>`);
  const S = `#${bid}`;
  tw.push(`tl.fromTo('${S} .dots',{opacity:0},{opacity:1,duration:0.3},${r3(t)});`);
  tw.push(`tl.fromTo('${S} .bp-num',{scale:0,rotation:-40},{scale:1,rotation:-6,duration:0.45,ease:'back.out(2.5)'},${r3(t + 0.05)});`);
  tw.push(`tl.fromTo('${S} .bp-text',{x:-120,opacity:0},{x:0,opacity:1,duration:0.45,ease:'power4.out'},${r3(t + 0.15)});`);
  tw.push(`tl.fromTo('${S} .bp-sub',{y:24,opacity:0},{y:0,opacity:1,duration:0.35,ease:'power3.out'},${r3(t + 0.35)});`);
  tw.push(`tl.fromTo('${S} .bp-sp',{scale:0,rotation:-90},{scale:1,rotation:0,duration:0.45,ease:'back.out(3)',stagger:0.1},${r3(t + 0.3)});`);
  tw.push(`tl.to('${S} .bp-wrap',{x:140,opacity:0,duration:0.3,ease:'power2.in'},${r3(t + s.dur - 0.32)});`);
  addSfx(t, 'whoosh', 0.55); addSfx(t + 0.08, 'pop', 0.45);
}

function outro(t, s) {
  const oid = id('outro');
  const cells = s.cells.map((c, i) => {
    const src = SOURCES[c.src];
    const vw = W, vh = H; // video drawn at 2x of the 960x540 cell
    let left = Math.round(480 - c.fx * vw), top = Math.round(270 - c.fy * vh);
    left = Math.max(-(vw - 960), Math.min(0, left)); top = Math.max(-(vh - 540), Math.min(0, top));
    const vid = id('ov');
    return `<div class="cell cell-${i}"><div class="cell-in">
      <video id="${vid}" class="clip cell-vid" src="${src.file}" data-start="${r3(t)}" data-duration="${s.dur}" data-media-start="${c.in}" data-track-index="${1 + i}" muted playsinline style="left:${left}px;top:${top}px"></video>
      </div></div>`;
  }).join('');
  html.push(`<div class="outro-grid">${cells}</div>`);
  html.push(`<div id="${oid}" class="clip outro-layer" data-start="${r3(t)}" data-duration="${s.dur}" data-track-index="16">
    <div class="o-badge"><div class="o-main">รู้เร็ว <span class="o-hl">ป้องกันได้</span></div><div class="o-sub">คัดกรองอัลไซเมอร์ได้ด้วยตัวเอง</div><div class="o-thanks">ขอบคุณผู้ให้สัมภาษณ์ทุกท่าน</div></div>
    ${s.cells.map((c, i) => `<div class="cell-label lab-${i}">${esc(c.label)}</div>`).join('')}
    ${sparkleSvg('o-sp o-sp1')}${sparkleSvg('o-sp o-sp2', 'var(--mint)')}${sparkleSvg('o-sp o-sp3', 'var(--coral)')}
  </div>`);
  const S = `#${oid}`;
  s.cells.forEach((c, i) => {
    tw.push(`tl.fromTo('.cell-${i} .cell-in',{scale:0,rotation:${i % 2 ? 8 : -8}},{scale:1,rotation:0,duration:0.5,ease:'back.out(1.7)'},${r3(t + i * 0.12)});`);
    tw.push(`tl.fromTo('${S} .lab-${i}',{y:30,opacity:0},{y:0,opacity:1,duration:0.3,ease:'back.out(2)'},${r3(t + 0.4 + i * 0.12)});`);
    addSfx(t + i * 0.12, 'pop', 0.4);
  });
  tw.push(`tl.fromTo('${S} .o-badge',{scale:0,rotation:-10},{scale:1,rotation:-3,duration:0.6,ease:'back.out(2.2)'},${r3(t + 0.9)});`);
  tw.push(`tl.fromTo('${S} .o-hl',{backgroundSize:'0% 100%'},{backgroundSize:'100% 100%',duration:0.45,ease:'power2.out'},${r3(t + 1.4)});`);
  tw.push(`tl.fromTo('${S} .o-thanks',{y:40,opacity:0},{y:0,opacity:1,duration:0.4,ease:'power3.out'},${r3(t + 1.6)});`);
  tw.push(`tl.fromTo('${S} .o-sp',{scale:0},{scale:1,duration:0.4,ease:'back.out(3)',stagger:0.12},${r3(t + 1.1)});`);
  tw.push(`tl.to('${S} .o-sp',{rotation:'+=60',scale:0.8,duration:0.9,ease:'sine.inOut',yoyo:true,repeat:${Math.max(0, Math.floor((s.dur - 2) / 0.9) - 1)}},${r3(t + 1.6)});`);
  tw.push(`tl.to('.outro-grid, ${S}',{opacity:0,duration:0.6,ease:'power1.in'},${r3(t + s.dur - 0.65)});`);
  addSfx(t + 0.9, 'chime', 0.45); addSfx(t + 1.1, 'sparkle', 0.4);
}

// ---------- footage sections ----------
function footage(t0, s) {
  const src = SOURCES[s.src];
  let t = t0;
  const map = [];
  s.clips.forEach(([a, b, zoomOverride], i) => {
    a = snap(a); b = snap(b);
    const d = Math.round((b - a) * FPS) / FPS;
    t = Math.round(t * FPS) / FPS;
    const zoom = zoomOverride ?? (i % 2 ? src.punch : 1);
    const vid = id(`v-${s.src}`);
    html.push(`<div class="vwrap" style="transform:scale(${zoom});transform-origin:${src.origin}"><video id="${vid}" class="clip footage" src="${src.file}" data-start="${r3(t)}" data-duration="${r3(r3(t + d) - r3(t) - 0.001)}" data-media-start="${r3(a)}" data-track-index="0" playsinline data-has-audio="true"${s.volume ? ` data-volume="${s.volume}"` : ''}></video></div>`);
    map.push({ a, b, t });
    speech.push([t, t + d]);
    t += d;
  });
  const toT = (x) => {
    for (const m of map) if (x >= m.a - 0.08 && x <= m.b + 0.08) return { tt: m.t + (Math.min(Math.max(x, m.a), m.b) - m.a), m };
    return null;
  };
  // captions: clamp to the clip containing their start; end at next caption start or clip end
  const caps = (s.captions || []).map(([a, b, text, role = 'a', hl]) => ({ a, b, text, role, hl, s: toT(a) })).filter((c) => c.s);
  caps.forEach((c, i) => {
    const m = c.s.m;
    const start = c.s.tt;
    const endSrc = Math.min(c.b + 0.35, m.b);
    let end = m.t + (endSrc - m.a);
    const next = caps[i + 1];
    if (next && next.s.tt < end) end = next.s.tt - 0.02;
    const tt1 = m.t + (Math.min(c.b, m.b) - m.a);
    if (end - start < 0.25) return;
    captionHtml(c.text, c.role, c.hl, start, tt1, end);
  });
  const must = (x) => { const r = toT(x); if (!r) throw new Error(`time outside clips: ${s.src} ${x}`); return r.tt; };
  for (const o0 of s.overlays || []) {
    const o = { ...o0 };
    const at = must(o.at);
    if (o.until !== undefined) o.dur = r3(must(o.until) - at);
    if (o.items && o.items.some((it) => it.at !== undefined)) o.itemsAt = o.items.map((it, i) => r3(must(it.at) - at));
    if (o.footSrc !== undefined) o.footAt = r3(must(o.footSrc) - at);
    OVERLAY[o.type](at, o);
  }
  return t - t0;
}

for (const s of SECTIONS) {
  if (s.type === 'title') { titleScene(T, s); T += s.dur; }
  else if (s.type === 'bumper') { bumper(T, s); T += s.dur; }
  else if (s.type === 'footage') { T += footage(T, s); T = Math.round(T * FPS) / FPS; }
  else if (s.type === 'outro') { outro(T, s); T += s.dur; }
}
const TOTAL = r3(T);

// ---------- audio: BGM ducked under footage speech ----------
const pts = [{ t: 0, v: 0 }, { t: 0.6, v: 0.55 }];
const DUCK = 0.13, UP = 0.55;
// merge contiguous speech windows
const merged = [];
for (const [a, b] of speech.sort((x, y) => x[0] - y[0])) {
  if (merged.length && a - merged[merged.length - 1][1] < 0.05) merged[merged.length - 1][1] = b; else merged.push([a, b]);
}
for (const [a, b] of merged) {
  pts.push({ t: r3(Math.max(0.7, a - 0.25)), v: UP }, { t: r3(a + 0.05), v: DUCK }, { t: r3(b - 0.05), v: DUCK }, { t: r3(b + 0.25), v: UP });
}
pts.push({ t: r3(TOTAL - 2.2), v: UP }, { t: r3(TOTAL), v: 0 });
const clean = pts.sort((a, b) => a.t - b.t).filter((p, i, arr) => i === 0 || p.t > arr[i - 1].t);
const audio = [`<audio id="bgm" src="assets/audio/bgm-upbeat.mp3" data-start="0" data-duration="${TOTAL}" data-track-index="30" data-automation='${JSON.stringify({ version: 1, lanes: [{ target: 'volume', points: clean }] })}'></audio>`];
const laneEnd = [];
sfx.sort((a, b) => a.t - b.t).forEach((x, i) => {
  let lane = laneEnd.findIndex((e) => e <= x.t);
  if (lane < 0) { lane = laneEnd.length; laneEnd.push(0); }
  laneEnd[lane] = x.t + 0.75;
  audio.push(`<audio id="sfx-${i + 1}" src="${x.file}" data-start="${x.t}" data-duration="0.7" data-track-index="${31 + lane}" data-volume="${x.vol}"></audio>`);
});

const css = fs.readFileSync(path.join(ROOT, 'build/style.css'), 'utf8');
const out = `<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <!-- Generated by build/build.mjs from build/edl.mjs — edit those, then re-run. -->
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
${html.join('\n')}
${audio.join('\n')}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
${tw.map((l) => '      ' + l).join('\n')}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'index.html'), out);
console.log(`index.html written: ${TOTAL}s, ${html.length} nodes, ${tw.length} tweens, ${sfx.length} sfx`);
