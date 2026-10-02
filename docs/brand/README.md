# KANENAZO 브랜드 (2026-10 리뉴얼)

| 파일 | 용도 |
|---|---|
| `icon_nazo_800.png` | 채널 아이콘 800×800. 「ナゾ」(B안), 원형으로 잘려도 안전하도록 글자를 85%로 축소 |
| `watermark_150.png` | YouTube 브랜딩 워터마크 150×150, 원 밖은 투명 |
| `icon_preview_sizes.png` | 98·40·24px 원형 미리보기(흰/검 배경) |
| `icon_nazo_gpt_original.png` | 사용자 GPT 생성 원본(1254×1254) |

- 색: 주황 `#FF5A1F`, 검정 `#0B0B0C`(영상 `kinetic/kit.tsx`의 C.or / C.bg와 같다). GPT 원본(#FD570E)을 밝기 기준으로 두 색에 다시 매핑했다.
| `banner_2560.jpg` | 채널 배너 2560×1440. 배경 GPT(`banner_bg_gpt_original.png`, 업스케일) + 아이콘·「カネナゾ」·카피는 영상 서체(Dela Gothic One / Zen Kaku Gothic New / Space Mono) |
| `banner_safe_area_check.png` | 노랑 = 모든 기기에서 보이는 1546×423, 파랑 = PC 폭 |
| `banner_mobile_preview.png` | 휴대폰에서 보이는 범위 |
| `src/banner.html` | 배너 원본(카피 수정 후 headless Chrome으로 2560×1440 스크린샷) |

- 배너 카피: 「身近なお金のナゾを、数字で解く。」(Claude 추천안, 사용자 변경 가능)
