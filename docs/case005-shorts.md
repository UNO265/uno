# CASE #005 입구 쇼츠 1편 (송료무료)

[쇼츠 지침 v1](KANENAZO_SHORTS_v1.md) 3번에 따라 **입구 1편**만 만들었습니다. 끝부분은 CASE #004 쇼츠에서 사용자가 정한 **반복 재생형**(본편 썸네일 화면 → 첫 화면으로)을 따랐습니다. 본편 「送料無料、本当に無料？」(12:47)에서 확인된 사실만 썼습니다.

| 항목 | 내용 |
|---|---|
| 0프레임 질문 | 「送料無料、本当に無料？」(본편 제목과 같은 문장, 글자 + 첫 음성). 상자는 0프레임부터 작게 맥박친다 |
| 작은 답(본편 REWARD 1) | 注文画面は0円 → でも運ぶ仕事はある → 1個711円（ヤマト・2025年3月期、大口の割引を含む平均）→ 1個ごとに運賃 → 0円ではない |
| 본편으로 넘기는 질문 | 「その送料は、誰が払う？」 = 본편 썸네일 질문과 같은 말. 본편 8:47 CLUE 03·12:12 답에서 회수 |
| 말하지 않은 것 | 본편의 MID REVEAL(運ぶ人の時間)과 최종 답(見えなくする仕組み) |
| 끝 | 본편 썸네일과 같은 그림(상자 + 0円 + 誰が払う？) → 마지막 0.5초에 첫 화면(S01)으로 바뀜. 상자는 같은 위치·크기라 이음새가 없다. 광고 문구 없음 |
| 길이 | 28.2초(-14.2 LUFS, 피크 -1.4 dBFS) |

- 형식 1080×1920 / 30fps, 음성 VOICEVOX 雀松朱司 1.3배, BGM은 본편 「route」 분위기와 CASE 주제 선율로 새로 작곡, 실사 없음.
- 대본: `cases/case005_shorts/short1/cuts.json`, 화면: `video/src/shorts005/short1.tsx`

## 만드는 방법

```bash
cd video
python3 scripts/narration.py --case case005_shorts/short1 --rate 1.3
python3 scripts/music.py --case case005_shorts/short1
npx remotion render Short005-1 out/shorts005/render_1.mp4
scripts/master.sh out/shorts005/render_1.mp4 out/shorts005/KANENAZO_CASE005_short1.mp4
```

## 올리는 순서

1. **본편을 먼저 공개**합니다.
2. 쇼츠는 당일~다음 날, Studio에서 **「関連動画」에 본편 지정**.
3. 1~2주 뒤 関連動画 클릭 수를 [성과 기록](performance-log.md) K 줄에 적습니다.

## 업로드 문구

```
送料無料、本当に無料？ #Shorts
注文画面は「送料0円」。でも宅配便の平均単価は1個711円（ヤマト運輸・2025年3月期、大口の割引を含む平均）。運ぶお金は、0円ではない。
では、その送料は、誰が払う？
【本編】

出典：ヤマトホールディングス 決算資料（2025年3月期）
ナレーション：VOICEVOX:雀松朱司
BGM：オリジナル（FluidR3_GM SoundFont / MIT License）

#送料無料 #物流 #経済 #KANENAZO
```

고정 댓글: 「送料を払っている"もう一人"を、本編で追いかけました → (본편 URL)」
