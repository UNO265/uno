# 썸네일 A/B: #006·#007 (2026-10-02 시작)

YouTube 「테스트 및 비교」: **A = 현재(GPT 제작)**, **B·C = 새 설계**. 제목은 바꾸지 않는다. 승자는 시청 시간 점유율로 정해진다.
제작: 사진(글자 없음)은 사용자가 GPT로 생성 → Claude가 글자·구성을 얹어 완성(`video/src/thumbs2/ab/`).

## 설계 원칙 (#002 분석에서)

- 대상은 **인접 큰 장르의 시각 언어**로(#006 → 가챠 전문점 탐방·개봉, #007 → 비즈니스호텔 숙박 리뷰·출장).
- **두 숫자의 충돌** 하나 + 짧은 질문. 초점 하나. 답은 쓰지 않는다(P5).

## #006 ガチャガチャ、なぜ500円に？

| 안 | 숫자 | 질문 | 영상 속 답 |
|---|---|---|---|
| B | `20円 → 500円` | `なぜ売れる？` | 1977년 주류 20엔(대본), 답 1:54 「買う人が変わった」 |
| C | `1回500円` / `つい1,400円` | `なぜ回す？` | 연속으로 돌릴 때 최고액 평균 1,200~1,400엔대(대본), 답 1:54 |

## #007 ビジネスホテル、なぜ1泊1.5万円に？

| 안 | 숫자 | 질문 | 영상 속 답 |
|---|---|---|---|
| B | 같은 방 `6,000円` / `26,200円` | `なぜ？` | 이케부쿠로 같은 5월 싱글(대본), 답 2:00·3:20 「残りの部屋の数で決まる」 |
| C | `1泊 14,463円` vs `出張費 8,878円` | `足りない？` | 대형 평균 vs 출장 숙박비 평균(대본 앞부분) |

## GPT 이미지 프롬프트 (글자 없는 사진만 생성)

공통 끝부분: `16:9, 1280x720, photorealistic, shallow depth of field, cinematic warm lighting, high contrast, subject on the LEFT 55% of the frame, RIGHT 45% simple and dark for text overlay, absolutely no text, no letters, no numbers, no logos, no brand names, no copyrighted characters.`

- **#006-B/C**: `Close-up of a hand holding a single translucent capsule toy (blank, no character inside, just a small generic colorful plastic toy) in front of a long blurred wall of capsule toy vending machines in a bright Japanese capsule toy shop, colorful bokeh.` + 공통
- **#007-B**: `A neat Japanese business hotel single room at night, white bed with a card key placed on the pillow, city lights through the window, viewed from the door.` + 공통
- **#007-C**: `A businessman's hand holding a hotel card key and a folded paper receipt (blank, unreadable) at a business hotel front desk at night.` + 공통

받은 사진 파일명: `t006b.jpg`, `t006c.jpg`, `t007b.jpg`, `t007c.jpg`(B와 C가 같은 사진이어도 된다).
