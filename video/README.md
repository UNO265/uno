# カネナゾ「100円ショップは、なぜ100円で儲かるのか」영상

[스토리보드](../storyboard.md)를 Remotion(React로 애니메이션을 그려 MP4로 렌더링하는 도구)으로 구현한 프로젝트입니다.
CASE #001 전체(131컷, 16분 01초)가 구현되어 있습니다. 제작 기준은 [마스터 지침](../docs/KANENAZO_GUIDE.md), 장면 설계는 [CASE #001 장면 설계](../docs/case001-scene-design.md)를 참고하세요.

## 만드는 순서

```bash
npm install
# 필요 도구: ffmpeg, fluidsynth, fluid-soundfont-gm, fonts-noto-cjk / pip: numpy, mido
scripts/setup_voicevox.sh   # VOICEVOX(雀松朱司) 엔진 일식을 .voicevox/ 에 준비
npm run audio      # 내레이션(VOICEVOX) → 효과음 → 장별 BGM 작곡 → 증거자료 목록 갱신
npm run studio     # 브라우저에서 미리보기
npm run render     # out/final.mp4 (음량 -14 LUFS로 마스터링)
```

### CASE #002

```bash
python3 scripts/narration.py --case case002   # cases/case002/cuts.json → public/case002/voice, timeline.json
python3 scripts/music.py --case case002       # public/case002/music/
python3 scripts/evidence.py                   # 실사 슬롯 목록(public/case002/stock/) 갱신
npx remotion render Case002 out/case002_render.mp4 --concurrency=4
scripts/master.sh out/case002_render.mp4 out/case002_final.mp4
CASE=case002 AT=0.35,0.85 node scripts/contact.mjs   # 장면 확인용 콘택트 시트
```

화면 코드는 `src/case002/`(CASE #001 부품은 쓰지 않고 v2 기준으로 새로 만듦), 장면 설계는 [CASE #002 장면 설계](../docs/case002-scene-design.md)를 참고하세요.

### 세종「고기 없인 못 살던 왕과 꺼지지 않는 편전의 불빛」(한국어 역사 영상)

대본은 [최종 대본](../docs/sejong/sejong-final-script.md), 컷 목록은 `data/sejong/cuts.json`(83컷·217줄, 대본과 글자 단위로 일치), 화면 코드는 `src/sejong/`입니다. 스타일은 한지 위 먹선 + 촛불 한 점, 세종의 눈이 흐려지는 흐림 효과(2장~5장)가 훈민정음 장면에서 걷힙니다.

```bash
pip install numpy pillow edge-tts
python3 scripts/sejong_texture.py          # 한지·먹 바탕 PNG (한 번만)
python3 scripts/sejong_voice.py            # 음성 → 타이밍(public/sejong/timeline.json). 음성이 없으면 글자 수로 추정
python3 scripts/sejong_music.py            # 국악풍 BGM(가야금풍 현·드론·대금풍) + 효과음, 직접 합성
REMOTION_CHROME=<chrome 경로> node scripts/sejong_contact.mjs   # 확인용 시트 out/contact_sejong/
REMOTION_CHROME=<chrome 경로> scripts/sejong_render.sh out/sejong.mp4   # 구간별 렌더링(끊기면 이어서) → 합치기
python3 scripts/sejong_split.py              # 원본 화질 그대로 25MB 이하 조각으로 나누기 → out/sejong_split/ (pip install av)
scripts/sejong_youtube.sh                   # (참고) 한 파일로 강하게 압축한 버전(1080p HEVC, 약 28.5MB) → out/sejong_youtube.mp4
```

최종 영상은 나눠서 받은 뒤 합친다(`SEJONG_1of5.mp4`… + `join_windows.bat`). 조각은 재압축 없이 원본 데이터를 그대로 나눈 것이라, 한 폴더에 두고 `join_windows.bat`을 실행하거나
같은 ffmpeg concat 명령으로 이어 붙이면 원본과 같은 파일이 된다(영상 프레임 일치 확인).

내레이션 넣기 (셋 중 하나, 넣은 뒤 `sejong_voice.py` → `sejong_music.py` → 렌더링 순서로 다시 실행):

- Supertonic 3(권장, 오프라인·상업 이용 가능한 OpenRAIL-M 모델): `pip install supertonic soundfile && python3 scripts/sejong_voice.py --engine supertonic` (기본 목소리 `M2` 저음 남성, 말 속도 초당 6.8음절(문장마다 재서 맞춤). 처음 실행 때 Hugging Face에서 모델을 `.models/supertonic-3`에 받음. 연도 같은 숫자는 한글 한자어로 풀어 읽히고, 잘못 읽는 말은 `sejong_voice.py`의 `READ` 표에서 읽기용으로만 고침)
- 직접 녹음·외부 TTS: 줄마다 `public/sejong/voice/<컷ID>_<줄번호>.wav`(예: `H01_0.wav`)로 넣고 `python3 scripts/sejong_voice.py`
- Google Cloud TTS: `GOOGLE_TTS_API_KEY=... python3 scripts/sejong_voice.py --engine google` (기본 목소리 `ko-KR-Neural2-C`, 남성 중저음)
- Edge TTS: `python3 scripts/sejong_voice.py --engine edge` (기본 `ko-KR-InJoonNeural`, 네트워크에서 `speech.platform.bing.com` 허용 필요)

음성이 하나도 없으면 `timeline.json`에 `"placeholder": true`가 붙고, 자막·BGM만 있는 미리보기로 렌더링됩니다.

클라우드 환경처럼 Chromium을 따로 지정해야 하면 `REMOTION_CHROME=<경로>`를 설정하세요.

## 구성

| 경로 | 내용 |
|---|---|
| `data/cuts.json` | 컷별 내레이션 대사. `/`가 자막 한 줄 단위 |
| `scripts/narration.py` | VOICEVOX 雀松朱司로 내레이션을 합성하고, 실제 발화 길이로 컷 길이·자막 타이밍을 `public/timeline.json`에 기록 |
| `scripts/sfx.py` | 효과음 제작(FluidR3_GM 악기음 + 부드러운 종이·공기 소리) |
| `scripts/music.py` | 장별 BGM 14곡을 작곡·렌더링(`public/music/`) |
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

## 라이선스 표기

내레이션·BGM·효과음의 출처와 YouTube 설명란 크레딧은 [오디오 출처·라이선스](../docs/case001-audio-credits.md)를 참고하세요. 필수 표기는 `VOICEVOX:雀松朱司`입니다.
