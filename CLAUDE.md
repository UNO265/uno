# カネナゾ / KANENAZO

일본어 경제 미스터리 다큐멘터리 YouTube 채널의 영상 제작 레포.

- 모든 영상 제작은 `docs/KANENAZO_GUIDE.md`(마스터 지침 v1)를 따른다.
- **CASE #002부터는 `docs/KANENAZO_STYLE_v2.md`를 우선 적용한다.** CASE #001의 디자인을 복제하지 말고 영상 문법(질문 사다리, CLUE, EVIDENCE, MONEY FLOW, 회수형 엔딩)을 계승한다. 화면 타입 A~H를 교차시키고, EVIDENCE는 실제 근거가 있는 장면에만 붙인다.
- **CASE #003부터는 `docs/KANENAZO_GUIDE_v3.md`(v3.0)를 최우선 적용한다.** "Flat 2D 영상에 실사를 넣는" 것이 아니라 "다큐멘터리 안에서 필요한 순간에 Flat 2D를 쓰는" 영상이다. 화면 타입 A~J(REAL·EVIDENCE·DATA·GRAPH·FLAT 2D·MONEY FLOW·QUESTION/DARK·KEY TYPOGRAPHY·CLUE·DOCUMENTARY RESET)를 쓰고, 정보뿐 아니라 화면 질감(실사·문서·흰 화면·어두운 화면·2D)을 교차시킨다. 장면 설계 뒤에는 전체를 썸네일 크기로 펼쳐 베이지·Flat만 이어지지 않는지 확인한다.
- **대본은 `docs/KANENAZO_SCRIPT_GUIDE_v1.md`(대본 제작 MASTER GUIDELINE)를 따른다.**
  - 일본어 5,000~5,500자로 쓴다.
  - 숫자를 임의로 만들지 않는다(원가·이익률 주의). 売上≠利益.
  - 과거 자료를 현재 사실처럼 쓰지 않는다. 기업 의도를 단정하지 않는다.
  - 질문 사다리와 반전, 처음부터 이어지는 MONEY FLOW, 설명보다 발견을 지킨다.
  - 사용자가 확정한 주제·제목·질문·방향·결론은 임의로 바꾸지 않고, 사실 수정·표현 개선·중복 제거·논리 연결·근거 강화만 한다.
  - 사용자가 "최종 대본"을 요청하면 일본어 내레이션만 코드 블록 하나로 낸다.
