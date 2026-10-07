# 자막·로고 AI 지우기 키트 (Windows + RTX 3060 Ti)

블러 대신 **ProPainter**(앞뒤 프레임을 참고해 빈 곳을 메우는 AI)로 한국어 자막과 「명화관」 로고를 지운 영상을 만든다.
화면 전체가 아니라 **자막 띠(1080×320)와 로고 부분만** 처리해서 8GB VRAM으로 충분하고 빠르다.

## 1. 한 번만 설치 (약 20~30분)

명령 프롬프트(cmd)에서 한 줄씩 실행한다.

```bat
:: 1) 필요한 프로그램 (이미 있으면 건너뜀)
winget install -e --id Python.Python.3.10
winget install -e --id Git.Git
winget install -e --id Gyan.FFmpeg
:: 설치 후 명령 프롬프트를 닫았다가 다시 연다

:: 2) 키트 폴더로 이동 (erase.py, regions.json이 있는 폴더)
cd C:\cinetori\erase_win

:: 3) ProPainter 받기
git clone https://github.com/sczhou/ProPainter.git

:: 4) 가상환경 + 패키지
py -3.10 -m venv venv
venv\Scripts\activate
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
pip install -r ProPainter\requirements.txt
pip install opencv-python numpy

:: 5) GPU 인식 확인 → True 가 나와야 함
python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

모델 가중치는 첫 실행 때 자동으로 내려받는다(약 수백 MB).

## 2. 실행

```bat
cd C:\cinetori\erase_win
venv\Scripts\activate

:: 먼저 앞 20초만 테스트
python erase.py D:\영상\원본.mp4 --preview 20

:: 결과(원본_clean_preview.mp4)가 괜찮으면 전체
python erase.py D:\영상\원본.mp4
```

결과: 원본과 같은 폴더에 `원본_clean.mp4`(소리는 원본 그대로). 중간 파일은 `원본_erase_work` 폴더(지워도 됨).
예상 시간: 3060 Ti에서 20초 시험 약 1~2분, 3분 영상 약 10~20분(2026-10-07 측정 기준 추정).

## 3. 결과를 보낼 때

`원본_clean.mp4`를 드라이브에 올려 링크를 주면, 그 영상으로 일본어 음성·자막·BGM·시네트리 배지를 얹는다(블러 단계는 건너뜀).
가능하면 **원본 영상도 같이** 준다(한국어 자막을 읽어 번역해야 하므로).

## 4. 문제가 생기면

| 증상 | 해결 |
|---|---|
| `CUDA out of memory` | `regions.json`의 `chunk`(한 번에 처리할 프레임 수)를 240 → 150 → 100으로, `subvideo_length`를 60 → 40으로 줄인다 |
| 자막 일부가 남는다 | `dilate`를 15 → 21로 키운다 |
| 자막이 없는 곳까지 번진다 | `dilate`를 줄인다(11) |
| 원본 레이아웃이 다르다(자막 위치·로고 위치) | `regions.json`의 `box`를 바꾼다. 위치를 모르겠으면 원본 한 장면 캡처를 보내 주면 값을 알려 준다 |
| `torch.cuda.is_available()`가 False | NVIDIA 드라이버를 최신으로 업데이트 후 다시 확인 |

## 참고

- 단색 벽·어두운 배경은 거의 흔적 없이 지워진다. 얼굴·빠르게 움직이는 장면 위의 자막은 약간 번진 흔적이 남을 수 있다(그 위에 일본어 자막이 올라가 대부분 가려진다).
- 자막·로고를 지워도 영화나 원 편집자의 권리 문제가 해결되지는 않는다.
