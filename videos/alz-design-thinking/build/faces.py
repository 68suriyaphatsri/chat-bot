"""Track interviewee faces in the interview ranges and write build/faces.json.

Offline: OpenCV Haar cascades (frontal + profile, both directions). Each person has a hand-set
seed box (960x540 source pixels) that limits where their face can be; detections are
assigned to the nearest person, smoothed, and gaps are filled by interpolation.
Run: python3 build/faces.py [--debug OUT_DIR]
"""
import cv2, json, sys, os, subprocess
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 10
# person: (src, [ranges], seed box x0,y0,x1,y1 in 960x540, fallback face size)
PEOPLE = json.load(open(os.path.join(ROOT, 'build', 'faces-seeds.json')))

cas = [cv2.CascadeClassifier(cv2.data.haarcascades + n) for n in
       ('haarcascade_frontalface_default.xml', 'haarcascade_frontalface_alt2.xml', 'haarcascade_profileface.xml')]

def frames(src, a, b):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(a), '-t', str(b - a), '-i', os.path.join(ROOT, 'public/footage', src + '.mp4'),
                          '-vf', f'fps={FPS},scale=960:540', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
    n = len(raw) // (960 * 540 * 3)
    return np.frombuffer(raw[:n * 960 * 540 * 3], np.uint8).reshape(n, 540, 960, 3)

def detect(img, box):
    x0, y0, x1, y1 = box
    roi = cv2.cvtColor(img[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)
    roi = cv2.equalizeHist(roi)
    out = []
    for i, c in enumerate(cas):
        for flip in ((False, True) if i == 2 else (False,)):
            g = cv2.flip(roi, 1) if flip else roi
            for (x, y, w, h) in c.detectMultiScale(g, 1.1, 4, minSize=(36, 36)):
                if flip: x = roi.shape[1] - x - w
                out.append((x0 + x + w / 2, y0 + y + h / 2, w))
    return out

def track(person):
    res = []
    for (a, b) in person['ranges']:
        fr = frames(person['src'], a, b)
        cx, cy = (person['box'][0] + person['box'][2]) / 2, (person['box'][1] + person['box'][3]) / 2
        last = person.get('init', [cx, cy, person['size']])
        raw = []
        for i, img in enumerate(fr):
            ds = detect(img, person['box'])
            if ds:
                d = min(ds, key=lambda d: (d[0] - last[0]) ** 2 + (d[1] - last[1]) ** 2)
                if (d[0] - last[0]) ** 2 + (d[1] - last[1]) ** 2 < 140 ** 2 or not raw:
                    last = list(d); raw.append((a + i / FPS, *d)); continue
            raw.append((a + i / FPS, None, None, None))
        # fill gaps by interpolation, then median smooth
        t = np.array([r[0] for r in raw]); arr = np.array([[np.nan if v is None else v for v in r[1:]] for r in raw], float)
        for k in range(3):
            ok = ~np.isnan(arr[:, k])
            arr[:, k] = np.interp(t, t[ok], arr[ok, k]) if ok.any() else [cx, cy, person['size']][k]
        sm = arr.copy()
        for i in range(len(arr)):
            sm[i] = np.median(arr[max(0, i - 3):i + 4], axis=0)
        sm[:, 2] = np.maximum(sm[:, 2], person['size'] * 0.8)
        hit = sum(r[1] is not None for r in raw)
        print(f"{person['name']} {a}-{b}: {hit}/{len(raw)} frames detected", file=sys.stderr)
        res.append({'a': a, 'b': b, 'samples': [[round(float(tt), 2), round(float(x), 1), round(float(y), 1), round(float(s), 1)] for tt, (x, y, s) in zip(t, sm)]})
    return res

out = []
for p in PEOPLE:
    out.append({'name': p['name'], 'src': p['src'], 'sticker': p.get('sticker', 0), 'tracks': track(p)})
json.dump(out, open(os.path.join(ROOT, 'build', 'faces.json'), 'w'), ensure_ascii=False)

if '--debug' in sys.argv:
    od = sys.argv[sys.argv.index('--debug') + 1]; os.makedirs(od, exist_ok=True)
    for p in out:
        for tr in p['tracks']:
            fr = frames(p['src'], tr['a'], tr['b'])
            tiles = []
            for i in range(0, len(fr), 5):
                img = fr[i].copy(); _, x, y, s = tr['samples'][min(i, len(tr['samples']) - 1)]
                r = int(s * 0.85)
                cv2.circle(img, (int(x), int(y)), r, (0, 0, 255), 3)
                x0, y0, x1, y1 = next(q['box'] for q in PEOPLE if q['name'] == p['name'])
                cv2.rectangle(img, (x0, y0), (x1, y1), (0, 255, 0), 1)
                cv2.putText(img, f"{tr['samples'][min(i, len(tr['samples'])-1)][0]:.1f}", (8, 30), 0, 1, (0, 255, 255), 2)
                tiles.append(cv2.resize(img, (320, 180)))
            while len(tiles) % 6: tiles.append(np.zeros_like(tiles[0]))
            grid = np.vstack([np.hstack(tiles[i:i + 6]) for i in range(0, len(tiles), 6)])
            cv2.imwrite(os.path.join(od, f"{p['name']}_{tr['a']}.jpg"), grid)
