# カネナゾ「100円ショップは、なぜ100円で儲かるのか」영상

[스토리보드](../storyboard.md)를 Remotion(React로 애니메이션을 그려 MP4로 렌더링하는 도구)으로 구현한 프로젝트입니다.
현재는 **샘플 구간(C001–C011, 약 1분)** 까지 구현되어 있습니다.

## 만드는 순서

```bash
npm install
# 필요 도구: ffmpeg, open-jtalk, open-jtalk-mecab-naist-jdic, fonts-noto-cjk
npm run audio      # 내레이션(Open JTalk) + 효과음·BGM 합성 → public/
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
| `src/art.tsx` | 값표, 동전, 장바구니, 공장 등 일러스트 부품 |

## 내레이션 교체 방법

직접 녹음했거나 VOICEVOX 등으로 만든 음성으로 바꿀 수 있습니다.

1. 컷별 음성을 `public/voice/C001.wav` 형식으로 넣습니다(48kHz WAV).
2. `python3 scripts/narration.py --keep-voice`를 실행하면 컷 길이가 새 음성에 맞춰 다시 계산됩니다.
3. `npm run render`로 다시 렌더링합니다.

## 라이선스 표기

임시 내레이션에는 HTS Voice "Mei"(© Nagoya Institute of Technology, CC BY 3.0)를 사용했습니다.
이 음성으로 공개할 경우 영상 설명란에 출처를 표기해야 합니다. 자세한 내용은 `voices/COPYRIGHT.txt`를 참고하세요.
