# CASE #003 AI 실사 영상 프롬프트 (ChatGPT / Gemini)

> **보류**: CASE #010까지는 실사를 쓰지 않기로 했다([v3 0번](KANENAZO_GUIDE_v3.md)). 이 문서와 `video/scripts/gen_footage.py`는 CASE #011 이후를 위해 보관한다.

유료 스톡 대신 AI로 실사 느낌의 영상(REAL 컷)을 만든다. 대본: [script_draft.txt](../cases/case003/script_draft.txt)

## 0. 사용 원칙

1. **AI 생성 영상은 "현실의 기록"이 아니다.**
   - EVIDENCE 라벨을 붙이지 않는다.
   - 화면 구석에 「イメージ」를 표시한다(기존 실사 슬롯의 label 기능).
2. **YouTube 공개 설정**: 업로드할 때 「改変または合成されたコンテンツ」(합성 콘텐츠) 공개 항목에서 「はい」를 선택한다. 사실적인 AI 영상이 들어간 영상은 공개 대상이다.
3. **넣지 않는 것**:
   - 실제 브랜드·로고·극장 이름(TOHO 등)
   - 실존 인물의 얼굴
   - 화면 속 글자와 숫자. AI가 글자를 틀리게 만들기 쉬우므로 가격·글자는 Remotion에서 따로 얹는다.
4. **사람은 얼굴 없이** 손·뒷모습·실루엣만 쓴다.
5. **이용 약관**: 공개 전에 각 서비스의 최신 상업 이용 조건을 확인한다.
6. **파일 넣는 곳**: 만든 파일은 `video/public/case003/stock/<파일명>`에 넣는다(아래 표의 파일명).

## 1. 공통 스타일 문구 (모든 프롬프트 끝에 붙임)

```
Photorealistic documentary cinematography, shot on a cinema camera with a 35mm lens, shallow depth of field, natural film grain, warm tungsten practical lights mixed with cool screen light, realistic textures, set in a modern Japanese multiplex cinema. No text, no letters, no numbers, no logos, no brand names, no watermarks, no recognizable faces.
```

- **16:9 본편용**: `Aspect ratio 16:9.`
- **9:16 쇼츠용**: `Aspect ratio 9:16, vertical framing, subject large in the center.`
- **영상 길이**: 컷당 5~8초. Gemini(Veo)는 한 번에 8초. ChatGPT(Sora)는 길이를 선택할 수 있다.

## 2. 컷 목록

| # | 파일명 | 대본 위치 | 목적 |
|---|---|---|---|
| R1 | R1_popcorn_overflow.mp4 | 0~5초 오프닝 | 첫 프레임, STOP |
| R2 | R2_popcorn_cup_hero.mp4 | 답(「答えは――」) 직전, 썸네일 | 한 컵의 클로즈업 |
| R3 | R3_ingredients.mp4 | 「原料は、乾燥したトウモロコシと、油と、塩」 | 원료가 싸다는 현실 |
| R4 | R4_scoop_handoff.mp4 | 매점 파트 「ここで、ポップコーンに戻ろう」 | 판매 과정 |
| R5 | R5_lobby.mp4 | 「まずは、チケット代を追いかけてみよう」 | 챕터 시작, REALITY RESET |
| R6 | R6_ticket_kiosk.mp4 | 티켓 구입 | 돈이 들어가는 순간 |
| R7 | R7_projection_room.mp4 | 비용 「映写機」 | 설비 |
| R8 | R8_screen_speakers.mp4 | 비용 「巨大なスクリーン」「音響設備」 | 설비의 규모 |
| R9 | R9_empty_seats.mp4 | 「平日の昼。雨の日。」 | 빈 좌석 = 멈추지 않는 비용 |
| R10 | R10_rainy_entrance.mp4 | 「雨の日」 | 한산한 극장 입구 |
| R11 | R11_cleaning.mp4 | 「清掃。スタッフの人件費。」 | 사람의 일 |
| R12 | R12_walk_with_popcorn.mp4 | MONEY FLOW 직전 | 관객이 팝콘을 들고 이동 |
| R13 | R13_lights_dim.mp4 | 엔딩 「この暗くて、大きくて、静かな場所」 | 결말 |
| T1 | T1_thumbnail.png | 썸네일 배경 | 1 OBJECT |
| S1 | S1_popcorn_vertical.mp4 | 쇼츠 첫 프레임 | 9:16 |

---

## 3. 프롬프트

