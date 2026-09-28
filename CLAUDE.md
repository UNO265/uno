# カネナゾ / KANENAZO

일본어 경제 미스터리 다큐멘터리 YouTube 채널의 영상 제작 레포.

## 지침 (2026-09-28 정리: 이 6개가 전부다)

지침은 **`docs/guide/`** 에 제작 순서대로 있다. 규칙 하나는 한 곳에만 있다. 옛 지침 8개는 `docs/archive/`(보관, 근거용)이고, 옛 번호가 어디로 갔는지는 `docs/guide/MAPPING.md`.

| 문서 | 언제 |
|---|---|
| **[00_CORE](docs/guide/00_CORE.md)** | 항상. 최상위(약속·사실 규칙·분량·제작 순서·고정 엔딩·PROMISE AUDIT) |
| [01_PLANNING](docs/guide/01_PLANNING.md) | 주제·ANSWER CARD·조사·제목·썸네일 |
| [02_SCRIPT](docs/guide/02_SCRIPT.md) | 질문 사슬·첫 30초·대본·검사 |
| [03_VISUAL_AUDIO](docs/guide/03_VISUAL_AUDIO.md) | 음성·장면 설계·화면·BGM·렌더링·전달 |
| [04_SHORTS](docs/guide/04_SHORTS.md) | 쇼츠 |
| [05_DATA](docs/guide/05_DATA.md) | 업로드·성과 기록·해석 |

양식: `docs/templates/`(question-chain-design, scene-design-v3, prerender-checklist, upload-checklist). 기록: `docs/performance-log.md`, 로드맵: `docs/case-roadmap.md`.

## 꼭 기억할 것 (자세한 내용은 위 문서)

- **약속**: 제목·썸네일·첫 30초의 질문은 영상의 1/3 안에 같은 형식(숫자·이유·예/아니오)으로 답하고, 마지막에 더 정확하게 다시 답한다. 주제 전에 ANSWER CARD. 비공개 숫자는 첫 1분 안에 말한다. 회피형 결론 금지. (C2)
- **분량**: 4,000자 이상, 5,000자 내외. 모자라면 조사를 더 한다. 반복·채우기 금지. (C3)
- **사실**: 숫자를 만들지 않는다. 売上≠利益. 과거 자료를 현재처럼, 기업 의도를 단정하지 않는다. 계산·이미지·보도는 표시. (C4)
- **실사 없음**(CASE #010까지), 사용권 확인된 자료만. (C5)
- **사용자가 확정한 주제·제목·질문·방향·결론은 바꾸지 않는다.** (C6)
- **단계마다 사용자 확정**: 제목 → 질문 사슬 설계 → 대본 → 최종 음성·장면 설계 → 제작·렌더링. 대본을 받으면 영상부터 만들지 않는다. 최종 일본어 음성을 먼저 만들고 그 길이에 맞춘다. (C7)
- **첫 30초(CASE #008부터)**: 공감 장면 → 위화감 → 제목 질문 → 약속·예고 → 타이틀 2~3초 → 비공개 한 문장. (S4)
- 사용자가 **"최종 대본"** 을 요청하면 일본어 내레이션만 코드 블록 하나로. (S1)
- **썸네일 이미지는 사용자가 직접 만든다**(우리는 설계안만). (P5)
- 쇼츠는 CASE마다 ① 입구 ② 의외의 숫자 ③ 돈의 흐름, 반복 재생형, 최근 10편 평균 1,000회 목표. (04)
- 내레이션 VOICEVOX 雀松朱司(style 52), BGM·효과음은 FluidR3_GM 기반 CASE별 자체 작곡(`docs/case001-audio-credits.md`). 빌드는 `video/README.md`.
