# CASE #004 오디오 출처·라이선스

CASE #001과 같은 음원·같은 조건입니다. 약관 확인 내용은 [CASE #001 문서](case001-audio-credits.md)를 참고하세요.

| 구분 | 사용한 것 | YouTube 상업 이용·수익화 | 설명란 표기 |
|---|---|---|---|
| 내레이션 | **VOICEVOX** / **雀松朱司(ノーマル, style 52)**, voicevox_core 0.17.0 | 가능(크레딧 표기 조건) | **필요**: `VOICEVOX:雀松朱司` |
| BGM | CASE #004용으로 새로 작곡한 오리지널 10곡(`video/scripts/music.py --case case004`, 무드 night·mechanism·market·time·contrast·answer·outro), 음원 FluidR3_GM(MIT) | 가능 | 의무 아님 |
| 효과음 | CASE #001과 같은 자체 제작 효과음(동전·종이·도장·징글) | 가능 | 의무 아님 |

외부 음원 사이트의 BGM·효과음과 실사 영상·사진은 쓰지 않았습니다.

## 내레이션 연출(`video/scripts/narration.py --case case004`)

- 결론부(N48, N50–N53)는 느리게(SLOW_CUTS)
- 도입부(N02–N05)는 쉼을 줄여 CASE 타이틀을 0:33.5에 둠(시청지속 지침 11-1)
- BGM을 끄는 곳: N01(첫 질문, 드럼 화면과 목소리만), N25(1155億円), N39(誰が作業をしているか), N48 첫 문장 전
- 읽기 보정(자막에는 영향 없음): MONEY FLOW→マネーフロー, 日本経済新聞→にほんけいざいしんぶん, 梅雨→つゆ, 店頭型→てんとうがた, 日本では/日本の多く/日本のコインランドリー→にほん

## 최종 완성본 점검(`video/out/case004_final.mp4`)

- **길이**: 12:28.0(1920×1080, 30fps, H.264 / AAC)
- **음량**: 통합 -14.2 LUFS, True Peak -1.1 dBFS, LRA 2.9 LU
- **1.2초 이상의 무음 구간**: 없음 / **1초 이상의 암전**: 없음
- **콘택트 시트**: `video/out/contact_case004/`(컷마다 3점). 자막과 겹치는 도형·빈 화면을 고친 뒤 렌더
- **전달용 분할**: `video/out/case004_parts/`의 3개 파일(각 25MB 미만, 키프레임 기준) + `join_windows.bat` / `join_mac.command`(합친 길이 12:28.1 확인)
