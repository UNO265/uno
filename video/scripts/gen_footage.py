"""AI 実写カット（REAL / B-roll）を Gemini API（Veo・Imagen）でまとめて生成する。

  export GEMINI_API_KEY=...            # 環境変数（チャットに貼らない）
  python3 scripts/gen_footage.py --list-models          # 使える動画・画像モデルを確認
  python3 scripts/gen_footage.py --dry-run              # 送るプロンプトだけ表示（課金なし）
  python3 scripts/gen_footage.py                        # 全 15 カットを生成
  python3 scripts/gen_footage.py --only R1,R2,R13 --variants 2

- プロンプト: cases/<case>/footage_prompts.json（docs/case003-ai-footage-prompts.md から作成）
- 保存先: public/<case>/stock/<ファイル名>（候補が複数あるときは _v1, _v2 …）
- 生成した実写は「イメージ」。EVIDENCE にはしない（CLAUDE.md）。
- すでにファイルがあるカットは飛ばす（--force で作り直し）。
"""
import argparse
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_VIDEO_MODEL = "veo-3.0-fast-generate-001"
DEFAULT_IMAGE_MODEL = "imagen-4.0-generate-001"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--case", default="case003")
    ap.add_argument("--only", help="カンマ区切りのカット ID（例: R1,R2,T1）")
    ap.add_argument("--variants", type=int, default=1, help="1 カットあたりの候補数")
    ap.add_argument("--video-model", default=DEFAULT_VIDEO_MODEL)
    ap.add_argument("--image-model", default=DEFAULT_IMAGE_MODEL)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--list-models", action="store_true")
    args = ap.parse_args()

    spec = json.loads((ROOT.parent / "cases" / args.case / "footage_prompts.json").read_text(encoding="utf-8"))
    shots = spec["shots"]
    if args.only:
        want = set(args.only.split(","))
        shots = [s for s in shots if s["id"] in want]
    out_dir = ROOT / "public" / args.case / "stock"
    out_dir.mkdir(parents=True, exist_ok=True)

    def full_prompt(s: dict) -> str:
        aspect = "Aspect ratio 9:16, vertical framing, subject large in the center." if s["aspect"] == "9:16" else "Aspect ratio 16:9."
        if s["kind"] == "image":
            return s["prompt"]  # T1 は単独で完結したプロンプト
        return f'{s["prompt"]} {spec["style"]} {aspect}'

    if args.dry_run:
        for s in shots:
            print(f'--- {s["id"]} ({s["kind"]}, {s["aspect"]}) -> {s["file"]}\n{full_prompt(s)}\n')
        return

    from google import genai
    from google.genai import types

    client = genai.Client()  # GEMINI_API_KEY を読む

    if args.list_models:
        for m in client.models.list():
            name = m.name.split("/")[-1]
            if name.startswith(("veo", "imagen")):
                print(name)
        return

    def target(s: dict, k: int) -> Path:
        p = out_dir / s["file"]
        return p if args.variants == 1 else p.with_name(f"{p.stem}_v{k + 1}{p.suffix}")

    for s in shots:
        for k in range(args.variants):
            dst = target(s, k)
            if dst.exists() and not args.force:
                print(f'{s["id"]}: {dst.name} は既にあるので飛ばします')
                continue
            prompt = full_prompt(s)
            print(f'{s["id"]}: 生成中 → {dst.name}', flush=True)
            try:
                if s["kind"] == "image":
                    res = client.models.generate_images(
                        model=args.image_model,
                        prompt=prompt,
                        config=types.GenerateImagesConfig(number_of_images=1, aspect_ratio=s["aspect"]),
                    )
                    res.generated_images[0].image.save(str(dst))
                else:
                    op = client.models.generate_videos(
                        model=args.video_model,
                        prompt=prompt,
                        config=types.GenerateVideosConfig(
                            aspect_ratio=s["aspect"],
                            negative_prompt=spec["negative"],
                            number_of_videos=1,
                        ),
                    )
                    while not op.done:
                        time.sleep(10)
                        op = client.operations.get(op)
                    if op.error:
                        raise RuntimeError(op.error)
                    vid = op.response.generated_videos[0]
                    client.files.download(file=vid.video)
                    vid.video.save(str(dst))
                print(f'{s["id"]}: 保存しました {dst}', flush=True)
            except Exception as e:  # 1 カット失敗しても残りは続ける
                print(f'{s["id"]}: 失敗 {e}', file=sys.stderr, flush=True)


if __name__ == "__main__":
    main()
