# カネナゾ / KANENAZO

일본어 경제 미스터리 다큐멘터리 YouTube 채널의 영상 제작 레포.

- 모든 영상 제작은 `docs/KANENAZO_GUIDE.md`(마스터 지침 v1)를 따른다.
- **CASE #002부터는 `docs/KANENAZO_STYLE_v2.md`를 우선 적용한다.** CASE #001의 디자인을 복제하지 말고 영상 문법(질문 사다리, CLUE, EVIDENCE, MONEY FLOW, 회수형 엔딩)을 계승한다. 화면 타입 A~H를 교차시키고, EVIDENCE는 실제 근거가 있는 장면에만 붙인다.
- **CASE #003부터는 `docs/KANENAZO_GUIDE_v3.md`(v3.0)를 최우선 적용한다.** "Flat 2D 영상에 실사를 넣는" 것이 아니라 "다큐멘터리 안에서 필요한 순간에 Flat 2D를 쓰는" 영상이다. 화면 타입 A~J(REAL·EVIDENCE·DATA·GRAPH·FLAT 2D·MONEY FLOW·QUESTION/DARK·KEY TYPOGRAPHY·CLUE·DOCUMENTARY RESET)를 쓰고, 정보뿐 아니라 화면 질감(실사·문서·흰 화면·어두운 화면·2D)을 교차시킨다. 장면 설계 뒤에는 전체를 썸네일 크기로 펼쳐 베이지·Flat만 이어지지 않는지 확인한다.
- 대본을 받으면 영상부터 만들지 말고, 먼저 실제 자료(특히 사용권이 확인된 REAL 실사)를 조사하고 장면 설계를 작성한다. CASE #003부터는 `docs/templates/scene-design-v3.md`, CASE #002는 `docs/templates/scene-design-v2.md`를 쓴다. 렌더링 직전에는 `docs/templates/prerender-checklist.md`를 모두 확인한다(CASE #003부터는 v3 추가 항목 포함).
- **CASE #003부터는 `docs/KANENAZO_PERFORMANCE_v1.md`(성과 개선 지침)도 함께 적용한다.** 우선순위는 TOPIC → TITLE → THUMBNAIL → 첫 5~30초 → STORY → VISUAL → 세부 애니메이션이다. 제목은 정해진 틀이 아니라 SEO(검색 표기·핵심 검색어를 앞에)·짧게(20자 안팎)·후킹(의문·대립·역설·의외의 숫자 중 하나)을 동시에 만족하게 만들고(성과 지침 4-1), 썸네일은 [물체 하나 + 숫자 하나 + 짧은 질문]으로 설계하고, 결론은 답을 먼저 말한 뒤 이유를 설명한다. Shorts는 롱폼의 축약판이 아니라 별도 콘텐츠로 설계한다(첫 프레임: 큰 제품 + 큰 숫자 + 짧은 질문, 한 편에 한 요소만 바꿔 실험). 업로드 전에는 `docs/templates/upload-checklist.md`를 확인하고, 업로드 후 데이터는 `docs/performance-log.md`에 기록한다.
- 최종 일본어 음성을 먼저 만들고, 실제 발화 길이에 장면·자막·BGM을 맞춘다(임시 TTS로 길이를 먼저 정하지 않는다).
- 실제 사진·영상은 사용권이 확인된 것만 쓴다. 공개되어 있다는 이유만으로 쓰지 않는다. 자료가 없으면 카네나조 스타일 그래픽으로 대체한다.
- 영상 빌드 방법은 `video/README.md` 참고. 내레이션은 VOICEVOX 雀松朱司, BGM·효과음은 FluidR3_GM 기반 자체 제작(`docs/case001-audio-credits.md`).
