# 해외 영상 → 일본 타깃 쇼츠

KANENAZO 지침(`docs/guide/`)과 별개인 작업. 원본 영상·완성 MP4는 레포에 넣지 않는다(사용권 확인 전).

## 원칙 (사용자 결정)

- **목소리는 영상 분위기에 맞춰 매번 고른다.** 감동 → 冥鳴ひまり, 귀여움·태클 → ずんだもん 등. `script.json`의 `voice`에 기록하고 설명란에 `VOICEVOX:캐릭터명` 크레딧을 넣는다.
- 레이아웃은 도베르만 v3 확정안: 전체 화면 + 상단 제목 띠(12.5%) + 쇼츠 UI를 피한 자막(x 60–940, 하단 75% 위).
- 원본 영상의 음악은 저작권 위험이 있으면 빼고(`orig_audio: 0`) BGM은 CASE마다 직접 작곡.
- 원본에 박힌 외국어 문구는 흐림 처리하고 맞는 일본어로 바꿔 넣는다(`source.blur` + `captions`의 `style: overlay`).

## 만드는 법 (공통)

```bash
python3 common/narration.py CASE/script.json WORK/voice
python3 CASE/music.py WORK/music
python3 common/build.py CASE/script.json SRC.mp4 WORK OUT.mp4 ZenMaruGothic-Black.ttf
```

| CASE | 내용 | 목소리 |
|---|---|---|
| `doberman/` | 도베르만과 남자아이 (감동), 확정 v3 — 이 폴더는 자체 build.py 사용 | 冥鳴ひまり |
| `tortoise/` | 새끼 육지거북의 1일 (힐링·태클) | ずんだもん |
