// Generates index.html from the edit decision list in edl.mjs.
// Run: node build/build.mjs   (then: npx hyperframes check)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOURCES, SECTIONS, EMPATHY, DEFINE, IDEATE } from './edl.mjs';

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
const SFXLEN = { 'assets/audio/sfx/pop.mp3': 0.72, 'assets/audio/sfx/sparkle.mp3': 1.8, 'assets/audio/sfx/whoosh.mp3': 0.57, 'assets/audio/sfx/whoosh-short.mp3': 0.57, 'assets/audio/sfx/click-soft.mp3': 0.36, 'assets/audio/sfx/chime.mp3': 2.5, 'assets/audio/sfx/ping.mp3': 1.3 };
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

// ---------- Design Thinking presentation scenes ----------
const STEPS = [
  { key: 'Empathize', th: 'เข้าใจผู้ใช้', sub: 'Understand User Needs', color: '#5BB8D9', icon: 'say' },
  { key: 'Define', th: 'ระบุปัญหา', sub: 'Synthesize & State Problem', color: '#8E8CE6', icon: 'search' },
  { key: 'Ideate', th: 'ระดมไอเดีย', sub: 'Brainstorm Solutions', color: '#8CC56B', icon: 'spark' },
  { key: 'Prototype', th: 'สร้างต้นแบบ', sub: 'Build & Represent Ideas', color: '#F2A24B', icon: 'phone' },
  { key: 'Test', th: 'ทดสอบ', sub: 'Gather Feedback & Refine', color: '#EE6A5E', icon: 'check' },
];
ICON.say = '<svg viewBox="0 0 48 48"><path d="M6 10h30v20H18l-8 7v-7H6z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><circle cx="15" cy="20" r="2.4" fill="currentColor"/><circle cx="21" cy="20" r="2.4" fill="currentColor"/><circle cx="27" cy="20" r="2.4" fill="currentColor"/></svg>';
ICON.eye = '<svg viewBox="0 0 48 48"><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="24" cy="24" r="6" fill="currentColor"/></svg>';
ICON.gear = '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="7" fill="none" stroke="currentColor" stroke-width="4"/><path d="M24 4v7M24 37v7M4 24h7M37 24h7M10 10l5 5M33 33l5 5M38 10l-5 5M15 33l-5 5" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>';
ICON.users = '<svg viewBox="0 0 48 48"><circle cx="17" cy="16" r="7" fill="none" stroke="currentColor" stroke-width="4"/><path d="M4 40c1-8 6-12 13-12s12 4 13 12" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="34" cy="17" r="5" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M33 27c6 0 10 4 11 11" fill="none" stroke="currentColor" stroke-width="3.5"/></svg>';
ICON.star = '<svg viewBox="0 0 48 48"><path d="M24 4l6 13 14 1-11 9 4 14-13-8-13 8 4-14L4 18l14-1z" fill="currentColor"/></svg>';
ICON.loop = '<svg viewBox="0 0 48 48"><path d="M38 18a15 15 0 0 0-27-4M10 30a15 15 0 0 0 27 4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M8 6v9h9M40 42v-9h-9" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let cardOpen = false; // presenter card already on screen from the previous talk section
function header(step, label) {
  return `<div class="dt-head"><span class="dt-step">${esc(step)}</span><span class="dt-title">${esc(label)}</span></div>`;
}
function slideHtml(sl, sid) {
  const head = (k, lbl) => header(k, lbl);
  switch (sl.type) {
    case 'title': return `
      <div class="ti-top"><img class="ti-logo" src="assets/img/logo.png" alt=""><div class="ti-school">Princess Chulabhorn Science High School Phetchaburi</div></div>
      <div class="ti-title">การพัฒนา Web Application<span class="ti-l2">เพื่อคัดกรองภาวะอัลไซเมอร์เบื้องต้น</span></div>
      <div class="ti-en">Design of a Web-Based Game for Preliminary Alzheimer’s Screening</div>
      <div class="ti-team">
        <div class="ti-k">จัดทำโดย</div>
        <div class="ti-p ti-p1">นายบุญยากร คงสนธิ <span>ม.5</span></div>
        <div class="ti-p ti-p2">นายสุริยภัทร ศรีสดใส <span>ม.5</span></div>
        <div class="ti-k ti-k2">อาจารย์ที่ปรึกษา</div>
        <div class="ti-p ti-p3">นายณัฐวุฒิ ไม้แก่น</div>
      </div>`;
    case 'cycle': return `${head('DESIGN THINKING', 'กระบวนการ 5 ขั้น')}
      <div class="cy-row">${STEPS.map((s, i) => `<div class="cy-item cy-${i}"><div class="cy-ring" style="border-color:${s.color}"><span class="cy-ico" style="color:${s.color}">${ICON[s.icon]}</span></div><div class="cy-num">${i + 1}</div><div class="cy-key">${s.key.toUpperCase()}</div><div class="cy-th">${s.th}</div></div>`).join('<div class="cy-arrow"></div>')}</div>`;
    case 'empathize': return `${head('01 · EMPATHIZE', 'ลงพื้นที่สัมภาษณ์')}
      <div class="em-cards">
        <div class="em-card em-c0"><span class="em-ico">${ICON.hosp}</span><div class="em-main">บุคลากรในโรงพยาบาล</div><div class="em-sub">แพทย์ · พยาบาลวิชาชีพ</div></div>
        <div class="em-card em-c1"><span class="em-ico">${ICON.users}</span><div class="em-main">ญาติผู้ป่วย / ผู้สูงอายุ</div><div class="em-sub">ผู้ที่มาตรวจที่โรงพยาบาล</div></div>
      </div>
      <div class="em-next"><span class="em-play">${ICON.play}</span>ตัวอย่างคลิปสัมภาษณ์</div>`;
    case 'maphead': return `${head('01 · EMPATHIZE', 'Empathy Map')}
      <div class="mh-grid">${[['eye', 'See', 'เห็นสิ่งไหน'], ['say', 'Say', 'คำที่พูดออกมา'], ['heart', 'Feel', 'ความรู้สึก'], ['gear', 'Do', 'สิ่งที่ปฏิบัติ/ทำ']].map(([ic, en, th], i) => `<div class="mh-q mh-${i}"><span class="mh-ico">${ICON[ic]}</span><div><div class="mh-en">What they ${en}</div><div class="mh-th">${th}</div></div></div>`).join('')}</div>`;
    case 'define': return `${head('02 · DEFINE', 'ระบุปัญหาที่แท้จริง')}
      <div class="df-cols">
        <div class="df-col df-iss"><div class="df-tag">Issues · ประเด็นสังคม</div>${DEFINE.issues.map((x) => `<div class="df-li">${esc(x)}</div>`).join('')}</div>
        <div class="df-col df-need"><div class="df-tag">Needs · สิ่งที่ต้องการ</div>${DEFINE.needs.map((x) => `<div class="df-li">${esc(x)}</div>`).join('')}</div>
      </div>
      <div class="df-goal"><span class="df-star">${ICON.star}</span><div><div class="df-gk">North-Star Goal</div><div class="df-gt">${esc(DEFINE.goal)}</div></div></div>`;
    case 'phone': return `${head('04 · PROTOTYPE', 'Memory Garden')}
      <div class="ph-wrap">
        <div class="ph-dev"><div class="ph-screen"><img class="ph-img" src="assets/img/${sl.img}.jpg" alt="">${sl.img2 ? `<img class="ph-img ph-img2" src="assets/img/${sl.img2}.jpg" alt="">` : ''}${sl.recall ? '<div class="ph-recall"><div class="ph-rq">นึกให้ออก…</div><div class="ph-rq2">สิ่งของ 5 อย่างจากตอนต้น</div></div>' : ''}</div><div class="ph-notch"></div></div>
        <div class="ph-info">
          <div class="ph-count">${sl.n === 0 ? 'หน้าแรก' : sl.n === 7 ? 'ผลลัพธ์' : `ฟีเจอร์ ${sl.n}/6`}</div>
          <div class="ph-title">${esc(sl.title)}</div>
          <div class="ph-desc">${esc(sl.desc)}</div>
          <div class="ph-tk">ประเมิน</div>
          <div class="ph-tags">${sl.tags.map((t) => `<span class="ph-tag">${esc(t)}</span>`).join('')}</div>
          <div class="ph-dots">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<span class="ph-dot${i === sl.n ? ' on' : i < sl.n ? ' done' : ''}"></span>`).join('')}</div>
        </div>
      </div>`;
    case 'test': return `${head('05 · TEST', 'ทดสอบกับผู้ใช้จริง')}
      <div class="ts-top">
        <div class="ts-card ts-c0"><span class="ts-ico">${ICON.pin}</span><div><div class="ts-k">สถานที่</div><div class="ts-v">โรงพยาบาลพระจอมเกล้า จ.เพชรบุรี</div></div></div>
        <div class="ts-card ts-c1"><span class="ts-ico">${ICON.users}</span><div><div class="ts-k">กลุ่มผู้ใช้</div><div class="ts-v"><span class="ts-big">45+</span> ปีขึ้นไป</div></div></div>
      </div>
      <div class="ts-flow">${[['phone', 'ทดลองใช้งานระบบ'], ['heart', 'เก็บความพึงพอใจ'], ['say', 'ความคิดเห็น & ข้อเสนอแนะ'], ['loop', 'ปรับปรุง & พัฒนาระบบ']].map(([ic, t], i) => `<div class="ts-step ts-s${i}"><span class="ts-sico">${ICON[ic]}</span><div class="ts-st">${t}</div></div>`).join('<div class="ts-arr"></div>')}</div>`;
  }
  return '';
}
function animateSlide(sl, S, t, dur, map) {
  const at = (src) => r3(map(src));
  const pop = (sel, time, k = 'pop') => { tw.push(`tl.fromTo('${S} ${sel}',{opacity:0,y:30,scale:0.85},{opacity:1,y:0,scale:1,duration:0.4,ease:'back.out(1.8)'},${r3(time)});`); if (k) addSfx(time, k, 0.35); };
  if (sl.type !== 'title') tw.push(`tl.fromTo('${S} .dt-head',{x:-60,opacity:0},{x:0,opacity:1,duration:0.45,ease:'power3.out'},${r3(t + 0.15)});`);
  switch (sl.type) {
    case 'title':
      tw.push(`tl.fromTo('${S} .ti-top',{y:-30,opacity:0},{y:0,opacity:1,duration:0.5,ease:'power3.out'},${r3(t + 0.2)});`);
      tw.push(`tl.fromTo('${S} .ti-title',{y:40,opacity:0},{y:0,opacity:1,duration:0.6,ease:'power3.out'},${at(sl.cues.title)});`);
      tw.push(`tl.fromTo('${S} .ti-en',{opacity:0},{opacity:1,duration:0.5},${r3(at(sl.cues.title) + 0.5)});`);
      addSfx(at(sl.cues.title), 'whoosh', 0.4);
      pop('.ti-k:not(.ti-k2)', at(sl.cues.team1) - 0.1, null); pop('.ti-p1', at(sl.cues.team1) + 0.6);
      pop('.ti-p2', at(sl.cues.team2)); pop('.ti-k2', at(sl.cues.advisor), null); pop('.ti-p3', at(sl.cues.advisor) + 0.6);
      break;
    case 'cycle':
      sl.cues.forEach((c, i) => { pop(`.cy-${i}`, at(c)); if (i) tw.push(`tl.fromTo('${S} .cy-arrow:nth-of-type(${i * 2})',{scaleX:0},{scaleX:1,duration:0.3,ease:'power2.out'},${r3(at(c) - 0.15)});`); });
      break;
    case 'empathize':
      pop('.em-c0', at(sl.cues[0])); pop('.em-c1', at(sl.cues[1])); pop('.em-next', at(sl.cues[2]), 'whooshShort');
      tw.push(`tl.to('${S} .em-play',{x:12,duration:0.4,ease:'sine.inOut',yoyo:true,repeat:3},${r3(at(sl.cues[2]) + 0.4)});`);
      break;
    case 'maphead':
      sl.cues.forEach((c, i) => pop(`.mh-${i}`, at(c)));
      break;
    case 'define':
      pop('.df-iss .df-tag', at(sl.cues.issues));
      DEFINE.issues.forEach((_, i) => pop(`.df-iss .df-li:nth-of-type(${i + 2})`, at(sl.cues.issues) + 0.7 + i * 0.8, 'click'));
      pop('.df-need .df-tag', at(sl.cues.needs));
      DEFINE.needs.forEach((_, i) => pop(`.df-need .df-li:nth-of-type(${i + 2})`, at(sl.cues.needs) + 0.7 + i * 0.8, 'click'));
      tw.push(`tl.fromTo('${S} .df-goal',{opacity:0,scale:0.6,rotation:-4},{opacity:1,scale:1,rotation:0,duration:0.6,ease:'back.out(2)'},${at(sl.cues.goal)});`);
      tw.push(`tl.fromTo('${S} .df-star',{rotation:-180,scale:0},{rotation:0,scale:1,duration:0.7,ease:'back.out(2.5)'},${r3(at(sl.cues.goal) + 0.2)});`);
      addSfx(at(sl.cues.goal), 'chime', 0.4); addSfx(at(sl.cues.goal) + 0.2, 'sparkle', 0.35);
      break;
    case 'phone':
      tw.push(`tl.fromTo('${S} .ph-dev',{y:80,opacity:0,rotation:-4},{y:0,opacity:1,rotation:0,duration:0.55,ease:'back.out(1.6)'},${r3(t + 0.1)});`);
      tw.push(`tl.fromTo('${S} .ph-img',{y:0},{y:${sl.n === 4 ? -260 : -60},duration:${r3(dur - 1)},ease:'sine.inOut'},${r3(t + 0.6)});`);
      if (sl.img2) tw.push(`tl.fromTo('${S} .ph-img2',{opacity:0},{opacity:1,duration:0.4},${r3(t + dur / 2)});`);
      if (sl.recall) tw.push(`tl.fromTo('${S} .ph-recall',{opacity:0,scale:0.8},{opacity:1,scale:1,duration:0.4,ease:'back.out(2)'},${r3(t + 1.0)});`);
      tw.push(`tl.fromTo('${S} .ph-count, ${S} .ph-title, ${S} .ph-desc',{x:50,opacity:0},{x:0,opacity:1,duration:0.4,stagger:0.12,ease:'power3.out'},${r3(t + 0.25)});`);
      tw.push(`tl.fromTo('${S} .ph-tk, ${S} .ph-tag',{y:20,opacity:0},{y:0,opacity:1,duration:0.3,stagger:0.12,ease:'back.out(2)'},${r3(t + 1.0)});`);
      tw.push(`tl.fromTo('${S} .ph-dot.on',{scale:0.4},{scale:1,duration:0.4,ease:'back.out(3)'},${r3(t + 0.6)});`);
      addSfx(t + 0.1, 'whoosh', 0.35); addSfx(t + 1.0, 'pop', 0.3);
      break;
    case 'test':
      pop('.ts-c0', at(sl.cues[0])); pop('.ts-c1', at(sl.cues[1]));
      [2, 3, 4, 5].forEach((k, i) => { pop(`.ts-s${i}`, at(sl.cues[k]), 'click'); if (i) tw.push(`tl.fromTo('${S} .ts-arr:nth-of-type(${i * 2})',{scaleX:0},{scaleX:1,duration:0.3},${r3(at(sl.cues[k]) - 0.15)});`); });
      break;
  }
  tw.push(`tl.to('${S} .slide-in',{opacity:0,y:-20,duration:0.3,ease:'power2.in'},${r3(t + dur - 0.32)});`);
}

function talk(t0, s) {
  const src = SOURCES.presenter;
  let t = t0;
  const map = [];
  for (let [a, b] of s.clips) {
    a = snap(a); b = snap(b);
    const d = Math.round((b - a) * FPS) / FPS;
    t = Math.round(t * FPS) / FPS;
    html.push(`<video id="${id('pv')}" class="clip presenter" src="${src.file}" data-start="${r3(t)}" data-duration="${r3(r3(t + d) - r3(t) - 0.001)}" data-media-start="${r3(a)}" data-track-index="2" playsinline data-has-audio="true"></video>`);
    map.push({ a, b, t }); speech.push([t, t + d]); t += d;
  }
  const dur = r3(t - t0);
  const toT = (x) => { for (const m of map) if (x >= m.a - 0.1 && x <= m.b + 0.1) return m.t + (Math.min(Math.max(x, m.a), m.b) - m.a); return t0; };
  // card frame behind the presenter video
  const fid = id('card');
  html.push(`<div id="${fid}" class="clip card-layer" data-start="${r3(t0)}" data-duration="${dur}" data-track-index="1"><div class="card-frame"></div></div>`);
  if (!cardOpen) {
    tw.push(`tl.fromTo('#${fid} .card-frame',{x:-120,opacity:0},{x:0,opacity:1,duration:0.5,ease:'power3.out'},${r3(t0)});`);
  }
  const sid = id('slide');
  html.push(`<div id="${sid}" class="clip slide-layer" data-start="${r3(t0)}" data-duration="${dur}" data-track-index="10"><div class="slide-in sl-${s.slide.type}">${slideHtml(s.slide, sid)}</div></div>`);
  tw.push(`tl.fromTo('#${sid} .slide-in',{opacity:0,y:30},{opacity:1,y:0,duration:0.4,ease:'power3.out'},${r3(t0)});`);
  animateSlide(s.slide, `#${sid}`, t0, dur, toT);
  const caps = s.captions.map(([a, b, text, role = 't', hl]) => ({ a, b, text, role, hl, st: toT(a), en: toT(b) }));
  caps.forEach((c, i) => {
    let end = Math.min(c.en + 0.4, t0 + dur);
    if (caps[i + 1] && caps[i + 1].st < end) end = caps[i + 1].st - 0.02;
    if (end - c.st > 0.25) captionHtml(c.text, c.role, c.hl, c.st, c.en, end);
  });
  cardOpen = true;
  return dur;
}

