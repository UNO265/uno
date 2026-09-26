# CASE #005 오디오 출처·라이선스

CASE #001과 같은 음원·같은 조건입니다. 약관 확인 내용은 [CASE #001 문서](case001-audio-credits.md)를 참고하세요.

| 구분 | 사용한 것 | YouTube 상업 이용·수익화 | 설명란 표기 |
|---|---|---|---|
| 내레이션 | **VOICEVOX** / **雀松朱司(ノーマル, style 52)**, voicevox_core 0.17.0 | 가능(크레딧 표기 조건) | **필요**: `VOICEVOX:雀松朱司` |
| BGM | CASE #005용으로 새로 작곡한 오리지널 8곡(`video/scripts/music.py --case case005`, 무드 o_open·route·money·strategy·night_road·pressure·answer·outro, CASE 주제 선율 포함), 음원 FluidR3_GM(MIT) | 가능 | 의무 아님 |
| 효과음 | CASE #001과 같은 자체 제작 효과음(동전·종이·도장·징글 등) | 가능 | 의무 아님 |

외부 음원 사이트의 BGM·효과음과 실사 영상·사진은 쓰지 않았습니다.

## 내레이션 연출(`video/scripts/narration.py --case case005`)

- 구간별 말투(속도·억양·높이): [장면 설계 9번](case005-scene-design.md#9-내레이션-말투-case-005부터)
- 줄표(――) 뒤 0.55초 쉼, CLUE 카드 문장은 0.93배 속도
- 결론부(K34–K39)는 느리게(SLOW_CUTS)
- BGM을 끄는 곳: K01(첫 질문), K26(CLUE 03), K35 첫 문장 전
- 읽기 보정(자막에는 영향 없음): 日本の人口→にほんの人口, 年960時間/年4900円/年5900円→ねん, 月600円→つき, 支払い手→しはらいて