각 컷은 **(A) 영상 프롬프트**(ChatGPT Sora / Gemini Veo 공통)와 **(B) 이미지 프롬프트**(ChatGPT·Gemini 이미지 생성)로 되어 있다.
- 영상 생성이 어려우면 (B)로 이미지를 만든다. Remotion에서 천천히 확대해 쓰거나, 그 이미지를 영상 생성에 첫 프레임으로 넣는다.
- 모든 프롬프트 끝에 **1. 공통 스타일 문구**와 비율 문구를 붙인다.

### R1 팝콘이 넘쳐 나오는 기계 (오프닝, 가장 중요)
(A) 영상
```
Extreme close-up of a commercial popcorn machine kettle in a cinema concession stand. Freshly popped white popcorn bursts and overflows from the glass case, kernels popping in slow motion, steam and warm golden light behind the glass. The camera slowly pushes in. Sound: crisp popping and a soft hum of the machine, no music.
```
(B) 이미지
```
Extreme close-up of a glass popcorn machine overflowing with freshly popped white popcorn, a few kernels frozen mid-air, warm golden backlight, dark background, crisp detail on each piece.
```

### R2 팝콘 한 컵 (답 직전·썸네일 겸용)
(A) 영상
```
A single large paper cup filled to the top with fresh salted popcorn, placed on a dark counter in a dim cinema lobby. The cup is plain white and red striped with no printing. Soft warm key light from the side, bokeh of cinema lobby lights in the background. Very slow orbit around the cup, a few pieces fall from the top.
```
(B) 이미지
```
Hero product shot of a plain red-and-white striped paper popcorn cup overflowing with fresh popcorn on a dark counter, warm side light, blurred cinema lobby lights in the background, empty space on the right side of the frame for text.
```

### R3 원료: 옥수수 알갱이·기름·소금
(A) 영상
```
Top-down macro shot on a stainless steel prep table: a scoop of dry yellow popcorn kernels poured slowly into a small metal bowl, next to a clear bottle of cooking oil and a small dish of fine salt. Simple, clean, neutral light. The kernels bounce and settle.
```
(B) 이미지
```
Top-down macro still life on a stainless steel table: a small pile of dry yellow popcorn kernels, a clear bottle of cooking oil and a small dish of fine salt, clean neutral light, minimal composition.
```

### R4 매점에서 퍼 담아 건네기
(A) 영상
```
Close-up at a cinema concession counter: a staff member's hands in a dark uniform and thin disposable gloves scoop popcorn from the machine into a plain striped paper cup, then hand it across the counter to a customer's hands. Only hands are visible, no faces. Warm counter lights, shallow depth of field.
```
(B) 이미지
```
Close-up of gloved hands handing a plain striped popcorn cup across a cinema concession counter to a customer's hands, only hands visible, warm counter lights.
```

### R5 영화관 로비 (챕터 시작)
(A) 영상
```
Wide shot of a modern Japanese multiplex cinema lobby in the evening: dark carpet with subtle patterns, a long concession counter glowing in the background, blank illuminated poster frames on the wall, a few visitors walking as soft silhouettes, slow sideways dolly movement. Signs and posters are blank or blurred.
```
(B) 이미지
```
Wide shot of a modern Japanese multiplex cinema lobby at night, dark patterned carpet, glowing concession counter in the background, blank illuminated poster frames, a few people as soft blurred silhouettes.
```

### R6 티켓 발권기
(A) 영상
```
Close-up of a row of self-service ticket kiosks in a cinema lobby. A person's hand touches the blank glowing touchscreen, then takes a printed paper ticket from the slot. The screen shows only soft abstract light, no readable text. Shallow depth of field.
```
(B) 이미지
```
Close-up of a hand taking a blank paper ticket from a self-service ticket kiosk in a cinema lobby, screen glowing with abstract light and no readable text.
```

### R7 영사실·영사기
(A) 영상
```
Inside a dark cinema projection room: a modern digital cinema projector with its lens glowing, a bright beam of light cutting through faint haze toward a small window. Cooling fans hum. Slow push-in toward the lens.
```
(B) 이미지
```
Dark cinema projection room, a modern digital projector with a glowing lens, a bright beam of light through faint haze toward a small window.
```

### R8 거대한 스크린과 스피커
(A) 영상
```
Low-angle wide shot from the front rows of an empty large cinema auditorium: a huge blank white screen, wall-mounted speakers along the side walls, rows of red seats. The house lights are half on. Slow upward tilt revealing the scale of the screen.
```
(B) 이미지
```
Low-angle wide shot of an empty large cinema auditorium, a huge blank white screen, wall-mounted speakers on the side walls, rows of red seats, house lights half on.
```

