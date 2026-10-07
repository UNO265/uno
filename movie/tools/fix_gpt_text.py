"""GPT가 만든 썸네일에서 인물은 그대로 두고 제목 글자만 기준 위치(62.0~80.7%)로 옮기거나 줄인다(guide/01_COVER.md).

사용: python3 tools/fix_gpt_text.py <GPT결과.png> <GPT에 준 사진.png> <출력.png>
1. GPT 결과를 1080x1920으로 맞추고, 준 사진을 ORB로 정렬
2. 글자 띠 위·아래 영역으로 색 회귀(x, x², y, x·y) → 정렬한 사진 색을 GPT 색감에 맞춤
3. 글자 띠를 사진으로 복원(바탕), 차이로 글자+그림자 알파를 뽑음
4. 글자 블록을 아래 끝 기준으로 옮기고·줄여 위 끝 62.0%, 아래 끝 80.7%에 맞춰 다시 얹음
"""
import sys

import cv2
import numpy as np

W, H = 1080, 1920
TOP, BOT = 0.620, 0.807


def text_rows(img):
    r, g, b = [img[..., i].astype(int) for i in (2, 1, 0)]
    m = ((r > 225) & (g > 225) & (b > 225)) | ((r > 220) & (g > 170) & (b < 90))
    rows = np.where(m[int(H * .5):].sum(1) > W * .02)[0] + int(H * .5)
    return rows.min(), rows.max()


G = cv2.resize(cv2.imread(sys.argv[1]), (W, H), interpolation=cv2.INTER_LANCZOS4)
P = cv2.resize(cv2.imread(sys.argv[2]), (W, H))
y0, y1 = text_rows(G)
print(f"before: {y0 / H:.1%}-{y1 / H:.1%}")
# 1) 정렬(글자 없는 위쪽)
orb = cv2.ORB_create(4000)
mask = np.zeros((H, W), np.uint8)
mask[: int(y0 - 60)] = 255
k1, d1 = orb.detectAndCompute(cv2.cvtColor(P, cv2.COLOR_BGR2GRAY), mask)
k2, d2 = orb.detectAndCompute(cv2.cvtColor(G, cv2.COLOR_BGR2GRAY), mask)
mt = sorted(cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True).match(d1, d2), key=lambda m: m.distance)[:600]
A, _ = cv2.estimateAffine2D(np.float32([k1[m.queryIdx].pt for m in mt]), np.float32([k2[m.trainIdx].pt for m in mt]),
                            ransacReprojThreshold=3)
Pw = cv2.warpAffine(P, A, (W, H), borderMode=cv2.BORDER_REFLECT)
# 2) 색 회귀
band0, band1 = int(y0 - 120), int(min(H - 1, y1 + 120))
yy = np.repeat(np.arange(H)[:, None], W, 1) / H
fit_rows = np.r_[max(0, band0 - 250):band0, band1:min(H, band1 + 250)]
C = Pw.astype(np.float32)
for c in range(3):
    x = Pw[fit_rows, :, c].ravel() / 255.0
    y = yy[fit_rows].ravel()
    t = G[fit_rows, :, c].ravel() / 255.0
    X = np.stack([np.ones_like(x), x, x * x, y, x * y], 1)
    beta, *_ = np.linalg.lstsq(X, t, rcond=None)
    xa = Pw[..., c] / 255.0
    C[..., c] = np.clip((beta[0] + beta[1] * xa + beta[2] * xa * xa + beta[3] * yy + beta[4] * xa * yy) * 255, 0, 255)
# 3) 바탕 복원 + 글자 알파
fe = np.zeros((H, 1), np.float32)
fe[band0:band1] = 1
fe = cv2.GaussianBlur(fe, (1, 61), 0)[:, :, None]
base = G * (1 - fe) + C * fe
diff = np.abs(G.astype(np.float32) - C).max(2)
alpha = np.clip((diff - 14) / 40, 0, 1)
alpha[:band0] = 0
alpha[band1:] = 0
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
# 4) 글자 블록 이동·축소(아래 끝 기준)
s = (BOT - TOP) * H / (y1 - y0)
ty = BOT * H - s * y1
M = np.float32([[s, 0, W / 2 * (1 - s)], [0, s, ty]])
Tg = cv2.warpAffine(G.astype(np.float32), M, (W, H))
Ta = cv2.warpAffine(alpha, M, (W, H))[..., None]
out = np.clip(base * (1 - Ta) + Tg * Ta, 0, 255).astype(np.uint8)
cv2.imwrite(sys.argv[3], out)
a, b = text_rows(out)
print(f"scale {s:.3f}  after: {a / H:.1%}-{b / H:.1%} (rule 62.0-80.7%)")
