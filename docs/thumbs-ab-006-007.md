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

## 받은 완성본 (2026-10-02) — `docs/thumbs-ab/`

원본 1672×941 PNG(최대 2.06MB, YouTube 썸네일 상한 2MB 초과) → **1280×720 JPG**(220~330KB)로 변환해 보관.

| 영상 | B 派手(노랑 그라데이션+빨간 띠) | C 経済誌(흰 글자+주황 선+흰 띠) | 테스트 |
|---|---|---|---|
| #009 | `009_B_hade.jpg` | `009_C_keizaishi.jpg` | 미업로드 → 공개 첫날부터 B vs C |
| #008 | `008_B_hade.jpg` | `008_C_keizaishi.jpg` | 미업로드 → 공개 첫날부터 B vs C |
| #007 | `007_B_hade.jpg` | `007_C_keizaishi.jpg` | 현재(A) vs B vs C |
| #006 | `006_B_hade.jpg` | `006_C_keizaishi.jpg` | 현재(A) vs B vs C |

검수 메모
- 비율·글자 가독성(모바일 축소)·숫자는 모두 대본과 일치(10兆円 = 2024년도 업계 매출 10兆307億円, 881億円, 6,000円/26,200円).
- #009: 장바구니 내용물이 슈퍼마켓으로 읽힌다. 영상의 위화감은 "드러그스토어에서 식품"이므로, 다음 버전에서는 **계란·우유 옆에 약 상자**를 한 장바구니에 넣는 안을 시험할 가치가 있다(선택).
- #008: 자판기 버튼이 둥근 발광 노브(일본 자판기와 다름). 축소 시에는 거의 안 보여서 이번엔 그대로.
- #007 C: `6,000円`이 작고 화살표가 가늘어 두 숫자의 충돌이 약하다. B에서는 6,000円을 키운다.
- #007 B: 가격표 두 장(파랑 6,000円 / 노랑 26,200円)으로 두 숫자의 충돌이 C보다 강하다.
- #006: 취소선이 `1977年`까지 그어져 "연도가 틀렸다"로도 읽힌다(가격만 긋는 게 정확). 캡슐 속이 구슬·블록 뭉치라 껌볼처럼 보일 수 있다. B 왼쪽 위에 깨진 글자 흔적(작음). 이번엔 그대로 테스트.
- #006 수정판(2026-10-02): 취소선은 `20円`만, 캡슐 속은 일반 동물 피규어 1개(C 고양이, B 시바견). B 왼쪽 위 글자 흔적은 이쪽에서 부드럽게 흐림 처리.
