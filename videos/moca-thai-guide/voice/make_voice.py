"""สร้างเสียงบรรยายภาษาไทยจาก SCRIPT.md ด้วย Microsoft Edge TTS (ฟรี ไม่ต้องสมัคร)

วิธีใช้ (รันบนคอมพิวเตอร์ของคุณ ต้องมี Python 3.9+ และอินเทอร์เน็ต):
    pip install edge-tts
    python make_voice.py

ไฟล์เสียงจะออกมาที่โฟลเดอร์ voice/out/ ชื่อ 01.mp3 ... 14.mp3
เปลี่ยนเสียงผู้ชายได้ด้วย:  python make_voice.py --voice th-TH-NiwatNeural
ปรับความเร็ว เช่น ช้าลง 5%:  python make_voice.py --rate -5%
"""

import argparse
import asyncio
import re
from pathlib import Path

import edge_tts

HERE = Path(__file__).resolve().parent
SCRIPT = HERE.parent / "SCRIPT.md"


def read_lines():
    text = SCRIPT.read_text(encoding="utf-8")
    lines = []
    for m in re.finditer(r"## Line (\d+) .*?\n(?:.*?\n)*?    (\S.*)\n", text):
        spoken = m.group(2).replace(" — ", ", ")
        lines.append((int(m.group(1)), spoken))
    return lines


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="th-TH-PremwadeeNeural")
    ap.add_argument("--rate", default="+0%")
    args = ap.parse_args()

    out = HERE / "out"
    out.mkdir(exist_ok=True)
    lines = read_lines()
    for n, spoken in lines:
        path = out / f"{n:02d}.mp3"
        print(f"[{n:02d}] {spoken}")
        await edge_tts.Communicate(spoken, args.voice, rate=args.rate).save(str(path))
    print(f"\nเสร็จแล้ว {len(lines)} ไฟล์ -> {out}")


if __name__ == "__main__":
    asyncio.run(main())
