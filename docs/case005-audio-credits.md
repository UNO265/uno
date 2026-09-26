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

## 최종 완성본 점검(`video/out/case005_final.mp4`)

- **길이**: 12:47.4(1920×1080, 30fps, H.264 / AAC)
- **음량**: 통합 -14.1 LUFS, True Peak -1.1 dBFS, LRA 2.8 LU
- **1.2초 이상의 무음 구간**: 없음 / **1초 이상의 암전**: 없음
- **콘택트 시트**: `video/out/contact_case005/`(컷마다 3점, 두 차례). 자막과 겹치는 도형·빈 화면 14곳을 고친 뒤 렌더
- **`retention_check.py`(실측)**: 모두 통과(타이틀 0:31.6, 최장 컷 37.2초, 답 → 엔딩 18초)
- **전달용 분할**: `video/out/case005_parts/`의 3개 파일(각 25MB 미만, 키프레임 기준) + `join_windows.bat` / `join_mac.command`(합친 길이 12:47.4 확인)
- **썸네일**: `video/out/thumbs/case005_thumb.png`(1280×720)
- **입구 쇼츠**: `video/out/shorts005/KANENAZO_CASE005_short1.mp4`(28.2초, -14.2 LUFS, 피크 -1.4 dBFS, 마지막 프레임과 0프레임 일치)