function fullScene(t, s) {
  cardOpen = false;
  const sid = id('full');
  let body = '';
  if (s.type === 'map') {
    const Q = [['see', 'eye', 'See', 'เห็นสิ่งไหน'], ['say', 'say', 'Say', 'คำที่พูดออกมา'], ['feel', 'heart', 'Feel', 'ความรู้สึก'], ['do', 'gear', 'Do', 'สิ่งที่ปฏิบัติ/ทำ']];
    body = `${header('01 · EMPATHIZE', 'Empathy Map — จากบทสัมภาษณ์')}
      <div class="mp-grid">${Q.map(([k, ic, en, th], i) => `<div class="mp-q mp-${i}"><div class="mp-h"><span class="mp-ico">${ICON[ic]}</span>What they ${en} <span class="mp-th">(${th})</span></div>${EMPATHY[k].map((x) => `<div class="mp-li">${esc(x)}</div>`).join('')}</div>`).join('')}</div>`;
  } else if (s.type === 'ideate') {
    const C = [['improve', 'Improve', 50], ['newway', 'Find a new way', 40], ['reimagine', 'ReImagine', 10]];
    body = `${header('03 · IDEATE', 'ระดมไอเดีย')}
      <div class="id-table">${C.map(([k, en, pct], i) => `<div class="id-col id-${i}"><div class="id-h">${en}</div>${IDEATE[k].map((x) => `<div class="id-cell">${esc(x)}</div>`).join('')}<div class="id-pct"><span class="id-num" data-to="${pct}">${pct}</span>%</div></div>`).join('')}</div>
      <div class="id-chosen"><span class="id-cs">${ICON.star}</span>ไอเดียที่เลือก: ${esc(IDEATE.chosen)}</div>`;
  } else if (s.type === 'finale') {
    body = `<div class="fn-wrap">
      <div class="fn-left">
        <img class="fn-logo" src="assets/img/logo.png" alt="">
        <div class="fn-app">Memory Garden</div>
        <div class="fn-title">เว็บแอปพลิเคชันคัดกรองภาวะอัลไซเมอร์เบื้องต้น</div>
        <div class="fn-note">ใช้สำหรับคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรค</div>
        <div class="fn-team">นายบุญยากร คงสนธิ · นายสุริยภัทร ศรีสดใส</div>
        <div class="fn-team">อาจารย์ที่ปรึกษา นายณัฐวุฒิ ไม้แก่น</div>
        <div class="fn-thanks">ขอบคุณครับ</div>
      </div>
      <div class="fn-right">
        <div class="fn-scan">สแกนเพื่อทดลองใช้งาน</div>
        <div class="fn-qrbox"><img class="fn-qr" src="assets/img/qr.jpg" alt=""></div>
        <div class="fn-arrow">${ICON.phone}<span>เปิดกล้องมือถือ แล้วสแกนได้เลย</span></div>
      </div>
      ${sparkleSvg('fn-sp fn-sp1')}${sparkleSvg('fn-sp fn-sp2', 'var(--mint2)')}${sparkleSvg('fn-sp fn-sp3')}
    </div>`;
  }
  html.push(`<div id="${sid}" class="clip full-layer fl-${s.type}" data-start="${r3(t)}" data-duration="${s.dur}" data-track-index="10"><div class="slide-in">${body}</div></div>`);
  const S = `#${sid}`;
  tw.push(`tl.fromTo('${S} .slide-in',{opacity:0,scale:1.04},{opacity:1,scale:1,duration:0.5,ease:'power2.out'},${r3(t)});`);
  if (s.type !== 'finale') tw.push(`tl.fromTo('${S} .dt-head',{x:-60,opacity:0},{x:0,opacity:1,duration:0.45,ease:'power3.out'},${r3(t + 0.2)});`);
  addSfx(t, 'whoosh', 0.45);
  if (s.type === 'map') {
    [0, 1, 2, 3].forEach((i) => {
      const q = t + 0.6 + i * 2.6;
      tw.push(`tl.fromTo('${S} .mp-${i}',{opacity:0,scale:0.9},{opacity:1,scale:1,duration:0.45,ease:'back.out(1.8)'},${r3(q)});`);
      tw.push(`tl.fromTo('${S} .mp-${i} .mp-li',{opacity:0,x:-24},{opacity:1,x:0,duration:0.3,stagger:0.45,ease:'power3.out'},${r3(q + 0.4)});`);
      addSfx(q, 'pop', 0.4);
    });
  } else if (s.type === 'ideate') {
    [0, 1, 2].forEach((i) => {
      const q = t + 0.7 + i * 2.4;
      tw.push(`tl.fromTo('${S} .id-${i} .id-h',{opacity:0,y:-20},{opacity:1,y:0,duration:0.35,ease:'back.out(2)'},${r3(q)});`);
      tw.push(`tl.fromTo('${S} .id-${i} .id-cell',{opacity:0,y:20},{opacity:1,y:0,duration:0.3,stagger:0.4,ease:'power3.out'},${r3(q + 0.3)});`);
      tw.push(`tl.fromTo('${S} .id-${i} .id-pct',{opacity:0,scale:0.5},{opacity:1,scale:1,duration:0.4,ease:'back.out(2.5)'},${r3(q + 1.3)});`);
      tw.push(`(function(){var el=document.querySelector('${S} .id-${i} .id-num');var o={v:0};tl.to(o,{v:${[50, 40, 10][i]},duration:0.7,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(o.v);}},${r3(q + 1.3)});})();`);
      addSfx(q, 'pop', 0.4); addSfx(q + 1.3, 'ping', 0.3);
    });
    tw.push(`tl.fromTo('${S} .id-2',{boxShadow:'0 0 0 0 rgba(242,162,75,0)'},{boxShadow:'0 0 0 10px rgba(242,162,75,0.9)',duration:0.5},${r3(t + 8.3)});`);
    tw.push(`tl.fromTo('${S} .id-chosen',{opacity:0,y:40,scale:0.9},{opacity:1,y:0,scale:1,duration:0.5,ease:'back.out(2)'},${r3(t + 8.6)});`);
    addSfx(t + 8.6, 'chime', 0.4); addSfx(t + 8.8, 'sparkle', 0.35);
  } else if (s.type === 'finale') {
    tw.push(`tl.fromTo('${S} .fn-logo',{scale:0,rotation:-20},{scale:1,rotation:0,duration:0.6,ease:'back.out(2)'},${r3(t + 0.3)});`);
    tw.push(`tl.fromTo('${S} .fn-app',{opacity:0,y:40},{opacity:1,y:0,duration:0.5,ease:'power3.out'},${r3(t + 0.8)});`);
    tw.push(`tl.fromTo('${S} .fn-title, ${S} .fn-note, ${S} .fn-team',{opacity:0,y:20},{opacity:1,y:0,duration:0.4,stagger:0.25,ease:'power3.out'},${r3(t + 1.2)});`);
    tw.push(`tl.fromTo('${S} .fn-qrbox',{opacity:0,scale:0.4,rotation:8},{opacity:1,scale:1,rotation:0,duration:0.7,ease:'back.out(1.8)'},${r3(t + 2.4)});`);
    tw.push(`tl.fromTo('${S} .fn-scan',{opacity:0,y:-24},{opacity:1,y:0,duration:0.4,ease:'back.out(2)'},${r3(t + 2.9)});`);
    tw.push(`tl.fromTo('${S} .fn-arrow',{opacity:0,y:24},{opacity:1,y:0,duration:0.4,ease:'power3.out'},${r3(t + 3.3)});`);
    tw.push(`tl.to('${S} .fn-qrbox',{scale:1.035,duration:0.9,ease:'sine.inOut',yoyo:true,repeat:${Math.max(0, Math.floor((s.dur - 6.5) / 0.9) - 1)}},${r3(t + 3.8)});`);
    tw.push(`tl.fromTo('${S} .fn-thanks',{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.5,ease:'back.out(2.4)'},${r3(t + 4.2)});`);
    tw.push(`tl.fromTo('${S} .fn-sp',{scale:0},{scale:1,duration:0.4,ease:'back.out(3)',stagger:0.15},${r3(t + 2.8)});`);
    tw.push(`tl.to('${S} .fn-sp',{rotation:'+=60',scale:0.8,duration:1.1,ease:'sine.inOut',yoyo:true,repeat:${Math.max(0, Math.floor((s.dur - 5) / 1.1) - 1)}},${r3(t + 3.3)});`);
    tw.push(`tl.to('${S} .slide-in',{opacity:0,duration:0.9},${r3(t + s.dur - 1.0)});`);
    addSfx(t + 0.3, 'pop', 0.5); addSfx(t + 2.4, 'whoosh', 0.45); addSfx(t + 2.8, 'sparkle', 0.4); addSfx(t + 4.2, 'chime', 0.45);
    return s.dur;
  }
  tw.push(`tl.to('${S} .slide-in',{opacity:0,duration:0.35,ease:'power2.in'},${r3(t + s.dur - 0.37)});`);
  return s.dur;
}

