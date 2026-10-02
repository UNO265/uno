# タビノメ（TABINOME, 타비노메: '여행의 눈'）브랜드 자료

2026-10-02 제작. 심볼 콘셉트는 사용자가 ChatGPT 시안 중 C안(밖에서 들어오는 여행 궤적)을 고른 뒤 벡터로 다시 그린 것이다.
의미: **원 밖에서 온 여행자의 시선(점선)이 일본의 한 장면(붉은 점)에 닿는 순간.** 「旅する人の目に映った、日本。」(여행하는 사람의 눈에 비친 일본.)

## 파일

| 파일 | 용도 |
|---|---|
| `tabinome-profile-1024.png` | **YouTube 프로필**(1024×1024, 아이보리 배경). 원형 크롭 안전 영역 안에 심볼 전체가 들어간다 |
| `tabinome-profile-preview.png` | 라이트·다크 모드에서 40px·100px 원형 확인 |
| `tabinome-symbol.svg` / `-transparent.svg` / `-dark.svg` | 심볼 원본(벡터). 다크는 어두운 배경용(원·점 아이보리) |
| `tabinome-logo-horizontal*.png` | 가로형 로고(2000×600): 아이보리 배경 / 투명(남색 글자) / 투명(아이보리 글자, 어두운 배경용) |
| `tabinome-banner-2560x1440.png` | YouTube 채널 배너. 로고·문구는 모든 기기 안전 영역(1546×423) 안 |
| `tabinome-watermark-300.png` | 영상 워터마크(투명, 아이보리 + 옅은 그림자 → 밝은·어두운 화면 모두 보임) |
| `src/gen.py`, `src/render.sh` | 심볼 생성(파라미터로 크기·간격 조정)·Chromium 렌더 스크립트 |

## 규칙

- **색**: Deep Navy `#1B2A41` / Japanese Red `#C8102E` / Warm Ivory `#F7F3EA`. 붉은색은 점 하나에만 쓴다.
- **프로필에는 투명 배경을 쓰지 않는다.** 남색 심볼이 YouTube 다크 모드(거의 검정)에서 사라진다. 아이보리 배경을 꽉 채운 `tabinome-profile-1024.png`를 쓴다.
- **글꼴**: 「タビノメ」(타비노메) Noto Sans JP ExtraBold(800), 「TABINOME」 Noto Sans JP SemiBold(600, 자간 0.42em). 자막과 같은 Noto Sans JP 계열(SIL OFL 1.1, 상업 이용 가능). 글꼴 파일은 레포에 넣지 않았다(Google Fonts `ofl/notosansjp`에서 받아 `render.sh` 옆에 둔다).
- 심볼의 비율·점 간격을 임의로 늘리거나 색을 바꾸지 않는다. 바꿀 때는 `src/gen.py`의 상수를 고쳐 다시 만든다.
