# 해외 영상 → 일본 감동 쇼츠: 도베르만과 남자아이

KANENAZO 지침과 별개인 작업. 원본 영상은 레포에 넣지 않는다(사용권 확인 전).

```bash
python3 narration.py WORK/voice          # VOICEVOX 冥鳴ひまり(style 14), video/.voicevox 에 vvms/1.vvm 필요
python3 music.py WORK/music              # 王道進行 피아노+스트링스 BGM (FluidR3_GM)
python3 build.py SRC.mp4 WORK OUT.mp4 ZenMaruGothic-Black.ttf
```

- 대본·자막·타이밍: `script.json`
- 음성 크레딧: `VOICEVOX:冥鳴ひまり` (설명란에 표기)
- 폰트: Zen Maru Gothic Black (SIL OFL)
