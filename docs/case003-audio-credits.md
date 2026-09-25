# CASE #003 오디오 출처·라이선스

CASE #001과 같은 음원·같은 조건입니다. 약관 확인 내용은 [CASE #001 문서](case001-audio-credits.md)를 참고하세요.

| 구분 | 사용한 것 | YouTube 상업 이용·수익화 | 설명란 표기 |
|---|---|---|---|
| 내레이션 | **VOICEVOX** / **雀松朱司(ノーマル, style 52)**, voicevox_core 0.17.0 | 가능(크레딧 표기 조건) | **필요**: `VOICEVOX:雀松朱司` |
| BGM | CASE #003용으로 새로 작곡한 오리지널 10곡(`video/scripts/music.py --case case003`, 무드 lobby·ledger·pressure·seats·aroma·answer·outro), 음원 FluidR3_GM(MIT) | 가능 | 의무 아님 |
| 효과음 | CASE #001과 같은 자체 제작 효과음(팝콘 1회, 종이 5회, 징글 2회) | 가능 | 의무 아님 |

외부 음원 사이트의 BGM·효과음과 실사 영상·사진은 쓰지 않았습니다.

## YouTube 설명란 크레딧(그대로 붙여 넣기)

```
【クレジット】
ナレーション：VOICEVOX:雀松朱司
BGM・効果音：オリジナル（音源：FluidR3_GM SoundFont / MIT License）
```

## 내레이션 연출(`video/scripts/narration.py --case case003`)

- 기본 속도·억양은 CASE #002와 같음. 결론부(M43, M46–M49)는 느리게(SLOW_CUTS)
- FINAL CLUE(M43): 앞에 0.8초, 두 문장 사이에 0.7초 여백
- BGM을 끄는 곳: M01(첫 질문, 팝콘 소리와 목소리만), M17(1454円), M20(KEY TYPOGRAPHY), M43 첫 문장 전
- 읽기 보정(자막에는 영향 없음): TOHOシネマズ→トーホーシネマズ, 弾けさせ→はじけさせ, 日本映画製作者連盟→にほんえいがせいさくしゃれんめい, 日本の映画→にほんの映画

## 최종 완성본 점검(`video/out/case003_final.mp4`)

- **길이**: 14:05.3(1920×1080, 30fps, H.264 / AAC)
- **음량**: 통합 -14.1 LUFS, True Peak -1.1 dBFS, LRA 2.8 LU
- **클리핑**: 0 샘플(최대 피크 -1.13 dBFS)
- **1.5초 이상의 무음 구간**: 없음(가장 긴 정적 1.0초. 0:39 첫 질문 뒤, 3:28 「1454円」 뒤의 의도된 여백)
- **전달용 분할**: `video/out/case003_parts/`의 3개 파일(각 30MB 미만) + `join_windows.bat` / `join_mac.command`(ffmpeg로 무손실 합치기, 합친 길이 14:05.3 확인)
