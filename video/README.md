# カネナゾ「100円ショップは、なぜ100円で儲かるのか」영상

[스토리보드](../storyboard.md)를 Remotion(React로 애니메이션을 그려 MP4로 렌더링하는 도구)으로 구현한 프로젝트입니다.
CASE #001 전체(131컷, 약 16분 46초)가 구현되어 있습니다. 제작 기준은 [마스터 지침](../docs/KANENAZO_GUIDE.md), 장면 설계는 [CASE #001 장면 설계](../docs/case001-scene-design.md)를 참고하세요.

## 만드는 순서

```bash
npm install
# 필요 도구: ffmpeg, open-jtalk, open-jtalk-mecab-naist-jdic, fonts-noto-cjk
npm run audio      # 내레이션(Open JTalk) + 효과음·BGM 합성 + 증거자료 목록 갱신
npm run studio     # 브라우저에서 미리보기
npm run render     # out/final.mp4 (음량 -14 LUFS로 마스터링)
```

클라우드 환경처럼 Chromium을 따로 지정해야 하면 `REMOTION_CHROME=<경로>`를 설정하세요.

## 구성

| 경로 | 내용 |
|---|---|
| `data/cuts.json` | 컷별 내레이션 대사. `/`가 자막 한 줄 단위 |
| `scripts/narration.py` | 대사를 음성으로 합성하고 컷 길이·자막 타이밍을 `public/timeline.json`에 기록 |
| `scripts/sfx.py` | 효과음과 BGM을 코드로 합성(외부 음원 없음) |
| `scripts/master.sh` | 렌더링 결과의 음량을 YouTube 기준으로 맞춤 |
| `src/cuts/*.tsx` | 컷별 애니메이션 |
| `src/kit.tsx` | 제목·숫자·그래프·흐름도 등 장면 부품 |
| `src/case.tsx` | 증거자료 프레임, 자료 카드, CLUE 보드, MONEY FLOW, 질문 화면 |
| `src/art.tsx` | 값표, 동전, 장바구니, 공장 등 일러스트 부품 |

## 실제 사진·영상(증거자료) 넣기

1. 사용권이 확인된 파일을 `public/evidence/`에 넣습니다. 파일명은 [장면 설계 문서](../docs/case001-scene-design.md)의 증거자료 목록을 따릅니다.
2. `python3 scripts/evidence.py`를 실행하면 목록이 갱신됩니다.
3. 다시 렌더링하면 해당 "EVIDENCE" 프레임이 카네나조 스타일 그래픽 대신 실제 사진·영상으로 바뀝니다.

## 장면 확인용 콘택트 시트

`node scripts/contact.mjs` 를 실행하면 모든 컷의 정지 화면을 `out/contact/sheet_*.jpg`로 모아 줍니다.

## 내레이션 교체 방법

직접 녹음했거나 VOICEVOX 등으로 만든 음성으로 바꿀 수 있습니다.

1. 컷별 음성을 `public/voice/C001.wav` 형식으로 넣습니다(48kHz WAV).
2. `python3 scripts/narration.py --keep-voice`를 실행하면 컷 길이가 새 음성에 맞춰 다시 계산됩니다.
3. `npm run render`로 다시 렌더링합니다.

## 라이선스 표기

임시 내레이션에는 HTS Voice "Mei"(© Nagoya Institute of Technology, CC BY 3.0)를 사용했습니다.
이 음성으로 공개할 경우 영상 설명란에 출처를 표기해야 합니다. 자세한 내용은 `voices/COPYRIGHT.txt`를 참고하세요.