function interview(t0, s) {
  cardOpen = false;
  const d = footage(t0, s);
  const lid = id('ivlab');
  html.push(`<div id="${lid}" class="clip iv-layer" data-start="${r3(t0)}" data-duration="${r3(d)}" data-track-index="16"><div class="iv-frame"></div><div class="iv-chip">${ICON.play}ตัวอย่างการสัมภาษณ์</div></div>`);
  tw.push(`tl.fromTo('#${lid} .iv-chip',{y:40,opacity:0},{y:0,opacity:1,duration:0.4,ease:'back.out(2)'},${r3(t0 + 0.1)});`);
  return d;
}

const marks = [];
for (const s of SECTIONS) {
  marks.push(`${(s.slide && s.slide.type) || s.type}@${r3(T)}`);
  if (s.type === 'talk') T += talk(T, s);
  else if (s.type === 'footage') T += interview(T, s);
  else T += fullScene(T, s);
  T = Math.round(T * FPS) / FPS;
}
const TOTAL = r3(T);

// ---------- audio: BGM ducked under footage speech ----------
const pts = [{ t: 0, v: 0 }, { t: 0.6, v: 0.55 }];
const DUCK = 0.1, UP = 0.45;
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
  laneEnd[lane] = x.t + SFXLEN[x.file] + 0.05;
  audio.push(`<audio id="sfx-${i + 1}" src="${x.file}" data-start="${x.t}" data-duration="${SFXLEN[x.file]}" data-track-index="${31 + lane}" data-volume="${x.vol}"></audio>`);
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
<div class="bg-layer"></div>
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
console.log(marks.join(' '));
console.log(`index.html written: ${TOTAL}s, ${html.length} nodes, ${tw.length} tweens, ${sfx.length} sfx`);