### R9 평일 낮의 빈 좌석
(A) 영상
```
Wide shot of a cinema auditorium during a weekday afternoon screening: only two or three people seated far apart, seen from behind as silhouettes, most red seats empty, the soft flicker of the screen light on the empty rows. Static camera, quiet mood.
```
(B) 이미지
```
Cinema auditorium with almost all red seats empty, two or three viewers seen from behind as small silhouettes, soft screen light flickering over empty rows.
```

### R10 비 오는 날의 극장 입구
(A) 영상
```
Exterior of a modern cinema entrance in a Japanese city on a rainy weekday afternoon: wet pavement reflecting warm lights, one person with a transparent umbrella walking past, glass doors with no signage or blurred signage, very few people. Static camera, rain falling.
```
(B) 이미지
```
Exterior of a modern cinema entrance in a Japanese city on a rainy afternoon, wet pavement reflecting warm lights, one person with a transparent umbrella, glass doors with no readable signs.
```

### R11 상영 사이의 청소
(A) 영상
```
Inside a cinema auditorium between screenings with house lights on: a staff member seen from behind in a dark uniform walks along a row of seats with a dustpan and broom, collecting spilled popcorn. No face visible. Medium shot, handheld, gentle movement.
```
(B) 이미지
```
Cinema auditorium with house lights on, a staff member seen from behind with a broom and dustpan collecting spilled popcorn between seats, no face visible.
```

### R12 팝콘을 들고 상영관으로 가는 관객
(A) 영상
```
Following shot from behind: a visitor carrying a plain striped popcorn cup and a drink walks down a dim cinema corridor toward the auditorium entrance, warm wall lights passing by. Only the back and hands are visible. Smooth gimbal movement.
```
(B) 이미지
```
View from behind of a person holding a plain striped popcorn cup and a drink, walking down a dim cinema corridor toward an auditorium entrance, warm wall lights.
```

### R13 불이 꺼지는 객석 (엔딩)
(A) 영상
```
Inside a cinema auditorium seen from the back rows: the house lights slowly dim to darkness, the screen begins to glow and its light falls on the backs of the audience's heads as silhouettes. One person in the foreground holds a popcorn cup. Static shot, the dimming happens over about five seconds.
```
(B) 이미지
```
Cinema auditorium from the back rows just after the lights dim, screen glow falling on silhouettes of the audience, a popcorn cup held in the foreground.
```

### T1 썸네일 배경 (이미지만)
```
Photorealistic close-up of a plain red-and-white striped paper cup overflowing with popcorn against a very dark background, strong warm rim light, popcorn pieces sharp and bright, the cup placed on the left third of the frame, large empty dark space on the right two thirds for big text. High contrast, readable at small size. Aspect ratio 16:9, 1280x720. No text, no logos.
```
→ 「原価は？」 같은 글자는 이미지 위에 따로 넣는다(AI가 글자를 넣게 하지 않는다).

### S1 쇼츠 첫 프레임용 세로 컷
(A) 영상
```
Vertical close-up: fresh popcorn overflowing from a glass popcorn machine and falling toward the camera, filling most of the frame, warm golden light, dark background. Slow motion. Sound: popping. Aspect ratio 9:16.
```

---

## 4. 서비스별 사용 팁

**Gemini (Veo)**
- 영상 프롬프트를 그대로 넣는다. 8초 영상이 소리와 함께 나온다.
- 음악이 섞이지 않게 `Sound: ... no music`을 유지한다. BGM은 우리가 따로 넣는다.

**ChatGPT**
- 이미지: (B) 프롬프트를 쓴다.
- 영상(Sora): (A) 프롬프트를 쓰고, 길이는 5~8초로 한다.
- 이미지를 먼저 만들고 그 이미지로 영상을 만들면 컷끼리 분위기를 맞추기 쉽다.

**공통**
- 컷마다 2~4개씩 만들어서 고른다. 아래 항목을 확인한다.
  - 손가락·컵 모양이 이상하지 않은가
  - 글자처럼 보이는 얼룩이나 가짜 로고가 없는가
  - 팝콘이 흐물거리거나 녹아 보이지 않는가
- 컵은 항상 「무늬 없는 빨강·흰 줄무늬 종이컵」으로 통일해서 컷 사이의 일관성을 지킨다.
- 결과물은 가능하면 1080p 이상, MP4로 받는다.