- **CASE #004부터는 `docs/KANENAZO_RETENTION_v2.md`(롱폼 시청지속 지침 v2.0)를 대본 구조에 적용한다.** 질문 하나로 영상 전체를 끌지 않고 QUESTION CHAIN(질문 → 답 → 그 답에서 생긴 더 깊은 질문 → … → MID REVEAL → FINAL REVEAL)으로 쓴다. 첫 정보 보상은 2~3분 안에, 이후에도 2~3분마다 보상을 주고, MONEY FLOW는 단계적으로 공개하며, 결론은 PRICE MYSTERY에서 BUSINESS MODEL DISCOVERY로 발전해야 한다. **대본을 쓰기 전에 `docs/templates/question-chain-design.md`로 설계(CORE MYSTERY~FINAL ANSWER)를 먼저 사용자에게 제시하고, 방향이 확정된 뒤 대본을 쓴다.** 도입부는 11-1을 따른다: 0~5초에 대상 + 제목의 질문(화면 글자 + 첫 음성), 15초 안에 모순, 30초 안에 2~3분 안에 답할 QUESTION 1, 35초 안에 CASE 타이틀. 제출 전 RETENTION CHECK(23번)를 통과시킨다. 5,000자를 채우려고 반복하지 않는다. CASE #001~#003은 이 지침에 맞춰 다시 고치지 않는다(비교 데이터). **CASE #005부터는 같은 문서의 v2.1 보완(26~31번)도 적용한다**: 새 질문은 더 깊은 구조나 새 모순을 드러내야 하고, REWARD 뒤에 같은 답을 되풀이하지 않는다. 마지막 20%는 회수 구간(FINAL MONEY FLOW → 핵심 반전 → 최종 답 → 엔딩)이며, 앞에서 설명한 비용·편익을 내레이션으로 다시 나열하지 않고 화면으로 처리한다. 대본 완성 후 반복 설명 검사를 하고, 업로드 후에는 시청지속 그래프를 장면 번호와 함께 성과 기록에 적는다. 같은 문서 32~34번(#001·#002 그래프 근거)도 따른다: 타이틀 다음 첫 문장은 구체적인 내용(「まずは〜追いかけてみよう」 금지), REWARD 뒤 부연은 두 문장까지, 최종 답에서 고정 엔딩까지 60초 이내(요약 표현·목록 재나열 금지). 컷 분할 직후와 최종 음성 뒤에 `video/scripts/retention_check.py --case case00X`를 실행한다.
- 대본을 받으면 영상부터 만들지 말고, 먼저 실제 자료(특히 사용권이 확인된 REAL 실사)를 조사하고 장면 설계를 작성한다. CASE #003부터는 `docs/templates/scene-design-v3.md`, CASE #002는 `docs/templates/scene-design-v2.md`를 쓴다. 렌더링 직전에는 `docs/templates/prerender-checklist.md`를 모두 확인한다(CASE #003부터는 v3 추가 항목 포함).
- **CASE #003부터는 `docs/KANENAZO_PERFORMANCE_v1.md`(성과 개선 지침)도 함께 적용한다.** 우선순위는 TOPIC → TITLE → THUMBNAIL → 첫 5~30초 → STORY → VISUAL → 세부 애니메이션이다. 제목은 정해진 틀이 아니라 SEO(검색 표기·핵심 검색어를 앞에)·짧게(20자 안팎)·후킹(의문·대립·역설·의외의 숫자 중 하나)을 동시에 만족하게 만들고(성과 지침 4-1), 썸네일은 [물체 하나 + 숫자 하나 + 짧은 질문]으로 설계하고, 결론은 답을 먼저 말한 뒤 이유를 설명한다. **Shorts는 `docs/KANENAZO_SHORTS_v1.md`(쇼츠 지침서)를 따른다**: 목적은 궁금하게 만들어 롱폼으로 보내는 것, 한 편 = 작은 답 + 본편의 질문(본편 제목·썸네일 질문과 같은 말), 마지막 2초는 본편 썸네일과 같은 물체 + 질문(반복 재생 연출 없음), 한 CASE에 필수 2편(① 입구 ② 의외의 숫자) + 선택 1편(③ 실험). 채널의 주력은 롱폼이며 Shorts의 목적은 본편 유입이다(1차 지표: 関連動画 클릭·본편의 「Shorts 피드」 유입, 본편을 먼저 공개하고 Shorts에 関連動画 지정). Shorts는 롱폼의 축약판이 아니라 별도 콘텐츠로 설계한다(첫 프레임: 큰 제품 + 큰 숫자 + 짧은 질문, 한 편에 한 요소만 바꿔 실험). 업로드 전에는 `docs/templates/upload-checklist.md`를 확인하고, 업로드 후 데이터는 `docs/performance-log.md`에 기록한다.
- 최종 일본어 음성을 먼저 만들고, 실제 발화 길이에 장면·자막·BGM을 맞춘다(임시 TTS로 길이를 먼저 정하지 않는다).
- **CASE #010까지는 실사를 쓰지 않는다**(유료 스톡·AI 생성 실사 모두). v3의 REAL 자리는 `docs/KANENAZO_GUIDE_v3.md` 0번(임시 운용)의 **그래픽 질감**으로 채운다: OBJECT(큰 물체 하나), DOCUMENT(종이·표·영수증), DATA(흰 화면 숫자), DARK(암전 질문), BLUEPRINT(단면도·선화), TIMELINE/MAP, KEY TYPOGRAPHY. 베이지 Flat만 이어지지 않게 하는 원칙은 그대로다. AI 실사용 자료(`docs/case003-ai-footage-prompts.md`, `video/scripts/gen_footage.py`)는 CASE #011 이후를 위해 보관만 한다.
- 실제 사진·영상은 사용권이 확인된 것만 쓴다. 공개되어 있다는 이유만으로 쓰지 않는다. 자료가 없으면 카네나조 스타일 그래픽으로 대체한다.
- 영상 빌드 방법은 `video/README.md` 참고. 내레이션은 VOICEVOX 雀松朱司, BGM·효과음은 FluidR3_GM 기반 자체 제작(`docs/case001-audio-credits.md`).
