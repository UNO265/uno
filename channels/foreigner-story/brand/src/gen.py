"""タビノメ 심볼: 열린 원 + 밖에서 들어오는 점 4개 + 붉은 점. 모든 좌표는 1024 캔버스."""
import math, json, sys

NAVY, RED, IVORY = "#1B2A41", "#C8102E", "#F7F3EA"

R = 250          # 원 반지름(선 중심)
SW = 58          # 원 선 두께
RED_R = 54       # 붉은 점 반지름
RED_OFF = (62, -52)   # 원 중심에서 붉은 점까지(화면 좌표, y 아래)
DIR_DEG = 207    # 붉은 점에서 점선이 뻗어 나가는 방향(수학 각도, y 위)
DOTS_REL = [(-201, 38), (-96, 32), (0, 27), (87, 22)]   # (원과 만나는 지점 기준 거리, 반지름): 안쪽 2 · 틈 1 · 바깥 1, 가장자리 간격 약 35
GAP_CLEAR = 20   # 틈을 지나는 점과 원 끝(둥근 캡) 사이 여백


def geometry():
    cx, cy = 0.0, 0.0
    rx, ry = cx + RED_OFF[0], cy + RED_OFF[1]
    ux, uy = math.cos(math.radians(DIR_DEG)), -math.sin(math.radians(DIR_DEG))
    # 점선이 원(선 중심)을 지나는 지점: |(rx,ry)+t*u| = R
    b = rx * ux + ry * uy
    c = rx * rx + ry * ry - R * R
    t = -b + math.sqrt(b * b - c)
    dots = [(rx + ux * (t + d), ry + uy * (t + d), r) for d, r in DOTS_REL]
    px, py = rx + ux * t, ry + uy * t
    theta = math.atan2(py, px)  # 화면 좌표 각도
    # 원 위에서 가장 가까운 점의 반지름으로 틈 크기 결정
    near = dots[2]
    need = near[2] + GAP_CLEAR + SW / 2   # 틈 중심에서 캡 중심까지 필요한 호 길이(직선 근사)
    half = 2 * math.asin(min(1, need / (2 * R)))
    a0, a1 = theta + half, theta - half + 2 * math.pi   # 틈 반대쪽으로 도는 호
    return dict(rx=rx, ry=ry, dots=dots, a0=a0, a1=a1, t=t)


def arc_path(a0, a1):
    x0, y0 = R * math.cos(a0), R * math.sin(a0)
    x1, y1 = R * math.cos(a1), R * math.sin(a1)
    large = 1 if (a1 - a0) % (2 * math.pi) > math.pi else 0
    return f"M{x0:.2f},{y0:.2f} A{R},{R} 0 {large} 1 {x1:.2f},{y1:.2f}"


def extent(g):
    pts = []
    for k in range(0, 360, 2):
        a = math.radians(k)
        pts.append((R * math.cos(a), R * math.sin(a), SW / 2))
    pts += [(g["rx"], g["ry"], RED_R)] + g["dots"]
    xs = [p[0] - p[2] for p in pts] + [p[0] + p[2] for p in pts]
    ys = [p[1] - p[2] for p in pts] + [p[1] + p[2] for p in pts]
    bx, by = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    far = max(math.hypot(p[0] - bx, p[1] - by) + p[2] for p in pts)
    return bx, by, far


def symbol_group(ring=NAVY, dots=NAVY, red=RED):
    """중심 (0,0), 바깥 반지름 1로 정규화한 <g>. 쓰는 쪽에서 translate/scale."""
    g = geometry()
    bx, by, far = extent(g)
    s = 1 / far
    body = [f'<path d="{arc_path(g["a0"], g["a1"])}" fill="none" stroke="{ring}" stroke-width="{SW}" stroke-linecap="round"/>']
    body += [f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="{dots}"/>' for x, y, r in g["dots"]]
    body.append(f'<circle cx="{g["rx"]:.2f}" cy="{g["ry"]:.2f}" r="{RED_R}" fill="{red}"/>')
    return f'<g transform="scale({s:.6f}) translate({-bx:.2f},{-by:.2f})">' + "".join(body) + "</g>"


def svg(size=1024, bg=IVORY, radius_ratio=0.68, **colors):
    """정사각형. 심볼 전체가 지름의 radius_ratio 원 안(원형 크롭 안전 영역)에 들어간다."""
    r = size / 2 * radius_ratio
    bgrect = f'<rect width="{size}" height="{size}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">'
            f'{bgrect}<g transform="translate({size/2},{size/2}) scale({r:.4f})">{symbol_group(**colors)}</g></svg>')


if __name__ == "__main__":
    out = sys.argv[1]
    open(f"{out}/tabinome-symbol.svg", "w").write(svg())
    open(f"{out}/tabinome-symbol-transparent.svg", "w").write(svg(bg=None))
    open(f"{out}/tabinome-symbol-dark.svg", "w").write(svg(bg="#14151A", ring=IVORY, dots=IVORY))
    print(json.dumps({k: (round(v, 1) if isinstance(v, float) else None) for k, v in geometry().items() if k != "dots"}))
